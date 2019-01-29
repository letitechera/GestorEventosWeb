import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SchedulesApiService } from '@services/schedules-api/schedules-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { Schedule } from '@models/schedule-data';
import { EventsApiService } from '@services/events-api/events-api.service';

@Component({
  selector: 'app-schedules-modal',
  templateUrl: './schedules-modal.component.html',
  styleUrls: ['./schedules-modal.component.scss']
})
export class SchedulesModalComponent implements OnInit {

  public createFlag: boolean;
  public updateFlag: boolean;
  public scheduleForm: FormGroup;
  public scheduleData: Schedule;
  public passedSchedule: Schedule;
  public passedEventId: number;
  public minDate: Date;
  public maxDate: Date;
  public submitted: boolean;
  public loading: boolean;

  constructor(public dialogRef: MatDialogRef<SchedulesModalComponent>, private schedulesApi: SchedulesApiService,
    private auth: AuthApiService, private formBuilder: FormBuilder, private eventsApi: EventsApiService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.submitted = false;
    this.passedSchedule = this.data.schedule;
    this.passedEventId = this.data.eventId;
    this.minDate = this.data.startDate;
    this.maxDate = this.data.endDate;

    this.scheduleData = {
      EventId: this.passedEventId,
      Date: this.minDate,
      PrettyDate: '',
      Id: 0
    };
    if (this.data.schedule == null) {
      this.createFlag = true;
      this.createEmptyForm();
    } else {
      this.updateFlag = true;
      this.setCurrentForm();
    }
  }

  private createEmptyForm() {
    this.scheduleForm = this.formBuilder.group({
      Date: [this.minDate, [Validators.required]],
    });
  }

  private setCurrentForm() {
    this.scheduleForm = this.formBuilder.group({
      Date: [this.passedSchedule.Date, [Validators.required]],
    });
  }

  public submitSchedule() {
    this.submitted = true;
    if (!this.scheduleForm.valid) {
      return;
    }
    this.loading = true;
    if (this.createFlag) {
      this.addSchedule();
    } else {
      this.editSchedule();
    }
  }

  private addSchedule() {
    this.setScheduleObject();
    this.schedulesApi.postSchedule(this.scheduleData).then((data: any[]) => {
      this.dialogRef.close('changed');
    }, (err) => {
      console.log(err);
    });
  }

  private editSchedule() {
    this.setScheduleObject();
    this.schedulesApi.putSchedule(this.scheduleData).then((data: any[]) => {
      console.log(data);
      this.dialogRef.close('changed');
    }, (err) => {
      console.log(err);
    });
  }

  private setScheduleObject() {
    this.scheduleData.Date = this.scheduleForm.get('Date').value;
    this.scheduleData.EventId = this.passedEventId;
    this.scheduleData.Id = this.passedSchedule != null ? this.passedSchedule.Id : 0;
  }

  public close(): void {
    this.dialogRef.close();
  }
}
