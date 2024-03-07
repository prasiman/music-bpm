import { readFile } from 'node:fs/promises'
import { expect, describe, test } from '@jest/globals'
import { trackBeat } from '../src/BeatTracking'

describe("BeatTracking", function () {
  describe("trackBeat", function () {
    test("should return array with agents", async function () {
      let input = {};
      const data = await readFile("./test/data/events.data", "utf-8");
      const events = JSON.parse(data);

      const data2 = await readFile("./test/data/saliences.data", "utf-8");
      const saliences = JSON.parse(data2);

      const data3 = await readFile("./test/data/tempoList.data", "utf-8");
      const tempoList = JSON.parse(data3);

      const actual = trackBeat(events, saliences, tempoList);

      const data4 = await readFile("./test/data/agents.data", "utf-8");
      const expected = JSON.parse(data4);

      expect(actual.length).toBe(expected.length);

      for (var i = 0; i < actual.length; i++) {
        expect(actual[i].score).toEqual(expected[i].phaseScore);
        expect(actual[i].beatTime).toEqual(expected[i].beatTime);
        expect(actual[i].beatInterval).toEqual(expected[i].beatInterval);
        expect(actual[i].totalBeatCount).toEqual(expected[i].totalBeatCount);
        expect(actual[i].events).toStrictEqual(expected[i].events);
      }
    });
  });
});