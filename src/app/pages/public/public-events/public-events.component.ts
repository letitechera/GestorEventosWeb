import { Component, OnInit } from '@angular/core';
import { DateService } from '@services/date/date.service';
import { EventsApiService } from '@services/events-api/events-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { Router } from '@angular/router';
import { EventData } from '@models/event-data';

@Component({
  selector: 'app-public-events',
  templateUrl: './public-events.component.html',
  styleUrls: ['./public-events.component.scss']
})
export class PublicEventsComponent implements OnInit {
  public events: EventData[];
  public loading: boolean;
  constructor(private eventsApi: EventsApiService, private auth: AuthApiService, private route: Router,
    private dateService: DateService) { }

  ngOnInit() {
    this.auth.checkSession();
    this.initData();
  }

  private initData() {
    this.loading = true;
    let userId = this.auth.getUserId();
    this.eventsApi.getAllEvents(userId).then((data: any[]) => {
      this.loading = false;
      this.events = data;
    }, (err) => {
      this.loading = false;
      console.log(err);
    });
  }

  public getEvent(eventId) {
    this.route.navigate(['/events', eventId]);
  }

  public showDate(date) {
    return this.dateService.GetShortDate(date);
  }

  public showTime(date) {
    return this.dateService.GetTime(date);
  }

  public deleteEvent(eventId){
    this.eventsApi.deleteEvent(eventId).then((data: any[]) => {
      this.initData();
    }, (err) => {
      console.log(err);
    });
  }


}
