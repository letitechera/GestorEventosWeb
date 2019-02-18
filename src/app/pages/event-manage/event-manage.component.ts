import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateService } from '@services/date/date.service';
import { EventsApiService } from '@services/events-api/events-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { EventFullData, EventSendableData } from '@models/event-data';
import { FormGroup, FormBuilder, Validators, ValidatorFn, FormControl } from '@angular/forms';
import { LocationsApiService } from '@services/locations-api/locations-api.service';
import { environment } from '@environment';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-event-manage',
  templateUrl: './event-manage.component.html',
  styleUrls: ['./event-manage.component.scss']
})
export class EventManageComponent implements OnInit, OnDestroy {

  id: number;
  private sub: any;
  public createFlag: boolean;
  public updateFlag: boolean;
  public eventForm: FormGroup;
  public locations: any[];
  public topics: any[];
  public selectedlocation = 1;
  public selectedtopic = 1;
  public minDate: Date;
  public minEndDate: Date;
  public originalImage: string;
  public loading: boolean;
  public loadingImg: boolean;
  public loadingBtn: boolean;
  public submitted: boolean;
  public event: EventFullData;
  private eventSend: EventSendableData;

  constructor(private route: ActivatedRoute, private eventsApi: EventsApiService, private auth: AuthApiService,
    private dateService: DateService, private locationsApi: LocationsApiService,
    private router: Router, private formBuilder: FormBuilder, private notifier: NotifierService) { }

