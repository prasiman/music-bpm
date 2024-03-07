import { getHammingWindow, getSpectrum } from "./FFT";

const getZeroFilledArray = (length: number) =>
  new Array<number>(length).fill(0);

/**
 * Normalize data to have a mean of 0 and standard deviation of 1
 * @param {Array} data - data array
 */
export function normalize(data: number[]) {
  if (data.length == 0) {
    throw "Array is empty";
  }
  let sum = 0;
  let squareSum = 0;
  const result: number[] = [];

  for (let i = 0; i < data.length; i++) {
    sum += data[i];
    squareSum += data[i] * data[i];
  }

  const mean = sum / data.length;
  let standardDeviation = Math.sqrt((squareSum - sum * mean) / data.length);

  if (standardDeviation == 0) {
    standardDeviation = 1;
  }

  for (let i = 0; i < data.length; i++) {
    result[i] = (data[i] - mean) / standardDeviation;
  }

  return result;
}

type calculateSFOptions = {
  bufferSize?: number; // FFT windows size
  hopSize?: number; // spacing of audio frames in samples
  samplingRate?: number; // sampling rate of audio data
};

const defaultOptions = {
  bufferSize: 2048,
  hopSize: 441,
  samplingRate: 44100,
};

export function calculateSpectralFlux(
  audioData: number[] | Float32Array, // non-interleaved IEEE 32-bit linear PCM with a nominal range of -1 -> +1 (Web Audio API - Audio Buffer)
  {
    bufferSize = 2048,
    hopSize = 441,
  }: calculateSFOptions = defaultOptions
): Array<number> {
  let k = Math.floor(Math.log(bufferSize) / Math.LN2);
  if (Math.pow(2, k) !== bufferSize) {
    throw "Invalid buffer size (" + bufferSize + "), must be power of 2";
  }

  const hammWindow = getHammingWindow(bufferSize);
  let spectralFlux: number[] = [];
  const spectrumLength = bufferSize / 2 + 1;
  let previousSpectrum = new Array(spectrumLength);
  previousSpectrum.fill(0);
  let im = new Array<number>(bufferSize);

  const length = audioData.length;
  let zerosStart = getZeroFilledArray(bufferSize - hopSize);
  const zerosEnd = getZeroFilledArray(
    bufferSize - ((zerosStart.length + length) % hopSize)
  );

  const audioBuffer = [...zerosStart, ...audioData, ...zerosEnd];

  for (let wndStart = 0; wndStart < length; wndStart += hopSize) {
    let wndEnd = wndStart + bufferSize;

    const re: number[] = [];
    let k = 0;
    for (let i = wndStart; i < wndEnd; i++) {
      re[k] = hammWindow[k] * audioBuffer[i];
      k++;
    }
    im.fill(0);

    getSpectrum(re, im);

    let flux = 0;
    for (let j = 0; j < spectrumLength; j++) {
      let value = re[j] - previousSpectrum[j];
      flux += value < 0 ? 0 : value;
    }
    spectralFlux.push(flux);

    previousSpectrum = re;
  }

  return spectralFlux;
}

/**
 * Finding local maxima in an array
 * @param {Array} spectralFlux - input data
 * @param {Object} [params={}] - parametrs
 * @param {Number} [params.decayRate=0.84] - how quickly previous peaks are forgotten
 * @param {Number} [params.peakFindingWindow=6] - minimum distance between peaks
 * @param {Number} [params.meanWndMultiplier=3] - multiplier for peak finding window
 * @param {Number} [params.peakThreshold=0.35] - minimum value of peaks
 * @return {Array} peaks - array of peak indexes
 */

type findPeaksArgs = {
  decayRate?: number; // how quickly previous peaks are forgotten
  peakFindingWindow?: number; // minimum distance between peaks
  meanWndMultiplier?: number; // multiplier for peak finding window
  peakThreshold?: number; // minimum value of peaks
};

const defaultFindPeaksOptions = {
  decayRate: 0.84,
  peakFindingWindow: 6,
  meanWndMultiplier: 3,
  peakThreshold: 0.35,
}

export function findPeaks(
  spectralFlux: number[],
  {
    decayRate = 0.84,
    peakFindingWindow = 6,
    meanWndMultiplier = 3,
    peakThreshold = 0.35,
  }: findPeaksArgs = defaultFindPeaksOptions
): number[] {
  const length = spectralFlux.length;
  const sf = spectralFlux;
  let max = 0;
  let av = sf[0];
  let peaks: number[] = [];

  for (let i = 0; i < length; i++) {
    av = decayRate * av + (1 - decayRate) * sf[i];
    if (sf[i] < av) continue;

    let wndStart = i - peakFindingWindow;
    let wndEnd = i + peakFindingWindow + 1;

    if (wndStart < 0) wndStart = 0;
    if (wndEnd > length) wndEnd = length;
    if (av < sf[i]) av = sf[i];

    let isMax = true;
    for (let j = wndStart; j < wndEnd; j++) {
      if (sf[j] > sf[i]) isMax = false;
    }
    if (isMax) {
      let meanWndStart = i - peakFindingWindow * meanWndMultiplier;
      let meanWndEnd = i + peakFindingWindow;
      if (meanWndStart < 0) meanWndStart = 0;
      if (meanWndEnd > length) meanWndEnd = length;
      let sum = 0;
      let count = meanWndEnd - meanWndStart;
      for (let j = meanWndStart; j < meanWndEnd; j++) {
        sum += sf[j];
      }
      if (sf[i] > sum / count + peakThreshold) {
        peaks.push(i);
      }
    }
  }

  if (peaks.length < 2) {
    throw "Fail to find peaks";
  }
  return peaks;
}
