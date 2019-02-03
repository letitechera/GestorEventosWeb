import { Component, OnInit } from '@angular/core';
import { DateService } from '@services/date/date.service';
import { Router } from '@angular/router';
import { EventData } from '@models/event-data';
import { PublicApiService } from '@services/public-api/public-api.service';

@Component({
  selector: 'app-public-events',
  templateUrl: './public-events.component.html',
  styleUrls: ['./public-events.component.scss']
})
export class PublicEventsComponent implements OnInit {
  public events: EventData[];
  public loading: boolean;
  constructor(private publicApi: PublicApiService, private route: Router,
    private dateService: DateService) { }

  ngOnInit() {
    this.initData();
  }

  private initData() {
    this.loading = true;
    this.publicApi.getAllEvents().then((data: any[]) => {
      this.loading = false;
      this.events = data;
      console.log(data)
    }, (err) => {
      this.loading = false;
      console.log(err);
    });
  }

  public getEvent(eventId) {
    this.route.navigate(['public/events/', eventId]);
  }

  public showDate(date) {
    return this.dateService.GetShortDate(date);
  }

  public showTime(date) {
    return this.dateService.GetTime(date);
  }

}
