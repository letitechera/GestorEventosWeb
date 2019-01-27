import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsApiService } from '@services/events-api/events-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { map } from 'rxjs/operators';
import { EventData } from '@models/event-data';
import { DateService } from '@services/date/date.service';

@Component({
  selector: 'event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit, OnDestroy {
  id: number;
  private sub: any;
  public loading: boolean;
  public event: EventData;

  constructor(private route: ActivatedRoute, private eventsApi: EventsApiService, private auth: AuthApiService,
    private dateService: DateService, private router: Router) { }

  ngOnInit() {
    this.auth.checkSession();

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.initData(this.id);
      // In a real app: dispatch action to load the details here.
    });
  }

  public editEvent() {
    this.router.navigate(['events/manage/', this.event.EventId]);
  }

  public goBack() {
    this.router.navigateByUrl('events');
  }

  public initData(id) {
    this.loading = true;
    this.eventsApi.getEventDetails(id).then((data: any) => {
      this.loading = false;
      if (data != null) {
        this.event = {
          EventId: data.id,
          Name: data.name,
          StartDate: new Date(data.startDate),
          EndDate: new Date(data.endDate),
          Image: data.image != null ? data.image : '',
          Description: data.description,
          Location: data.location,
          Topic: data.topic,
          CreatedById: data.createdById,
        };
        console.log(this.event)
      }
    }, (err) => {
      console.log(err);
      this.loading = false;
    });
  }

  public sendCampaign() {
    this.loading = true;
    this.eventsApi.sendCampaign(this.id).then(() => {
      this.loading = false;
    },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  public showDate(date) {
    return this.dateService.GetShortDate(date);
  }

  public showTime(date) {
    return this.dateService.GetTime(date);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
