import Agent from "./Agent.js";
/**
 * Perform beat tracking on a array of onsets
 * @param {Array} events - the array of onsets to beat track
 * @param {Array} eventsScores - the array of corresponding salience values
 * @param {Array} tempoList - the array of tempo hypothesis
 * @param {Object} [params={}] - parameters
 * @param {Number} [params.initPeriod=5] - duration of the initial section
 * @param {Number} [params.thresholdBI=0.02] - for the purpose of removing duplicate agents, the default JND of IBI
 * @param {Number} [params.thresholdBT=0.04] - for the purpose of removing duplicate agents, the default JND of phase
 * @param {Number} [params.expiryTime=10] - the time after which an Agent that has not accepted any beat will be destroyed
 * @param {Number} [params.toleranceWndInner=0.04] - the maximum time that a beat can deviate from the predicted beat time without a fork occurring
 * @param {Number} [params.toleranceWndPre=0.15] - the maximum amount by which a beat can be earlier than the predicted beat time, expressed as a fraction of the beat period
 * @param {Number} [params.toleranceWndPost=0.3] - the maximum amount by which a beat can be later than the predicted beat time, expressed as a fraction of the beat period
 * @param {Number} [params.correctionFactor=50] - correction factor for updating beat period
 * @param {Number} [params.maxChange=0.2] - the maximum allowed deviation from the initial tempo, expressed as a fraction of the initial beat period
 * @param {Number} [params.penaltyFactor=0.5] - factor for correcting score, if onset do not coincide precisely with predicted beat time
 * @return {Array} agents - agents array
 */
type trackBeatOptions = {
    initPeriod?: number;
    thresholdBI?: number;
    thresholdBT?: number;
    expiryTime?: number;
    toleranceWndInner?: number;
    toleranceWndPre?: number;
    toleranceWndPost?: number;
    correctionFactor?: number;
    maxChange?: number;
    penaltyFactor?: number;
};
declare function trackBeat(events: any, eventsScores: any, tempoList: any, { initPeriod, thresholdBI, thresholdBT, expiryTime, toleranceWndInner, toleranceWndPre, toleranceWndPost, correctionFactor, maxChange, penaltyFactor, }?: trackBeatOptions): Agent[];
export { trackBeat };
