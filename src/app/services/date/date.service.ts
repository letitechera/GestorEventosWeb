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
}
