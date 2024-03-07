/**
 * Find clusters
 * @param {Array} events - the onsets from which the tempo is induced
 * @param {Object} [params={}] - parameters
 * @param {Number} [params.widthTreshold=0.025] - the maximum difference in IOIs which are in the same cluster
 * @param {Number} [params.maxIOI=2.5] - the maximum IOI for inclusion in a cluster
 * @param {Number} [params.minIOI=0.07] - the minimum IOI for inclusion in a cluster
 * @return {{clIntervals: Array, clSizes: Array}} - object with clusters
 */
interface Clusters {
    clIntervals: number[];
    clSizes: number[];
}
type processRhythmicEventsOptions = {
    widthTreshold?: number;
    maxIOI?: number;
    minIOI?: number;
};
declare function processRhythmicEvents(events: number[], { widthTreshold, maxIOI, minIOI, }?: processRhythmicEventsOptions): Clusters;
/**
 * Merge similar intervals
 * @param {Object} clusters - object with clusters
 * @param {Array} clusters.clIntervals - clusters IOIs array
 * @param {Array} clusters.clSizes - clusters sizes array
 * @param {Object} [params={}] - parameters
 * @param {Number} [params.widthTreshold=0.025] - the maximum difference in IOIs which are in the same cluster
 * @return {{clIntervals: Array, clSizes: Array}} - object with clusters
 */
type mergeClustersOptions = {
    widthTreshold?: number;
};
declare function mergeClusters(clusters: Clusters, { widthTreshold }?: mergeClustersOptions): Clusters;
/**
 * Score intervals
 * @param {Object} clusters - object with clusters
 * @param {Array} clusters.clIntervals - clusters IOIs array
 * @param {Array} clusters.clSizes - clusters sizes array
 * @param {Object} [params={}] - parameters
 * @param {Number} [params.widthTreshold=0.025] - the maximum difference in IOIs which are in the same cluster
 * @param {Number} [params.maxTempos=10] - initial amount of tempo hypotheses
 * @return {{clScores: Array, clScoresIdxs: Array}} - object with intervals scores
 */
type ClusterScore = {
    clScores: number[];
    clScoresIdxs: number[];
};
type calculateScoreOptions = {
    widthTreshold?: number;
    maxTempos?: number;
};
declare function calculateScore(clusters: Clusters, { widthTreshold, maxTempos }?: calculateScoreOptions): ClusterScore;
/**
 * Get array of tempo hypotheses
 * @param {Object} clusters - object with clusters
 * @param {Array} clusters.clIntervals - clusters IOIs array
 * @param {Array} clusters.clSizes - clusters sizes array
 * @param {Array} clusters.clScores - clusters scores array
 * @param {Array} clusters.clScoresIdxs - clusters scores indexes array
 * @param {Object} [params={}] - parameters
 * @param {Number} [params.widthTreshold=0.025] - the maximum difference in IOIs which are in the same cluster
 * @param {Number} [params.minBeatInterval=0.3] - the minimum inter-beat interval (IBI) (0.30 seconds == 200 BPM)
 * @param {Number} [params.maxBeatInterval=1] - the maximum inter-beat interval (IBI) (1.00 seconds ==  60 BPM)
 * @return {Array} tempoList - tempo hypotheses array
 */
type createTempoListOptions = {
    widthTreshold?: number;
    minBeatInterval?: number;
    maxBeatInterval?: number;
};
declare function createTempoList({ clIntervals, clScores, clScoresIdxs }: Clusters & ClusterScore, { widthTreshold, minBeatInterval, maxBeatInterval, }?: createTempoListOptions): number[];
export { processRhythmicEvents, mergeClusters, calculateScore, createTempoList };
