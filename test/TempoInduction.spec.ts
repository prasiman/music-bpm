import { readFile } from 'node:fs/promises'
import { expect, describe, test } from '@jest/globals'
import {
  mergeClusters,
  calculateScore,
  createTempoList,
  processRhythmicEvents,
} from '../src/TempoInduction'

describe("TempoInduction", function () {
  describe("processRhythmicEvents", function () {
    test("should return object with IOI intervals", async function () {
      const data = await readFile("./test/data/peaks.data", "utf-8");
      const peaks = JSON.parse(data);
      const events = peaks.map(function (a) { return a * 0.01 });
      const actual = processRhythmicEvents(events);

      const data2 = await readFile("./test/data/clustersIntervals.data", "utf-8");
      const data3 = await readFile("./test/data/clustersSizes.data", "utf-8");

      const expected = {
        clIntervals: JSON.parse(data2),
        clSizes: JSON.parse(data3),
      };

      expect(actual).toStrictEqual(expected);
    });
  });
  describe("mergeClusters", function () {
    test("should return object with merged IOI intervals", async function () {

      const data = await readFile("./test/data/clustersIntervals.data", "utf-8");
      const data2 = await readFile("./test/data/clustersSizes.data", "utf-8");

      const input = {
        clIntervals: JSON.parse(data),
        clSizes: JSON.parse(data2),
      };

      const actual = mergeClusters(input);

      const data3 = await readFile("./test/data/clustersIntervalsMerged.data", "utf-8");
      const data4 = await readFile("./test/data/clustersSizesMerged.data", "utf-8");

      const expected = {
        clIntervals: JSON.parse(data3),
        clSizes: JSON.parse(data4),
      };

      expect(actual).toStrictEqual(expected);
    });
  });
  describe("calculateScore", function () {
    test("should return object with IOI intervals scores", async function () {
      const data = await readFile("./test/data/clustersIntervalsMerged.data", "utf-8");
      const data2 = await readFile("./test/data/clustersSizesMerged.data", "utf-8");
      const input = {
        clIntervals: JSON.parse(data),
        clSizes: JSON.parse(data2),
      };

      const actual = calculateScore(input);


      const data3 = await readFile("./test/data/clustersScores.data", "utf-8");
      const data4 = await readFile("./test/data/clustersScoresIdxs.data", "utf-8");

      const expected = {
        clScores: JSON.parse(data3),
        clScoresIdxs: JSON.parse(data4),
      };

      expect(actual).toStrictEqual(expected);
    });
  });
  describe("createTempoList", function () {
    test("should return array with tempos", async function () {
      const data = await readFile("./test/data/clustersIntervalsMerged.data", "utf-8");
      const data2 = await readFile("./test/data/clustersSizesMerged.data", "utf-8");
      const data3 = await readFile("./test/data/clustersScores.data", "utf-8");
      const data4 = await readFile("./test/data/clustersScoresIdxs.data", "utf-8");
      const data5 = await readFile("./test/data/tempoList.data", "utf-8");

      const input = {
        clIntervals: JSON.parse(data),
        clSizes: JSON.parse(data2),
        clScores: JSON.parse(data3),
        clScoresIdxs: JSON.parse(data4),
      }

      const actual = createTempoList(input);
      const expected = JSON.parse(data5);

      expect(actual).toStrictEqual(expected);
    });
  });
});