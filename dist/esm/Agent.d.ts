type AgentOptions = {
    expiryTime?: number;
    toleranceWndInner?: number;
    toleranceWndPre?: number;
    toleranceWndPost?: number;
    correctionFactor?: number;
    maxChange?: number;
    penaltyFactor?: number;
};
/**
 * Agent is the central class for beat tracking
 * @class
 */
declare class Agent {
    expiryTime: number;
    toleranceWndInner: number;
    toleranceWndPre: number;
    toleranceWndPost: number;
    correctionFactor: number;
    maxChange: number;
    penaltyFactor: number;
    beatInterval?: number;
    initialBeatInterval?: number;
    beatTime: number;
    totalBeatCount: number;
    events: number[];
    score?: number;
    agentListRef?: Agent[];
    /**
     * Constructor
     * @param {Number} tempo - tempo hypothesis of the Agent
     * @param {Number} firstBeatTime - the time of the first beat accepted by this Agent
     * @param {Number} firsteventScore - salience value of the first beat accepted by this Agent
     * @param {Array} agentList - reference to the agent list
     * @param {Object} [params={}] - parameters
     * @param {Number} [params.expiryTime=10] - the time after which an Agent that has not accepted any beat will be destroyed
     * @param {Number} [params.toleranceWndInner=0.04] - the maximum time that a beat can deviate from the predicted beat time without a fork occurring
     * @param {Number} [params.toleranceWndPre=0.15] - the maximum amount by which a beat can be earlier than the predicted beat time, expressed as a fraction of the beat period
     * @param {Number} [params.toleranceWndPost=0.3] - the maximum amount by which a beat can be later than the predicted beat time, expressed as a fraction of the beat period
     * @param {Number} [params.correctionFactor=50] - correction factor for updating beat period
     * @param {Number} [params.maxChange=0.2] - the maximum allowed deviation from the initial tempo, expressed as a fraction of the initial beat period
     * @param {Number} [params.penaltyFactor=0.5] - factor for correcting score, if onset do not coincide precisely with predicted beat time
     */
    /**
     * Constructor
     * @param {Number} tempo - tempo hypothesis of the Agent
     * @param {Number} firstBeatTime - the time of the first beat accepted by this Agent
     * @param {Number} firsteventScore - salience value of the first beat accepted by this Agent
     * @param {Array} agentList - reference to the agent list
     * @param {Object} [params={}] - parameters
     * @param {Number} [params.expiryTime=10] - the time after which an Agent that has not accepted any beat will be destroyed
     * @param {Number} [params.toleranceWndInner=0.04] - the maximum time that a beat can deviate from the predicted beat time without a fork occurring
     * @param {Number} [params.toleranceWndPre=0.15] - the maximum amount by which a beat can be earlier than the predicted beat time, expressed as a fraction of the beat period
     * @param {Number} [params.toleranceWndPost=0.3] - the maximum amount by which a beat can be later than the predicted beat time, expressed as a fraction of the beat period
     * @param {Number} [params.correctionFactor=50] - correction factor for updating beat period
     * @param {Number} [params.maxChange=0.2] - the maximum allowed deviation from the initial tempo, expressed as a fraction of the initial beat period
     * @param {Number} [params.penaltyFactor=0.5] - factor for correcting score, if onset do not coincide precisely with predicted beat time
     */
    constructor(tempo?: number, firstBeatTime?: number, firsteventScore?: number, agentList?: Agent[], params?: AgentOptions);
    /**
     * The event time is tested if it is a beat time
     * @param {Number} eventTime - the event time to be tested
     * @param {Number} eventScore - salience values of the event time
     * @return {Boolean} indicate whether the given event time was accepted as a beat time
     */
    /**
     * The event time is tested if it is a beat time
     * @param {Number} eventTime - the event time to be tested
     * @param {Number} eventScore - salience values of the event time
     * @return {Boolean} indicate whether the given event time was accepted as a beat time
     */
    considerEvent(eventTime: any, eventScore: any): boolean;
    /**
     * Accept the event time as a beat time, and update the state of the Agent accordingly
     * @param {Number} eventTime - the event time to be accepted
     * @param {Number} eventScore - salience values of the event time
     * @param {Number} err - the difference between the predicted and actual beat times
     * @param {Number} beatCount - the number of beats since the last beat
     */
    /**
     * Accept the event time as a beat time, and update the state of the Agent accordingly
     * @param {Number} eventTime - the event time to be accepted
     * @param {Number} eventScore - salience values of the event time
     * @param {Number} err - the difference between the predicted and actual beat times
     * @param {Number} beatCount - the number of beats since the last beat
     */
    acceptEvent(eventTime: any, eventScore: any, err: any, beatCount: any): void;
    /**
     * Interpolates missing beats in the Agent's beat track
     */
    /**
     * Interpolates missing beats in the Agent's beat track
     */
    fillBeats(): void;
    /**
     * Makes a clone of the Agent
     * @return {Agent} agent's clone
     */
    /**
     * Makes a clone of the Agent
     * @return {Agent} agent's clone
     */
    clone(): Agent;
}
export { Agent as default };
