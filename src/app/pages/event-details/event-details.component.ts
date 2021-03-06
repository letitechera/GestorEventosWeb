import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsApiService } from '@services/events-api/events-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { EventData } from '@models/event-data';
import { DateService } from '@services/date/date.service';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';

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
  public role: string;

  constructor(private route: ActivatedRoute, private eventsApi: EventsApiService, private auth: AuthApiService,
    private dateService: DateService, private router: Router, private notifier: NotifierService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.auth.checkSession();
    this.role = this.auth.getRole();
    
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.initData(this.id);
      // In a real app: dispatch action to load the details here.
    });
  }

  public editEvent() {
    this.router.navigate(['events/manage/', this.event.EventId]);
  }

  public getSchedule() {
    this.router.navigate(['schedule', this.event.EventId]);
  }

  public goBack() {
    this.router.navigateByUrl('events');
  }

  public goToEventView(){
    this.router.navigate(['public/events/', this.event.EventId]);
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
          SmallImage: data.smallImage != null ? data.smallImage : '',
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
      console.log(err);
      this.loading = false;
    });
  }

  public sendCampaign() {
    this.loading = true;
    this.eventsApi.sendCampaign(this.event.EventId).then(() => {
      this.loading = false;
      this.notifier.notify('success', 'El evento está siendo enviado!');
    }, (err) => {
        this.loading = false;
        this.notifier.notify('error', 'Ups.. Ha ocurrido un error');
      }
    );
  }

  public openConfirmDialog() {
    this.auth.checkSession();
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        message: '¿Estás seguro de que deseas cancelar este evento?'
      },
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.cancelEvent();
      }
    });
  }

  public cancelEvent() {
    this.loading = true;
    this.eventsApi.cancelEvent(this.id).then(() => {
      this.loading = false;
      this.notifier.notify('success', 'El evento se ha cancelado');
    },
      (err) => {
        this.notifier.notify('error', 'Ups.. Ha ocurrido un error');
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

  public navigateTo(page) {
    this.router.navigateByUrl(page);
  }
}
