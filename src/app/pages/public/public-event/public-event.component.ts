import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateService } from '@services/date/date.service';
import { EventData } from '@models/event-data';
import { PublicApiService } from '@services/public-api/public-api.service';

@Component({
  selector: 'app-public-event',
  templateUrl: './public-event.component.html',
  styleUrls: ['./public-event.component.scss']
})
export class PublicEventComponent implements OnInit, OnDestroy {
  id: number;
  private sub: any;
  public eventLoading: boolean;
  public scheduleLoading: boolean;
  public event: EventData;

  constructor(private route: ActivatedRoute, private publicApi: PublicApiService, 
    private dateService: DateService, private router: Router) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.initData(this.id);
      // In a real app: dispatch action to load the details here.
    });
  }

  public initData(id) {
    this.eventLoading = true;
    this.publicApi.getEvent(id).then((data: any) => {
      this.eventLoading = false;
      if (data != null) {
        this.event = data;
        console.log(this.event);
      }
    }, (err) => {
      console.log(err);
      this.eventLoading = false;
    });
  }
  
  public goBack(){
    this.router.navigateByUrl('public/events');
  }

  public showDayDate(date) {
    return this.dateService.GetDayDate(date);
  }

  public getPrettyDateTime(date) {
    return this.dateService.GetPrettyDateTime(date);
  }

  public showAbbreviatedMonth(date) {
    return this.dateService.GetAbbreviatedMonth(date).substr(0, 3).toUpperCase();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
