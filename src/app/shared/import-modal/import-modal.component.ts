import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { AttendantsApiService } from '@services/attendants-api/attendants-api.service';
import { environment } from '@environment';
import { HttpEventType, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-import-modal',
  templateUrl: './import-modal.component.html',
  styleUrls: ['./import-modal.component.scss']
})
export class ImportModalComponent implements OnInit {

  public formData: FormData;
  public submitted: boolean;
  public loading: boolean;
  public fileLoaded: boolean;
  public fileUrl: string;
  public fileName: string;
  private baseurl = `${environment.webApiUrl}/upload/import/xml`;
  public progress: number;
  public message: string;

  constructor(public dialogRef: MatDialogRef<ImportModalComponent>, private auth: AuthApiService,
    private formBuilder: FormBuilder, private attendantsApi: AttendantsApiService, private http: HttpClient) { }

  ngOnInit() {
    this.formData = new FormData();
  }

  public uploadFile = (files, event) => {
    debugger;
    if (files.length === 0) {
      this.fileLoaded = false;
      return;
    }
    /* Preview */
    if (event.target.files && event.target.files[0]) {
      this.fileUrl = URL.createObjectURL(event.target.files[0]);
    }

    /* Partial Upload */
    const fileToUpload = <File>files[0];
    this.formData.append('file', fileToUpload, fileToUpload.name);
    this.fileLoaded = true;
    this.fileName = fileToUpload.name;
  }

  public submitImport() {
    if (!this.fileLoaded) {
      return;
    }
    /* Store file */
    this.loading = true;

    this.http.post(`${this.baseurl}`, this.formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
          if (this.progress === 100) {
            this.formData = new FormData();
            this.fileLoaded = false;
          }
        } else if (event.type === HttpEventType.Response) {
          this.loading = false;
          this.dialogRef.close('changed');
        }
      });
  }

  public clearImage() {
    this.formData = new FormData();
    this.fileLoaded = false;
    this.fileUrl = '';
  }

  public close(): void {
    this.dialogRef.close();
  }

}
