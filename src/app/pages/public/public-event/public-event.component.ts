import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateService } from '@services/date/date.service';
import { EventData } from '@models/event-data';
import { PublicApiService } from '@services/public-api/public-api.service';
import { Schedule } from '@models/schedule-data';

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
  public schedules: Schedule[];
  public currentSchedule: Schedule;
  public currentIndex: number;

  constructor(private route: ActivatedRoute, private publicApi: PublicApiService, 
    private dateService: DateService, private router: Router) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.currentIndex = 0;
      this.initData(this.id);
      // In a real app: dispatch action to load the details here.
    });
  }

  public initData(id) {
    this.eventLoading = true;
    this.publicApi.getEvent(id).then((data: any) => {
      if (data != null) {
        this.event = data;
        this.eventLoading = false;
        console.log(this.event);
        this.getSchedules(data.EventId);
      }
    }, (err) => {
      console.log(err);
      this.eventLoading = false;
    });
  }

  public getSchedules(id){
    this.scheduleLoading = true;
    this.publicApi.getSchedulesByEvent(id).then((data: any[]) => {
      if (data != null) {
        this.schedules = data;
        this.currentIndex = this.schedules[0].Id;
        this.currentSchedule = this.schedules[0];
        this.scheduleLoading = false;
        console.log(data);
      }
    }, (err) => {
      console.log(err);
      this.scheduleLoading = false;
    });
  }

  public selectDay(schedule) {
    this.currentIndex = schedule.Id;
    this.currentSchedule = schedule;
  }

  public goBack() {
    this.router.navigateByUrl('public/events');
  }

  public showDayDate(date) {
    return this.dateService.GetDayDate(date);
  }

  public getPrettyDateTime(date) {
    return this.dateService.GetPrettyDateTime(date);
  }

  public getScheduleDate(date) {
    return this.dateService.GetScheduleDate(date);
  }

  public getCustomTime(date) {
    let time = new Date(date)
    return this.dateService.GetCustomTime(time);
  }

  public showAbbreviatedMonth(date) {
    return this.dateService.GetAbbreviatedMonth(date).substr(0, 3).toUpperCase();
  }

  public GetType(id){
    switch(id){
      case 1:
      return "Conferencia";
      case 2:
      return "Curso";
      case 3:
      return "Taller";
      case 4:
      return "Debate";
      case 5:
      return "Discurso";
      case 6:
      return "Videoconferencia";
      case 7:
      return "Break";
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
