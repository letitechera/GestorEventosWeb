import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Activity } from '@models/schedule-data';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SchedulesModalComponent } from '@shared/schedules-modal/schedules-modal.component';
import { SchedulesApiService } from '@services/schedules-api/schedules-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';

@Component({
  selector: 'app-activity-modal',
  templateUrl: './activity-modal.component.html',
  styleUrls: ['./activity-modal.component.scss']
})
export class ActivityModalComponent implements OnInit {

  public createFlag: boolean;
  public updateFlag: boolean;
  public activityForm: FormGroup;
  public activityData: Activity;
  public passedActivity: Activity;
  public passedScheduleId: number;
  public minDate: Date;
  public maxDate: Date;
  public submitted: boolean;
  public loading: boolean;

  constructor(public dialogRef: MatDialogRef<ActivityModalComponent>, private schedulesApi: SchedulesApiService,
    private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.submitted = false;
    this.passedActivity = this.data.activity;
    this.passedScheduleId = this.data.scheduleId;
    this.minDate = this.data.startDate;
    this.maxDate = this.data.endDate;

    this.activityData = {
      ActivityTypeId: 0,
      Description: '',
      StartTime: new Date(),
      EndTime: new Date(),
      EventScheduleId: this.passedScheduleId,
      Id: 0
    };
    if (this.passedActivity == null) {
      this.createFlag = true;
      this.createEmptyForm();
    } else {
      this.updateFlag = true;
      this.setCurrentForm();
    }
  }

  private createEmptyForm() {
    this.activityForm = this.formBuilder.group({
      Date: [this.minDate, [Validators.required]],
    });
  }

  private setCurrentForm() {
    this.activityForm = this.formBuilder.group({
      ActivityTypeId: [this.passedActivity.ActivityTypeId, [Validators.required]],
      Description: [this.passedActivity.Description, [Validators.required]],
      StartTime: [this.passedActivity.StartTime, [Validators.required]],
      EndTime: [this.passedActivity.EndTime, [Validators.required]],
      EventScheduleId: [this.passedActivity.EventScheduleId, [Validators.required]]
    });
  }

}
