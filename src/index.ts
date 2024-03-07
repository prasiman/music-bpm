import { findPeaks, normalize, calculateSpectralFlux } from "./OnsetDetection";
import {
  processRhythmicEvents,
  mergeClusters,
  calculateScore,
  createTempoList,
} from "./TempoInduction";
import { trackBeat } from "./BeatTracking";

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

const defaultExtractTempoOptions: extractTempoParams = {
  timeStep: 0.01,
  bufferSize: 2048, // FFT windows size
  hopSize: 441, // spacing of audio frames in samples
  decayRate: 0.84, // how quickly previous peaks are forgotten
  peakFindingWindow: 6, // minimum distance between peaks
  meanWndMultiplier: 3, // multiplier for peak finding window
  peakThreshold: 0.35, // minimum value of peaks
  widthTreshold: 0.025, // the maximum difference in IOIs which are in the same cluster
  maxIOI: 2.5, // the maximum IOI for inclusion in a cluster
  minIOI: 0.07, // the minimum IOI for inclusion in a cluster
  maxTempos: 10, // initial amount of tempo hypotheses
  minBeatInterval: 0.3, // the minimum inter-beat interval (IBI) (0.30 seconds == 200 BPM)
  maxBeatInterval: 1, // the maximum inter-beat interval (IBI) (1.00 seconds ==  60 BPM)
  initPeriod: 5, // duration of the initial section
  thresholdBI: 0.02, // for the purpose of removing duplicate agents, the default JND of IBI
  thresholdBT: 0.04, // for the purpose of removing duplicate agents, the default JND of phase
  expiryTime: 10, // the time after which an Agent that has not accepted any beat will be destroyed
  toleranceWndInner: 0.04, // the maximum time that a beat can deviate from the predicted beat time without a fork occurring
  toleranceWndPre: 0.15, // the maximum amount by which a beat can be earlier than the predicted beat time, expressed as a fraction of the beat period
  toleranceWndPost: 0.3, // the maximum amount by which a beat can be later than the predicted beat time, expressed as a fraction of the beat period
  correctionFactor: 50, // correction factor for updating beat period
  maxChange: 0.2, // the maximum allowed deviation from the initial tempo, expressed as a fraction of the initial beat period
  penaltyFactor: 0.5, // factor for correcting score, if onset do not coincide precisely with predicted beat time
}

export function extractTempo(
  audioData: number[] | Float32Array,
  {
    timeStep = 0.01,
    bufferSize = 2048, // FFT windows size
    hopSize = 441, // spacing of audio frames in samples
    decayRate = 0.84, // how quickly previous peaks are forgotten
    peakFindingWindow = 6, // minimum distance between peaks
    meanWndMultiplier = 3, // multiplier for peak finding window
    peakThreshold = 0.35, // minimum value of peaks
    widthTreshold = 0.025, // the maximum difference in IOIs which are in the same cluster
    maxIOI = 2.5, // the maximum IOI for inclusion in a cluster
    minIOI = 0.07, // the minimum IOI for inclusion in a cluster
    maxTempos = 10, // initial amount of tempo hypotheses
    minBeatInterval = 0.3, // the minimum inter-beat interval (IBI) (0.30 seconds == 200 BPM)
    maxBeatInterval = 1, // the maximum inter-beat interval (IBI) (1.00 seconds ==  60 BPM)
    initPeriod = 5, // duration of the initial section
    thresholdBI = 0.02, // for the purpose of removing duplicate agents, the default JND of IBI
    thresholdBT = 0.04, // for the purpose of removing duplicate agents, the default JND of phase
    expiryTime = 10, // the time after which an Agent that has not accepted any beat will be destroyed
    toleranceWndInner = 0.04, // the maximum time that a beat can deviate from the predicted beat time without a fork occurring
    toleranceWndPre = 0.15, // the maximum amount by which a beat can be earlier than the predicted beat time, expressed as a fraction of the beat period
    toleranceWndPost = 0.3, // the maximum amount by which a beat can be later than the predicted beat time, expressed as a fraction of the beat period
    correctionFactor = 50, // correction factor for updating beat period
    maxChange = 0.2, // the maximum allowed deviation from the initial tempo, expressed as a fraction of the initial beat period
    penaltyFactor = 0.5, // factor for correcting score, if onset do not coincide precisely with predicted beat time
  } = defaultExtractTempoOptions
) {
  // Onset Detection
  const spectralFlux = normalize(
    calculateSpectralFlux(audioData, {
      hopSize,
      bufferSize,
    })
  );

  const peaks = findPeaks(spectralFlux, {
    decayRate,
    peakFindingWindow,
    meanWndMultiplier,
    peakThreshold,
  });

  const events = peaks.map((p) => p * timeStep);

  // Tempo induction
  const clusters = processRhythmicEvents(events, {
    widthTreshold,
    maxIOI,
    minIOI,
  });

  const scores = calculateScore(mergeClusters(clusters, { widthTreshold }), {
    widthTreshold,
    maxTempos,
  });

  const tempoList = createTempoList(
    {
      ...clusters,
      clScores: scores.clScores,
      clScoresIdxs: scores.clScoresIdxs,
    },
    {
      widthTreshold,
      minBeatInterval,
      maxBeatInterval,
    }
  );

  // Beat tracking
  const minSF = Math.min(...spectralFlux);
  const eventsScores = peaks.map((p) => spectralFlux[p] - minSF);
  let agents = trackBeat(events, eventsScores, tempoList, {
    initPeriod,
    thresholdBI,
    thresholdBT,
    expiryTime,
    toleranceWndInner,
    toleranceWndPre,
    toleranceWndPost,
    correctionFactor,
    maxChange,
    penaltyFactor,
  });

  let bestAgent;
  let bestScore = -Infinity;
  for (let agent of agents) {
    if (agent.score && agent.score > bestScore) {
      bestAgent = agent;
      bestScore = agent.score;
    }
  }

  if (!bestAgent) {
    throw new Error("Tempo extraction failed");
  }

  bestAgent.fillBeats();

  return {
    tempo: 60 / bestAgent.beatInterval,
    beatInterval: bestAgent.beatInterval,
    beats: bestAgent.events,
  };
}

export default extractTempo;
