import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateService } from '@services/date/date.service';
import { EventsApiService } from '@services/events-api/events-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { EventFullData, EventSendableData } from '@models/event-data';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocationsApiService } from '@services/locations-api/locations-api.service';
import { FileUploadService } from '@services/file-upload/file-upload.service';
import { environment } from '@environment';

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
  public selectedlocation: any;
  public selectedtopic: any;
  public minDate: Date;
  public minEndDate: Date;
  public loading: boolean;
  public loadingBtn: boolean;
  public submitted: boolean;
  public event: EventFullData;
  private eventSend: EventSendableData;

  constructor(private route: ActivatedRoute, private eventsApi: EventsApiService, private auth: AuthApiService,
    private dateService: DateService, private locationsApi: LocationsApiService, private fileService: FileUploadService,
    private router: Router, private formBuilder: FormBuilder) { }

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
      Id: 0
    };

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      if (this.id != null && this.id != 0) {
        this.updateFlag = true;
        this.getEventInfo(this.id);
      } else {
        this.createFlag = true;
        this.initializeEmpty();
        this.GetLocations(0);
        this.GetTopics(0);
      }
    });
  }

  private GetLocations(id) {
    this.locationsApi.getAllLocations().then((locations: any[]) => {
      this.locations = locations;
      if (this.id != null && this.id != 0) {
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
      if (this.id != null && this.id != 0) {
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
      StartDate: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
      StartTime: ['00:00', [Validators.required]],
      EndTime: ['00:00', [Validators.required]],
      Description: [''],
      Image: [''],
      LocationId: [this.selectedlocation, [Validators.required]],
      EventTopicId: [this.selectedtopic, , [Validators.required]],
      Canceled: ['']
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
      Image: [this.event.Image != null || this.event.Image != "" ? this.event.Image : environment.defaultImage],
      LocationId: [this.selectedlocation, [Validators.required]],
      EventTopicId: [this.selectedtopic, [Validators.required]],
      Canceled: [this.event.Canceled]
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
        };
        this.initUpdateForm();
        this.loading = false;
        this.GetLocations(data.location.id);
        this.GetTopics(data.eventTopic.id);
      }
    }, (err) => {
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
      this.goBack();
    }, (err) => {
      console.log(err);
    });
  }

  private editEvent() {
    this.setEventObject();
    this.eventsApi.putEvent(this.eventSend).then((data: any[]) => {
      this.loadingBtn = false;
      this.goBack();
    }, (err) => {
      console.log(err);
    });
  }

  private setEventObject() {
    var startDate = this.dateService.SetTimeToDate(this.eventForm.get('StartDate').value,  this.eventForm.get('StartTime').value);
    var endDate = this.dateService.SetTimeToDate(this.eventForm.get('EndDate').value,  this.eventForm.get('EndTime').value);
    var startDateString = this.dateService.GetLongDateString(startDate);
    var endDateString = this.dateService.GetLongDateString(endDate);
    startDate = this.dateService.SetTimeToDate(new Date(startDate), this.eventForm.get('StartTime').value);
    startDate = this.dateService.SetTimeToDate(new Date(startDate), this.eventForm.get('StartTime').value);
    this.eventSend.Name = this.eventForm.get('Name').value;
    this.eventSend.Description = this.eventForm.get('Description').value;
    this.eventSend.StartDate = startDateString;
    this.eventSend.EndDate = endDateString;
    this.eventSend.Image = this.eventForm.get('Image').value;
    this.eventSend.EventTopicId = this.eventForm.get('EventTopicId').value;
    this.eventSend.LocationId = this.eventForm.get('LocationId').value;
    this.eventSend.Id = this.id != null && this.id != 0 ? this.event.EventId : 0;
    this.eventSend.Canceled = false;
  }

  public showDate(date) {
    return this.dateService.GetShortDate(date);
  }
  public showTime(date) {
    return this.dateService.GetTime(date);
  }

  public goBack() {
    this.router.navigate(['events/', this.event.EventId]);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
