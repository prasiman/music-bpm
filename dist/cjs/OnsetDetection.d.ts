/**
 * Normalize data to have a mean of 0 and standard deviation of 1
 * @param {Array} data - data array
 */
declare function normalize(data: number[]): number[];
type calculateSFOptions = {
    bufferSize?: number;
    hopSize?: number;
    samplingRate?: number;
};
declare function calculateSpectralFlux(audioData: number[] | Float32Array, // non-interleaved IEEE 32-bit linear PCM with a nominal range of -1 -> +1 (Web Audio API - Audio Buffer)
{ bufferSize, hopSize, }?: calculateSFOptions): Array<number>;
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
    decayRate?: number;
    peakFindingWindow?: number;
    meanWndMultiplier?: number;
    peakThreshold?: number;
};
declare function findPeaks(spectralFlux: number[], { decayRate, peakFindingWindow, meanWndMultiplier, peakThreshold, }?: findPeaksArgs): number[];
export { normalize, calculateSpectralFlux, findPeaks };
