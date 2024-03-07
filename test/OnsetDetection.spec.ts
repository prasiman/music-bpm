import { promisify } from 'node:util'
import { readFile } from 'node:fs/promises'
import { unzip as baseUnzip } from 'node:zlib'
import { describe, test, expect } from '@jest/globals'
import { calculateSpectralFlux, normalize, findPeaks } from '../src/OnsetDetection'

const unzip = promisify(baseUnzip);

describe("OnsetDetection", function () {
  describe("calculateSpectralFlux", function () {
    test("should return spectral flux", async function () {
      const buffer = await readFile("./test/data/PCM.data.gz");
      const bytes = await unzip(buffer);
      const audioData = Array.from(new Float64Array(bytes.buffer));

      const actual = calculateSpectralFlux(audioData);

      const data = await readFile("./test/data/spectralFlux.data", "utf-8");
      const expected = JSON.parse(data);
      expect(actual.length).toBe(expected.length);

      const delta = 1e-13;
      for (let i = 0; i < expected.length; i++) {
        expect(actual[i]).toBeCloseTo(expected[i], delta);
      }
    }, 15000);
  });
  describe("normalize", function () {
    test("should normalize array to have a mean of 0 and standard deviation of 1", function () {
      const N = 1000;
      const array: number[] = [];
      for (let i = 0; i < N; i++) {
        array[i] = Math.random() * 2000 - 1000;
      }

      const actual = normalize(array);

      let mean = 0;
      let sqrSum = 0;
      for (let i = 0; i < N; i++) {
        mean += actual[i];
      }
      mean /= N;
      for (let i = 0; i < N; i++) {
        sqrSum += Math.pow(actual[i] - mean, 2);
      }
      const stdDevation = Math.sqrt(sqrSum / N);
      const delta = 1e-12;

      expect(mean).toBeCloseTo(0, delta);
      expect(stdDevation).toBeCloseTo(1, delta);
    });
  });
  describe("findPeaks", function () {
    test("should return peaks array", async function () {
      const file = await readFile("./test/data/spectralFluxNorm.data", "utf-8");
      const inputData = JSON.parse(file);

      var actual = findPeaks(inputData);

      const file2 = await readFile("./test/data/peaks.data", "utf-8");
      const expected = JSON.parse(file2);

      expect(actual).toStrictEqual(expected);
    });
  });
});