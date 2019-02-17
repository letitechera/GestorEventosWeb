import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Speaker } from '@models/schedule-data';
import { environment } from 'environments/environment.prod';
import { SchedulesApiService } from '@services/schedules-api/schedules-api.service';
import { HttpEventType, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-speaker-modal',
  templateUrl: './speaker-modal.component.html',
  styleUrls: ['./speaker-modal.component.scss']
})
export class SpeakerModalComponent implements OnInit {

  private baseurl = `${environment.webApiUrl}/upload/speakerimage`;
  public createFlag: boolean;
  public updateFlag: boolean;
  public speakerForm: FormGroup;
  public speakerData: Speaker;
  public passedSpeaker: Speaker;
  public passedActivityId: number;
  public submitted: boolean;
  public loading: boolean;
  public loadingfile: boolean;
  public progress: number;
  public message: string;
  public formData: FormData;
  public fileLoaded: boolean;
  public fileName: string;
  public fileUrl: string;
  public resultMsg: boolean;
  eventId: any;
  originalImage: string;

  constructor(public dialogRef: MatDialogRef<SpeakerModalComponent>, private schedulesApi: SchedulesApiService,
    private auth: AuthApiService, private formBuilder: FormBuilder, private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.originalImage = environment.defaultSpeakerImage;
    debugger;
    this.formData = new FormData();

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
      this.originalImage = this.data.speaker.image;
    } else {
      this.passedSpeaker = null;
    }
    this.passedActivityId = this.data.activityId;
    this.fileUrl = this.originalImage;

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
    if (!this.speakerForm.valid || this.loadingfile) {
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
    this.speakerData.Image = this.originalImage;
    this.speakerData.ActivityId = this.passedActivityId;
    this.speakerData.Id = this.passedSpeaker != null ? this.passedSpeaker.Id : 0;
  }

  public close(): void {
    this.dialogRef.close();
  }

  public uploadFile = (files, event) => {
    this.loadingfile = true;
    if (files.length === 0 || this.loading) {
      this.fileLoaded = false;
      return;
    }
    this.resultMsg = false;
    /* Preview */
    if (event.target.files && event.target.files[0]) {
      this.fileUrl = URL.createObjectURL(event.target.files[0]);
    }
    /* Upload */
    const fileToUpload = <File>files[0];
    this.formData.append('file', fileToUpload, fileToUpload.name);
    this.fileLoaded = true;
    this.fileName = fileToUpload.name;
    this.saveFile();
  }

  public saveFile() {
    if (!this.fileLoaded) {
      return;
    }
    /* Store file */
    this.http.post(`${this.baseurl}`, this.formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
          if (this.progress === 100) {
            this.formData = new FormData();
            this.fileLoaded = false;
            this.resultMsg = true;
          }
        } else if (event.type === HttpEventType.Response) {
          this.loadingfile = false;
          let body = event.body as any;
          this.originalImage = body.newFile;
          console.log(this.originalImage);
        }
      });
  }

  public clearImage() {
    this.formData = new FormData();
    this.fileLoaded = false;
    this.fileUrl = this.originalImage;
  }

}
