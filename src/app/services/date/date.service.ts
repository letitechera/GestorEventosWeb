import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(public datepipe: DatePipe) { }

  public GetDayDate(date: any) {
    return this.datepipe.transform(date, 'dd');
  }
  public GetAbbreviatedMonth(date: any) {
    return this.datepipe.transform(date, 'MMM');
  }
  public GetShortDate(date: any) {
    return this.datepipe.transform(date, 'yyyy-MM-dd');
  }
  public GetScheduleDate(date: any) {
    return this.datepipe.transform(date, 'MMM dd');
  }
  public GetTime(date: any) {
    return this.datepipe.transform(date, 'h:mm a');
  }
  public GetCustomTime(date: any) {
    return this.datepipe.transform(date, 'HH:mm');
  }
  public GetPrettyDateTime(date: any) {
    return this.datepipe.transform(date, 'EEEE d MMM yyyy, HH:mm');
  }
  public SetTimeToDate(date: Date, time: string) {
    const timestring = time.split(':');
    let result = date.setHours(+timestring[0]);
    result = date.setMinutes(+timestring[1]);
    return result;
  }
  public GetLongDateString(date: any) {
    const res = this.datepipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
    return res + '.0000000';
  }
  public GetPrettyDate(date: any) {
    return this.datepipe.transform(date, 'EEEE d, MMM');
  }

}
