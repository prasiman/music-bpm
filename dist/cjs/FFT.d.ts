/**
 * Get Hamming window
 * @param {Number} bufferSize - windows size
 * @return {Array} wnd - Hamming window
 */
declare function getHammingWindow(bufferSize: number): number[];
/**
 * Computes FFT and converts the results to magnitude representation
 * @param {Array} re - the real part of the input data and the magnitude of the output data
 * @param {Array} im - the imaginary part of the input data
 */
declare function getSpectrum(re: number[], im: number[]): void;
export { getHammingWindow, getSpectrum };
