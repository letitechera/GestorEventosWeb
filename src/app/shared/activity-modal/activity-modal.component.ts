import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Activity, ActivitySendable } from '@models/schedule-data';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SchedulesModalComponent } from '@shared/schedules-modal/schedules-modal.component';
import { SchedulesApiService } from '@services/schedules-api/schedules-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { DateService } from '@services/date/date.service';

@Component({
  selector: 'app-activity-modal',
  templateUrl: './activity-modal.component.html',
  styleUrls: ['./activity-modal.component.scss']
})
export class ActivityModalComponent implements OnInit {

  public createFlag: boolean;
  public updateFlag: boolean;
  public activityForm: FormGroup;
  public activityData: ActivitySendable;
  public passedActivity: Activity;
  public passedScheduleId: number;
  public passedStartDate: Date;
  public selectedType: number;
  public activityTypes: any[];
  public minDate: Date;
  public maxDate: Date;
  public submitted: boolean;
  public loading: boolean;

  constructor(public dialogRef: MatDialogRef<SchedulesModalComponent>, private schedulesApi: SchedulesApiService,
    private auth: AuthApiService, private formBuilder: FormBuilder, private dateService: DateService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.submitted = false;
    if (this.data.activity != null) {
      this.passedActivity = {
        Name: this.data.activity.name,
        Description: this.data.activity.description,
        StartTime: this.data.activity.startTime,
        ActivityTypeId: this.data.activity.activityTypeId,
        EventScheduleId: this.data.activity.scheduleId,
        Id: this.data.activity.id
      };
    } else {
      this.passedActivity = null;
    }
    this.passedStartDate = new Date(this.data.scheduleStartDate);
    this.passedScheduleId = this.data.scheduleId;
    debugger;
    this.GetActivityTypes();

    if (this.passedActivity == null) {
      this.minDate = this.passedStartDate;
      this.createFlag = true;
      this.createEmptyForm();
    } else {
      this.minDate = new Date(this.passedActivity.StartTime);
      this.updateFlag = true;
      this.setCurrentForm();
    }

    this.activityData = {
      ActivityTypeId: 0,
      Name: '',
      Description: '',
      StartTime: '',
      EventScheduleId: this.passedScheduleId,
      Id: 0
    };
  }

  private GetActivityTypes() {
    this.schedulesApi.getActivityTypes().then((data: any[]) => {
      this.activityTypes = data;
      if (this.passedActivity != null) {
        this.selectedType = this.passedActivity.ActivityTypeId;
      } else {
        this.selectedType = data[0].Id;
      }
    }, (err) => {
      console.log(err);
    });
  }

  private createEmptyForm() {
    const startTime = this.dateService.GetCustomTime(this.minDate);
    this.activityForm = this.formBuilder.group({
      ActivityTypeId: [this.selectedType, [Validators.required]],
      Name: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      StartTime: [startTime, [Validators.required]],
    });
  }

  private setCurrentForm() {
    debugger;
    const startTime = this.dateService.GetCustomTime(this.passedActivity.StartTime);
    this.activityForm = this.formBuilder.group({
      ActivityTypeId: [this.selectedType, [Validators.required]],
      Name: [this.passedActivity.Name, [Validators.required]],
      Description: [this.passedActivity.Description, [Validators.required]],
      StartTime: [startTime, [Validators.required]],
    });
  }

  public submitActivity() {
    this.submitted = true;
    if (!this.activityForm.valid) {
      return;
    }
    this.loading = true;
    if (this.createFlag) {
      this.addActivity();
    } else {
      this.editActivity();
    }
  }

  private addActivity() {
    this.setActivityObject();
    this.schedulesApi.postActivity(this.activityData).then((data: any[]) => {
      this.dialogRef.close('changed');
    }, (err) => {
      console.log(err);
    });
  }

  private editActivity() {
    this.setActivityObject();
    this.schedulesApi.putActivity(this.activityData).then((data: any[]) => {
      console.log(data);
      this.dialogRef.close('changed');
    }, (err) => {
      console.log(err);
    });
  }

  private setActivityObject() {
    const startDate = this.dateService.SetTimeToDate(this.minDate, this.activityForm.get('StartTime').value);
    const startDateString = this.dateService.GetLongDateString(startDate);

    this.activityData.ActivityTypeId = this.activityForm.get('ActivityTypeId').value;
    this.activityData.Name = this.activityForm.get('Name').value;
    this.activityData.Description = this.activityForm.get('Description').value;
    this.activityData.StartTime = startDateString;
    this.activityData.EventScheduleId = this.passedScheduleId;
    this.activityData.Id = this.data != null ? this.data.Id : 0;
  }

  public close(): void {
    this.dialogRef.close();
  }
}
