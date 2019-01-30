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
  public selectedType: number;
  public activityTypes: any[];
  public minDate: Date;
  public maxDate: Date;
  public submitted: boolean;
  public loading: boolean;

  constructor(public dialogRef: MatDialogRef<SchedulesModalComponent>, private schedulesApi: SchedulesApiService,
    private auth: AuthApiService, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.submitted = false;
    this.passedActivity = this.data.activity;
    this.passedScheduleId = this.data.scheduleId;
    this.minDate = this.data.startDate;
    this.maxDate = this.data.endDate;
    this.GetActivityTypes();

    this.activityData = {
      ActivityTypeId: 0,
      Description: '',
      StartTime: new Date(),
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

  private GetActivityTypes(){
    this.schedulesApi.getActivityTypes().then((data: any[]) => {
      this.activityTypes = data;
      if (this.passedActivity != null) {
        this.selectedType = this.passedActivity.ActivityTypeId;
      } else {
        this.selectedType = data[0].id;
      }
    }, (err) => {
      console.log(err);
    });
  }

  private createEmptyForm() {
    this.activityForm = this.formBuilder.group({
      ActivityTypeId: [this.selectedType, [Validators.required]],
      Description: ['', [Validators.required]],
      StartTime: [this.minDate, [Validators.required]],
      EventScheduleId: [this.passedActivity.EventScheduleId, [Validators.required]]
    });
  }

  private setCurrentForm() {
    this.activityForm = this.formBuilder.group({
      ActivityTypeId: [this.selectedType, [Validators.required]],
      Description: [this.passedActivity.Description, [Validators.required]],
      StartTime: [this.passedActivity.StartTime, [Validators.required]],
      EventScheduleId: [this.passedActivity.EventScheduleId, [Validators.required]]
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
    this.activityData.ActivityTypeId = this.activityForm.get('ActivityTypeId').value;
    this.activityData.Description = this.activityForm.get('Description').value;
    this.activityData.StartTime = this.activityForm.get('StartTime').value;
    this.activityData.EventScheduleId = this.activityForm.get('EventScheduleId').value;
    this.activityData.Id = this.data != null ? this.data.Id : 0;
  }

  public close(): void {
    this.dialogRef.close();
  }

}
