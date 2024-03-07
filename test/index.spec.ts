import { promisify } from 'node:util'
import { readFile } from 'node:fs/promises'
import { unzip as baseUnzip } from 'node:zlib'
import { describe, test, expect } from '@jest/globals'
import { extractTempo } from '../src';

const unzip = promisify(baseUnzip);

describe("MusicTempo", function () {
  test("should calculate music tempo", async function () {
    const buffer = await readFile("./test/data/PCM.data.gz");
    const bytes = await unzip(buffer);
    const audioData = Array.from(new Float64Array(bytes.buffer));

    const data = await readFile("./test/data/bestAgent.data", "utf-8");
    const expected = JSON.parse(data);

    const actual = extractTempo(audioData);

    expect(actual.beatInterval).toEqual(expected.beatInterval);
    expect(actual.beats).toStrictEqual(expected.events);
  }, 15000);
});