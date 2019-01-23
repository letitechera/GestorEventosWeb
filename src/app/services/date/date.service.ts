import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common'

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(public datepipe: DatePipe) { }

  public GetShortDate(date: any) {
    return this.datepipe.transform(date, 'yyyy-MM-dd');
  }
  public GetTime(date: any) {
    return this.datepipe.transform(date, 'h:mm a');
  }
  public GetCustomTime(date: any) {
    return this.datepipe.transform(date, 'HH:mm');
  }
  public SetTimeToDate(date: Date, time: string) {
    let timestring = time.split(':');
    let result = date.setHours(+timestring[0]);
    result = date.setMinutes(+timestring[1]);
    return result;
  }
  public GetLongDateString(date: any){
    let res = this.datepipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
    return res + '.0000000';
  }
}
