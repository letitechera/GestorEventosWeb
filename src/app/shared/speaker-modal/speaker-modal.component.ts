import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Speaker } from '@models/schedule-data';
import { environment } from 'environments/environment.prod';
import { SchedulesApiService } from '@services/schedules-api/schedules-api.service';

@Component({
  selector: 'app-speaker-modal',
  templateUrl: './speaker-modal.component.html',
  styleUrls: ['./speaker-modal.component.scss']
})
export class SpeakerModalComponent implements OnInit {

  public createFlag: boolean;
  public updateFlag: boolean;
  public speakerForm: FormGroup;
  public speakerData: Speaker;
  public passedSpeaker: Speaker;
  public passedActivityId: number;
  public submitted: boolean;
  public loading: boolean;

  constructor(public dialogRef: MatDialogRef<SpeakerModalComponent>, private schedulesApi: SchedulesApiService,
    private auth: AuthApiService, private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.submitted = false;
    if (this.data.speaker != null) {
      this.passedSpeaker = {
        FirstName: this.data.speaker.firstName,
        LastName: this.data.speaker.lastName,
        Position: this.data.speaker.position,
        Nationality: this.data.speaker.nationality,
        Company: this.data.speaker.company,
        Contact: this.data.speaker.contact,
        Image: this.data.speaker.image,
        ActivityId: this.data.speaker.activityId,
        Id: this.data.speaker.id
      };
    } else {
      this.passedSpeaker = null;
    }
    this.passedActivityId = this.data.activityId;

    if (this.passedSpeaker == null) {
      this.createFlag = true;
      this.createEmptyForm();
    } else {
      this.updateFlag = true;
      this.setCurrentForm();
    }

    this.speakerData = {
      FirstName: '',
      LastName: '',
      Position: '',
      Nationality: '',
      Company: '',
      Contact: '',
      Image: '',
      ActivityId: 0,
      Id: 0
    };
  }

  private createEmptyForm() {
    this.speakerForm = this.formBuilder.group({
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      Position: ['', [Validators.required]],
      Nationality: ['', [Validators.required]],
      Company: [''],
      Contact: [''],
      Image: [environment.defaultImage, [Validators.required]],
    });
  }

  private setCurrentForm() {
    this.speakerForm = this.formBuilder.group({
      FirstName: [this.passedSpeaker.FirstName, [Validators.required]],
      LastName: [this.passedSpeaker.LastName, [Validators.required]],
      Position: [this.passedSpeaker.Position, [Validators.required]],
      Nationality: [this.passedSpeaker.Nationality, [Validators.required]],
      Company: [this.passedSpeaker.Company],
      Contact: [this.passedSpeaker.Contact],
      Image: [this.passedSpeaker.Image, [Validators.required]],
    });
  }

  public submitSpeaker() {
    this.submitted = true;
    if (!this.speakerForm.valid) {
      return;
    }
    this.loading = true;
    if (this.createFlag) {
      this.addSpeaker();
    } else {
      this.editSpeaker();
    }
  }

  private addSpeaker() {
    this.setSpeakerObject();
    this.schedulesApi.postSpeaker(this.speakerData).then((data: any[]) => {
      this.dialogRef.close('changed');
    }, (err) => {
      console.log(err);
    });
  }

  private editSpeaker() {
    this.setSpeakerObject();
    this.schedulesApi.putSpeaker(this.speakerData).then((data: any[]) => {
      this.dialogRef.close('changed');
    }, (err) => {
      console.log(err);
    });
  }

  private setSpeakerObject() {
    this.speakerData.FirstName = this.speakerForm.get('FirstName').value;
    this.speakerData.LastName = this.speakerForm.get('LastName').value;
    this.speakerData.Position = this.speakerForm.get('Position').value;
    this.speakerData.Nationality = this.speakerForm.get('Nationality').value;
    this.speakerData.Company = this.speakerForm.get('Company').value;
    this.speakerData.Contact = this.speakerForm.get('Contact').value;
    this.speakerData.Image = this.speakerForm.get('Image').value;
    this.speakerData.ActivityId = this.passedActivityId;
    this.speakerData.Id = this.passedSpeaker != null ? this.passedSpeaker.Id : 0;
  }

  public close(): void {
    this.dialogRef.close();
  }

}
