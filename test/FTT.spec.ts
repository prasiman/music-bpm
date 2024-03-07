import { readFile } from 'node:fs/promises'
import { expect, describe, test } from '@jest/globals'
import { getHammingWindow, getSpectrum } from '../src/FFT'

describe("FFT", function() {
  describe("getHammingWindow", function() {
    test("should return hamming window array", async function() {
      const actual = getHammingWindow(2048);
      const data = await readFile("./test/data/hammingWindow2048.data", "utf-8");
      const expected = JSON.parse(data);
      
      expect(actual.length).toEqual(expected.length);      

      const delta = 1e-17;
      for (var i = 0; i < actual.length; i++) {
        expect(actual[i]).toBeCloseTo(expected[i], delta);        
      }
    });
  });
  describe("getSpectrum", function() {
    test("should return spectrum of FFT", async function() {
      const file = await readFile("./test/data/inputFrame.data", "utf-8");
      const inputData = JSON.parse(file);

      const im: number[] = [];
      for (var j = 0; j < 2048; j++) im[j] = 0;
      getSpectrum(inputData, im);
      const actual = inputData;

      const file2 = await readFile("./test/data/spectrum.data", "utf-8");
      var expected = JSON.parse(file2);

      expect(actual).toStrictEqual(expected);      
    });
  });  
});