export default class Time {
  #minutes = 0;
  #occultMinutesWhenZero = false;
  #sign = '';

  constructor(initialMinutes = 0, occultMinutesWhenZero = false, sign = ' '){
    this.#minutes = initialMinutes;
    this.#occultMinutesWhenZero = occultMinutesWhenZero;
    this.#sign = sign;
  }

  empty(){
    return this.#minutes === 0;
  }

  equals(time: Time){
    return this.#minutes === time.#minutes; 
  }

  subtract(time: Time, occultMinutesWhenZero = false): Time {
    return new Time(
      Math.abs(this.#minutes - time.#minutes),
      occultMinutesWhenZero,
      this.#minutes <= time.#minutes ? '+' : '-'
    )
  }

  addHours(hours: number){
    this.#minutes += hours * 60;
  }

  addMinutes(minutes: number){
    this.#minutes += minutes;
  }

  addTime(time: Time){
    this.#minutes += time.#minutes;
  }

  get minutes(){
    return this.#minutes % 60;
  }

  get hours(){
    return Math.floor(this.#minutes / 60);
  }

  toString(sign?: string){
    sign = sign || this.#sign;
    const hourText = sign + String(this.hours);
    const minuteText = String(this.minutes).padStart(2, '0');

    return hourText + 'h' + (this.#occultMinutesWhenZero && this.minutes === 0 ? '' : minuteText);
  }
}