  ngOnInit() {
    this.auth.checkSession();
    this.submitted = false;
    this.minDate = new Date();
    this.minEndDate = new Date();

    this.eventSend = {
      Name: '',
      Description: '',
      Image: '',
      StartDate: '',
      EndDate: '',
      LocationId: 0,
      EventTopicId: 0,
      Canceled: false,
      AttendancePercentage: 0,
      Id: 0
    };

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      if (this.id != null && this.id !== 0) {
        this.updateFlag = true;
        this.getEventInfo(this.id);
      } else {
        this.createFlag = true;
        this.originalImage = environment.defaultImage;
        this.GetLocations(0);
        this.GetTopics(0);
        this.initializeEmpty();
      }
    });
  }

  private GetLocations(id) {
    this.locationsApi.getAllLocations().then((locations: any[]) => {
      this.locations = locations;
      if (this.id != null && this.id !== 0) {
        this.selectedlocation = id;
      } else {
        this.selectedlocation = locations[0].id;
      }
    }, (err) => {
      console.log(err);
    });
  }
  private GetTopics(id) {
    this.eventsApi.getAllTopics().then((topics: any[]) => {
      this.topics = topics;
      if (this.id != null && this.id !== 0) {
        this.selectedtopic = id;
      } else {
        this.selectedtopic = topics[0].id;
      }
    }, (err) => {
      console.log(err);
    });
  }

  private initializeEmpty() {
    this.eventForm = this.formBuilder.group({
      Id: [0, [Validators.required]],
      Name: ['', [Validators.required]],
      StartDate: [this.minDate, [Validators.required]],
      EndDate: [this.minEndDate, [Validators.required]],
      StartTime: ['00:00', [Validators.required]],
      EndTime: ['00:00', [Validators.required]],
      Description: [''],
      Image: [environment.defaultImage],
      LocationId: [this.selectedlocation, [Validators.required]],
      EventTopicId: [this.selectedtopic, [Validators.required]],
      Canceled: [false],
      Percentage: [0, [Validators.max(100), Validators.min(0)]]
    });
  }

  private initUpdateForm() {
    this.eventForm = this.formBuilder.group({
      Id: [this.event.EventId, [Validators.required]],
      Name: [this.event.Name, [Validators.required]],
      StartDate: [this.event.StartDate, [Validators.required]],
      EndDate: [this.event.EndDate, [Validators.required]],
      StartTime: [this.dateService.GetCustomTime(this.event.StartDate), [Validators.required]],
      EndTime: [this.dateService.GetCustomTime(this.event.EndDate), [Validators.required]],
      Description: [this.event.Description != null ? this.event.Description : ''],
      Image: [this.event.Image != null || this.event.Image !== '' ? this.event.Image : environment.defaultImage],
      LocationId: [this.selectedlocation, [Validators.required]],
      EventTopicId: [this.selectedtopic, [Validators.required]],
      Canceled: [this.event.Canceled],
      Percentage: [this.event.Percentage, [Validators.max(100), Validators.min(0)]]
    });
    this.loading = false;
  }

  private getEventInfo(id) {
    this.loading = true;
    this.eventsApi.getCompleteEvent(id).then((data: any) => {
      if (data != null) {
        this.event = {
          EventId: data.id,
          Name: data.name,
          StartDate: new Date(data.startDate),
          EndDate: new Date(data.endDate),
          Image: data.image != null ? data.image : '',
          Description: data.description,
          Location: data.location,
          EventTopic: data.eventTopic,
          Canceled: data.canceled,
          Percentage: data.attendancePercentage
        };
        this.initUpdateForm();
        this.loading = false;
        this.originalImage = data.image;
        this.GetLocations(data.location.id);
        this.GetTopics(data.eventTopic.id);
      }
    }, (err) => {
      this.notifier.notify('error', 'Ups.. Ha ocurrido un error');
      console.log(err);
      this.loading = false;
    });
  }

  public submitEvent() {
    this.submitted = true;
    if (!this.eventForm.valid) {
      return;
    }
    this.loadingBtn = true;
    if (this.createFlag) {
      this.addEvent();
    } else {
      this.editEvent();
    }
  }

  private addEvent() {
    this.setEventObject();
    this.eventsApi.postEvent(this.eventSend).then((data: any[]) => {
      this.loadingBtn = false;
      this.notifier.notify( 'success', 'El evento se creó con éxito!' );
      this.goBack();
    }, (err) => {
      this.notifier.notify('error', 'Ups.. Ha ocurrido un error');
      console.log(err);
    });
  }

  private editEvent() {
    this.setEventObject();
    this.eventsApi.putEvent(this.eventSend).then((data: any[]) => {
      this.loadingBtn = false;
      this.notifier.notify( 'success', 'El evento se editó con éxito!' );
      this.goBack();
    }, (err) => {
      this.notifier.notify('error', 'Ups.. Ha ocurrido un error');
      console.log(err);
    });
  }

  private setEventObject() {
    let startDate = this.dateService.SetTimeToDate(this.eventForm.get('StartDate').value, this.eventForm.get('StartTime').value);
    const endDate = this.dateService.SetTimeToDate(this.eventForm.get('EndDate').value, this.eventForm.get('EndTime').value);
    const startDateString = this.dateService.GetLongDateString(startDate);
    const endDateString = this.dateService.GetLongDateString(endDate);
    startDate = this.dateService.SetTimeToDate(new Date(startDate), this.eventForm.get('StartTime').value);
    startDate = this.dateService.SetTimeToDate(new Date(startDate), this.eventForm.get('StartTime').value);
    this.eventSend.Name = this.eventForm.get('Name').value;
    this.eventSend.Description = this.eventForm.get('Description').value;
    this.eventSend.StartDate = startDateString;
    this.eventSend.EndDate = endDateString;
    this.eventSend.Image = this.originalImage;
    this.eventSend.EventTopicId = this.eventForm.get('EventTopicId').value;
    this.eventSend.LocationId = this.eventForm.get('LocationId').value;
    this.eventSend.Id = this.id != null && this.id !== 0 ? this.event.EventId : 0;
    this.eventSend.Canceled = this.event.Canceled;
    this.eventSend.AttendancePercentage = this.eventForm.get('Percentage').value;
  }

  public uploadStarted = (event) => {
    if (event) {
      this.loadingBtn = true;
      this.loadingImg = true;
    }
  }

  public uploadFinished = (event) => {
    this.loadingBtn = false;
    this.loadingImg = false;
    this.originalImage = event.newFile;
  }

  public showDate(date) {
    return this.dateService.GetShortDate(date);
  }
  public showTime(date) {
    return this.dateService.GetTime(date);
  }
  public goBack() {
    if (this.event !== undefined || this.event != null) {
      this.router.navigate(['events/', this.event.EventId]);
    } else {
      this.router.navigateByUrl('events');
    }
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
