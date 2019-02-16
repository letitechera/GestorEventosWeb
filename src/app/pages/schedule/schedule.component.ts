import { Component, OnInit } from '@angular/core';
import { Schedule } from '@models/schedule-data';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { EventsApiService } from '@services/events-api/events-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DateService } from '@services/date/date.service';
import { MatDialog } from '@angular/material';
import { EventData } from '@models/event-data';
import { environment } from 'environments/environment.prod';
import { ActivityModalComponent } from '@shared/activity-modal/activity-modal.component';
import { SchedulesApiService } from '@services/schedules-api/schedules-api.service';
import { SchedulesModalComponent } from '@shared/schedules-modal/schedules-modal.component';
import { SpeakerModalComponent } from '@shared/speaker-modal/speaker-modal.component';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  id: number;
  private sub: any;
  public schedules: Schedule[];
  public loading: boolean;
  public event: EventData;

  constructor(private schedulesApi: SchedulesApiService, private auth: AuthApiService, private router: Router,
    private route: ActivatedRoute, private dateService: DateService, private dialog: MatDialog,
    private eventsApi: EventsApiService, private notifier: NotifierService) { }

  ngOnInit() {
    this.auth.checkSession();
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.initEvent();
      this.initSchedules();
    });
  }

  public initEvent() {
    this.loading = true;
    this.eventsApi.getEventDetails(this.id).then((data: any) => {
      if (data != null) {
        this.event = {
          EventId: data.id,
          Name: data.name,
          StartDate: new Date(data.startDate),
          EndDate: new Date(data.endDate),
          Image: data.image != null ? data.image : environment.defaultImage,
          Description: data.description,
          Location: data.location,
          Address: data.address,
          Topic: data.topic,
          Percentage: data.percentage,
          CreatedById: data.createdById,
          Canceled: data.canceled
        };
      }
    }, (err) => {
      this.loading = false;
    });
  }

  public initSchedules() {
    this.loading = true;
    this.schedulesApi.getSchedulesByEvent(this.id).then((data: any[]) => {
      this.loading = false;
      this.schedules = data;
    }, (err) => {
      this.loading = false;
    });
  }

  public openScheduleDialog(element) {
    this.auth.checkSession();
    const dialogRef = this.dialog.open(SchedulesModalComponent, {
      height: '220px',
      width: '350px',
      hasBackdrop: true,
      data: {
        eventId: this.id,
        schedule: element,
        startDate: this.event.StartDate,
        endDate: this.event.EndDate,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'changed') {
        this.initSchedules();
      }
    });
  }

  public openActivityDialog(scheduleId, startDate, element) {
    this.auth.checkSession();
    const dialogRef = this.dialog.open(ActivityModalComponent, {
      height: '420px',
      width: '350px',
      hasBackdrop: true,
      data: {
        scheduleId: scheduleId,
        activity: element,
        scheduleStartDate: startDate
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'changed') {
        this.initSchedules();
      }
    });
  }

  public openSpeakersDialog(activityId, element) {
    this.auth.checkSession();
    const dialogRef = this.dialog.open(SpeakerModalComponent, {
      height: '450px',
      width: '420px',
      hasBackdrop: true,
      data: {
        activityId: activityId,
        speaker: element,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'changed') {
        this.initSchedules();
      }
    });
  }

  public openConfirmDialog(type, element) {
    this.auth.checkSession();
    let submes = '';
    switch (type) {
      case 'schedule':
        submes = 'este día';
        break;
      case 'activity':
        submes = 'esta actividad';
        break;
      case 'speaker':
        submes = 'este Speaker';
        break;
      default:
        break;
    }
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        message: `¿Estás seguro de que deseas eliminar ${submes}?`
      },
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        switch (type) {
          case 'schedule':
            this.deleteSchedule(element);
            break;
          case 'activity':
            this.deleteActivity(element);
            break;
          case 'speaker':
            this.deleteSpeaker(element);
            break;
          default:
            break;
        }
      }
    });
  }

  public deleteSchedule(scheduleId) {
    this.schedulesApi.deleteSchedule(scheduleId).then((data: any[]) => {
      this.notifier.notify( 'success', 'Se eliminó el día' );
      this.initSchedules();
    }, (err) => {
      this.notifier.notify('error', 'Ups.. Ha ocurrido un error');
      console.log(err);
    });
  }

  public deleteActivity(activityId) {
    this.schedulesApi.deleteActivity(activityId).then((data: any[]) => {
      this.notifier.notify( 'success', 'Se eliminó la actividad' );
      this.initSchedules();
    }, (err) => {
      this.notifier.notify('error', 'Ups.. Ha ocurrido un error');
      console.log(err);
    });
  }

  public deleteSpeaker(speakerId) {
    this.schedulesApi.deleteSpeaker(speakerId).then((data: any[]) => {
      this.notifier.notify( 'success', 'Se eliminó la speaker' );
      this.initSchedules();
    }, (err) => {
      this.notifier.notify('error', 'Ups.. Ha ocurrido un error');
      console.log(err);
    });
  }

  public getPrettyDate(date) {
    this.dateService.GetPrettyDate(date);
  }

  public getPrettyTime(stringDate) {
    var date = new Date(stringDate);
    return this.dateService.GetCustomTime(date);
  }

  public goBack() {
    this.router.navigate(['/events', this.event.EventId]);
  }
}
