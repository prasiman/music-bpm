import Agent from '../src/Agent'
import { expect, describe, test } from '@jest/globals'

describe("Agent", function () {
  describe("clone", function () {
    test("should return object clone", function () {
      const agents = [];
      const agent = new Agent(0.33, 0.11, 1, agents);
      agent.considerEvent(0.44, 1);
      agent.considerEvent(1.29, 1);
      agent.considerEvent(2.84, 1);
      agent.considerEvent(3.23, 1);
      agent.considerEvent(4.53, 1);
      agent.considerEvent(5.2, 1);
      const clone = agent.clone();

      expect(agent).toStrictEqual(clone);
    });
  });
  describe("considerEvent", function () {
    test("should accept event depending on state, event time and parameters", function () {
      const agents = [];
      const agent = new Agent(0.33, 0.11, 0, agents);

      expect(agent.considerEvent(0.44, 1)).toBe(true);
      expect(agent.considerEvent(1.1, 1)).toBe(true);
      expect(agent.considerEvent(1.38, 1)).toBe(false);

      const clone = agent.clone();

      expect(agent.considerEvent(1.48, 1)).toBe(true);
      expect(agents[0]).toEqual(clone);
      expect(agent.considerEvent(11.5, 1)).toBe(false);

      const expected = {
        beatInterval: 0.331,
        initialBeatInterval: 0.33,
        beatTime: 1.48,
        totalBeatCount: 5,
        events: [0.11, 0.44, 1.1, 1.48],
        expiryTime: 10,
        toleranceWndInner: 0.04,
        toleranceWndPre: 0.33 * 0.15,
        toleranceWndPost: 0.33 * 0.3,
        correctionFactor: 50,
        maxChange: 0.2,
        penaltyFactor: 0.5,
        score: -1,
        agentListRef: agents
      };

      expect(agent).toEqual(expected);
    });
  });
  describe("acceptEvent", function () {
    test("should change state depending on parameters", function () {
      const agents: Agent[] = [];
      const agent = new Agent(0.47, 1.25, 0, agents);
      agent.acceptEvent(1.72, 12, 0, 1);

      expect(agent.events[agent.events.length - 1]).toEqual(1.72)
      expect(agent.beatTime).toEqual(1.72)
      expect(agent.beatInterval).toEqual(0.47);
      expect(agent.totalBeatCount).toEqual(2);
      expect(agent.score).toEqual(12);

      let err = 0.5;
      agent.acceptEvent(1.72, 4, err, 3);

      expect(agent.events[agent.events.length - 1]).toEqual(1.72);
      expect(agent.beatTime).toEqual(1.72)
      expect(agent.beatInterval).toEqual(0.47 + err / 50);
      expect(agent.totalBeatCount).toEqual(5);

      let errFactor = err / (0.47 * 0.3);
      const score = 12 + (4 * (1 - 0.5 * errFactor));

      expect(agent.score).toEqual(score);

      err = -9;
      agent.acceptEvent(2.6, 10, err, 1);

      expect(agent.events[agent.events.length - 1]).toEqual(2.6);
      expect(agent.beatTime).toEqual(2.6);
      expect(agent.beatInterval).toEqual(0.48)
      expect(agent.totalBeatCount).toEqual(6);

      errFactor = err / (0.47 * -0.15);

      expect(agent.score).toEqual(score + (10 * (1 - 0.5 * errFactor)));
    });
  });
  describe("fillBeats", function () {
    test("should interpolate missing beats", function () {
      const agents = [];
      const agent = new Agent(0.5, 0.01, 0, agents);
      agent.events = [0.01, 1.01, 2.51];
      agent.fillBeats();

      const expected = [0.01, 0.51, 1.01, 1.51, 2.01, 2.51];

      expect(agent.events).toStrictEqual(expected);
    });
  });
});