type extractTempoParams = {
    bufferSize?: number;
    hopSize?: number;
    timeStep?: number;
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
    decayRate?: number;
    widthTreshold?: number;
    maxIOI?: number;
    minIOI?: number;
    peakFindingWindow?: number;
    meanWndMultiplier?: number;
    peakThreshold?: number;
    maxTempos?: number;
    minBeatInterval?: number;
    maxBeatInterval?: number;
};
declare function extractTempo(audioData: number[] | Float32Array, { timeStep, bufferSize, // FFT windows size
hopSize, // spacing of audio frames in samples
decayRate, // how quickly previous peaks are forgotten
peakFindingWindow, // minimum distance between peaks
meanWndMultiplier, // multiplier for peak finding window
peakThreshold, // minimum value of peaks
widthTreshold, // the maximum difference in IOIs which are in the same cluster
maxIOI, // the maximum IOI for inclusion in a cluster
minIOI, // the minimum IOI for inclusion in a cluster
maxTempos, // initial amount of tempo hypotheses
minBeatInterval, // the minimum inter-beat interval (IBI) (0.30 seconds == 200 BPM)
maxBeatInterval, // the maximum inter-beat interval (IBI) (1.00 seconds ==  60 BPM)
initPeriod, // duration of the initial section
thresholdBI, // for the purpose of removing duplicate agents, the default JND of IBI
thresholdBT, // for the purpose of removing duplicate agents, the default JND of phase
expiryTime, // the time after which an Agent that has not accepted any beat will be destroyed
toleranceWndInner, // the maximum time that a beat can deviate from the predicted beat time without a fork occurring
toleranceWndPre, // the maximum amount by which a beat can be earlier than the predicted beat time, expressed as a fraction of the beat period
toleranceWndPost, // the maximum amount by which a beat can be later than the predicted beat time, expressed as a fraction of the beat period
correctionFactor, // correction factor for updating beat period
maxChange, // the maximum allowed deviation from the initial tempo, expressed as a fraction of the initial beat period
penaltyFactor, }?: extractTempoParams): {
    tempo: number;
    beatInterval: any;
    beats: any;
};
export { extractTempo as default, extractTempo };
