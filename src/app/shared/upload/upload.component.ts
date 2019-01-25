import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { environment } from '@environment';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  public progress: number;
  public message: string;
  private baseurl = `${environment.webApiUrl}/upload/eventimage`;
  @Output() public onUploadFinished = new EventEmitter();

  constructor(private http: HttpClient) { }
 
  public formData: FormData;
  public fileLoaded: boolean;

  ngOnInit() {
    this.formData = new FormData();
  }
 
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    this.formData.append('file', fileToUpload, fileToUpload.name);
    this.fileLoaded = true;
    debugger;
  }

  public saveFile() {
    if (!this.fileLoaded) {
      return;
    }
    this.http.post(`${this.baseurl}/${1}`, this.formData, {reportProgress: true, observe: 'events'})
    .subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response) {
        this.message = 'Upload success.';
        this.fileLoaded = false;
        this.onUploadFinished.emit(event.body);
      }
    });
  }

  public clearFiles(){
    this.formData = new FormData();
    this.fileLoaded = false;
  }

}
