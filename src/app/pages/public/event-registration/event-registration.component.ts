import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateService } from '@services/date/date.service';
import { EventData } from '@models/event-data';
import { PublicApiService } from '@services/public-api/public-api.service';
import { FormGroup, FormBuilder } from '@angular/forms';

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
  public event: EventData;
  public eventRegistrationForm: FormGroup;

  constructor(private route: ActivatedRoute, private publicApi: PublicApiService, 
    private dateService: DateService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.initData(this.id);
      // In a real app: dispatch action to load the details here.
    });
  }

  private initEventRegistrationForm() {
    this.eventRegistrationForm = this.formBuilder.group({
      Id: [this.account.UserId, [Validators.required]],
      FirstName: [this.account.FirstName, [Validators.required]],
      LastName: [this.account.LastName, [Validators.required]],
      Email: [this.account.Email, [Validators.required]],
      Phone: [this.account.Phone, [Validators.required]],
      CellPhone: [this.account.CellPhone, [Validators.required]],
      Job: [this.account.Job, [Validators.required]],
      Organization: [this.account.Organization, [Validators.required]],
      Address1: [this.account.Address1, [Validators.required]],
      Address2: [this.account.Address2, [Validators.required]],
      City: [this.account.City, [Validators.required]],
      Country: [this.account.Country, [Validators.required]],
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

  public registerToEvent(){
    
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
