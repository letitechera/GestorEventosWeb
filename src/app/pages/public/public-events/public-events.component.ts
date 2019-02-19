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
  public shortDescription: string;

  constructor(private publicApi: PublicApiService, private route: Router,
    private dateService: DateService) { }

  ngOnInit() {
    this.initData();
  }

  private initData() {
    this.loading = true;
    this.publicApi.getAllEvents().then((data: any[]) => {
      this.loading = false;
      this.events = data.filter(x => x.Canceled == false);
    }, (err) => {
      this.loading = false;
      console.log(err);
    });
  }

  public getEvent(eventId) {
    this.route.navigate(['public/events/', eventId]);
  }

  public showDayDate(date) {
    return this.dateService.GetDayDate(date);
  }

  public showAbbreviatedMonth(date) {
    return this.dateService.GetAbbreviatedMonth(date).substr(0, 3).toUpperCase();
  }

}
