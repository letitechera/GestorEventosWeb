import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateService } from '@services/date/date.service';
import { EventData } from '@models/event-data';
import { ParticipantData } from '@models/participant-data';
import { PublicApiService } from '@services/public-api/public-api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventsApiService } from '@services/events-api/events-api.service';

@Component({
  selector: 'app-event-registration',
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.scss']
})
export class EventRegistrationComponent implements OnInit, OnDestroy {
  id: number;
  private sub: any;
  public eventLoading: boolean;
  public scheduleLoading: boolean;
  public loading: boolean;
  public loadingBtn: boolean;
  public submitted: boolean;
  public event: EventData;
  public eventRegistrationForm: FormGroup;
  public participant: ParticipantData;

  constructor(private route: ActivatedRoute, private publicApi: PublicApiService,
    private dateService: DateService, private eventsApi: EventsApiService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.participant = {
      ParticipantId: 0,
      EventId: this.id,
      FirstName: '',
      LastName: '',
      Email: '',
      Phone: '',
      CellPhone: '',
      event: null,
      attendant: null
    };

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.initData(this.id);
      this.initEventRegistrationForm();
      // In a real app: dispatch action to load the details here.
    });
  }

  private initEventRegistrationForm() {
    this.eventRegistrationForm = this.formBuilder.group({
      FirstName: ["", [Validators.required]],
      LastName: ["", [Validators.required]],
      Email: ["", [Validators.required]],
      Phone: ["", [Validators.required]],
      CellPhone: ["", [Validators.required]],
    });
    this.loading = false;
  }

  public initData(id) {
    this.eventLoading = true;
    this.publicApi.getEvent(id).then((data: any) => {
      if (data != null) {
        this.event = data;
        this.eventLoading = false;
        console.log(this.event);
      }
    }, (err) => {
      console.log(err);
      this.eventLoading = false;
    });
  }

  public registerToEvent() {
    this.submitted = true;
    if (!this.eventRegistrationForm.valid) {
      return;
    }
    this.loadingBtn = true;
    this.setParticipantObject();
    this.eventsApi.registerToEvent(this.participant).then((data: any[]) => {
      this.loadingBtn = false;
      this.goBack();
    }, (err) => {
      console.log(err);
    });
  }

  private setParticipantObject() {
    this.participant.EventId = this.id;
    this.participant.FirstName = this.eventRegistrationForm.get('FirstName').value;
    this.participant.LastName = this.eventRegistrationForm.get('LastName').value;
    this.participant.Email = this.eventRegistrationForm.get('Email').value
    this.participant.Phone = this.eventRegistrationForm.get('Phone').value
    this.participant.CellPhone = this.eventRegistrationForm.get('CellPhone').value
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

  public showAbbreviatedMonth(date) {
    return this.dateService.GetAbbreviatedMonth(date).substr(0, 3).toUpperCase();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
