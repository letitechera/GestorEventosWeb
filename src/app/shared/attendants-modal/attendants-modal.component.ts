import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AttendantsApiService } from '@services/attendants-api/attendants-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { Interested } from '@models/interested-data';
import { InterestedComponent } from '@pages/interested/interested.component';

@Component({
  selector: 'app-attendants-modal',
  templateUrl: './attendants-modal.component.html',
  styleUrls: ['./attendants-modal.component.scss']
})
export class AttendantsModalComponent implements OnInit {

  public createFlag: boolean
  public updateFlag: boolean
  public attendantsForm: FormGroup;
  public submitted: boolean;
  public attendant: Interested;
  public EMAIL_REGEX = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
  public loading: boolean;

  constructor(public dialogRef: MatDialogRef<AttendantsModalComponent>, private attendantsApi: AttendantsApiService,
    private auth: AuthApiService, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.auth.checkSession();
    this.submitted = false;
    this.attendant = {
      FirstName: '',
      LastName: '',
      Email: '',
      Id: null
    };
    if (this.data == null) {
      this.createFlag = true;
      this.createEmptyForm();
    }
    else {
      this.updateFlag = true;
      this.setCurrentForm();
    }
  }

  private createEmptyForm() {
    this.attendantsForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.EMAIL_REGEX)]]
    });
  }

  private setCurrentForm() {
    this.attendantsForm = this.formBuilder.group({
      firstName: [this.data.FirstName, [Validators.required]],
      lastName: [this.data.LastName, [Validators.required]],
      email: [this.data.Email, [Validators.required, Validators.pattern(this.EMAIL_REGEX)]]
    });
  }

  public submitAttendant() {
    this.submitted = true;
    if (!this.attendantsForm.valid) {
      return;
    }
    this.loading = true;
    if (this.createFlag) {
      this.addAttendant();
    } else {
      this.editAttendant();
    }
  }

  private addAttendant() {
    this.postAttendant().then((data: any[]) => {
      this.dialogRef.close('changed');
    }, (err) => {
      console.log(err);
    });
  }

  private postAttendant(): Promise<any> {
    this.setAttendantObject();
    return new Promise<any>((resolve, reject) => {
      this.attendantsApi.postAttendant(this.attendant).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  private editAttendant() {
    this.putAttendant().then((data: any[]) => {
      console.log(data);
      this.dialogRef.close('changed');
    }, (err) => {
      console.log(err);
    });
  }

  private putAttendant(): Promise<any> {
    this.setAttendantObject();
    return new Promise<any>((resolve, reject) => {
      this.attendantsApi.putAttendant(this.attendant).subscribe((data) => {
        console.log(data);
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  private setAttendantObject() {
    this.attendant.FirstName = this.attendantsForm.get('firstName').value;
    this.attendant.LastName = this.attendantsForm.get('lastName').value;
    this.attendant.Email = this.attendantsForm.get('email').value;
    this.attendant.Id = this.data != null ? this.data.Id : 0;
  }

  public close(): void {
    this.dialogRef.close();
  }
}
