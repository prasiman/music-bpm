'use strict';

var Agent = require('./Agent.js');

const defaultBeatTrackingOptions = {
    initPeriod: 5,
    thresholdBI: 0.02,
    thresholdBT: 0.04,
    expiryTime: 10,
    toleranceWndInner: 0.04,
    toleranceWndPre: 0.15,
    toleranceWndPost: 0.3,
    correctionFactor: 50,
    maxChange: 0.2,
    penaltyFactor: 0.5,
};
function trackBeat(events, eventsScores, tempoList, { initPeriod = 5, thresholdBI = 0.02, thresholdBT = 0.04, expiryTime = 10, toleranceWndInner = 0.04, toleranceWndPre = 0.15, toleranceWndPost = 0.3, correctionFactor = 50, maxChange = 0.2, penaltyFactor = 0.5, } = defaultBeatTrackingOptions) {
    let agents = [];
    function removeSimilarAgents() {
        agents.sort((a1, a2) => a1.beatInterval - a2.beatInterval);
        const length = agents.length;
        for (let i = 0; i < length; i++) {
            if (agents[i].score < 0)
                continue;
            for (let j = i + 1; j < length; j++) {
                if (agents[j].beatInterval - agents[i].beatInterval > thresholdBI) {
                    break;
                }
                if (Math.abs(agents[j].beatTime - agents[i].beatTime) > thresholdBT) {
                    continue;
                }
                if (agents[i].score < agents[j].score) {
                    agents[i].score = -1;
                }
                else {
                    agents[j].score = -1;
                }
            }
        }
        for (let i = length - 1; i >= 0; i--) {
            if (agents[i].score < 0) {
                agents.splice(i, 1);
            }
        }
    }
    for (let i = 0; i < tempoList.length; i++) {
        agents.push(new Agent.default(tempoList[i], events[0], eventsScores[0], agents, {
            expiryTime,
            toleranceWndInner,
            toleranceWndPre,
            toleranceWndPost,
            correctionFactor,
            maxChange,
            penaltyFactor,
        }));
    }
    let j = 1;
    removeSimilarAgents();
    while (events[j] < initPeriod) {
        let agentsLength = agents.length;
        let prevBeatInterval = -1;
        let isEventAccepted = true;
        for (let k = 0; k < agentsLength; k++) {
            if (agents[k].beatInterval != prevBeatInterval) {
                if (!isEventAccepted) {
                    agents.push(new Agent.default(prevBeatInterval, events[j], eventsScores[j], agents, {
                        expiryTime,
                        toleranceWndInner,
                        toleranceWndPre,
                        toleranceWndPost,
                        correctionFactor,
                        maxChange,
                        penaltyFactor,
                    }));
                }
                prevBeatInterval = agents[k].beatInterval;
                isEventAccepted = false;
            }
            isEventAccepted =
                agents[k].considerEvent(events[j], eventsScores[j]) || isEventAccepted;
        }
        removeSimilarAgents();
        j++;
    }
    const eventsLength = events.length;
    for (let i = j; i < eventsLength; i++) {
        let agentsLength = agents.length;
        for (let j = 0; j < agentsLength; j++) {
            agents[j].considerEvent(events[i], eventsScores[i]);
        }
        removeSimilarAgents();
    }
    return agents;
}

exports.trackBeat = trackBeat;
