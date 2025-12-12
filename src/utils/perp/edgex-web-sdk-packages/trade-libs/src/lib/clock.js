export class Clock {
  private _timestampAdjustment: number;
  private _reqTimestamp: number;
  private _timeRes: number;

  constructor(timestampAdjustment?: any, reqTimestamp?: any, timeRes?: any) {
    this._timestampAdjustment = Number(timestampAdjustment) || 0;
    this._reqTimestamp = Number(reqTimestamp) || 0;
    this._timeRes = Number(timeRes) || 0;
  }
  /**
   * @description Set the timestampAdjustment which is the number of seconds the system time should
   * be adjusted for every API call.
   *
   * @param timestampAdjustment seconds to adjust the system time.
   */
  setTimestampAdjustment(timestampAdjustment: any) {
    this._timestampAdjustment = timestampAdjustment;
  }
  /**
   * @description Get the current value of timestampAdjustment.
   */
  get timestampAdjustment() {
    return this._timestampAdjustment;
  }
  get getAdjustedIsoTimestamp() {
    return Date.now() + this._timestampAdjustment;
  }
  get serverTimeInfo() {
    return `timeRes: ${this._timeRes} reqTimestamp: ${this._reqTimestamp} timeGap: ${this._timestampAdjustment}`;
  }
  /**
   * @description Get the ISO8601 string for the current time adjusted by the timestampAdjustment.
   */
  getAdjustedIsoString() {
    const timestamp = new Date().getTime();
    return new Date(Number(timestamp) + Number(this._timestampAdjustment)).toUTCString();
  }
}
