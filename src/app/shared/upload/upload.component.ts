import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { environment } from '@environment';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @Input() eventId: number;
  @Input() originalImage: string;
  public progress: number;
  public message: string;
  private baseurl = `${environment.webApiUrl}/upload/eventimage`;
  @Output() public onUploadFinished = new EventEmitter();

  constructor(private http: HttpClient) { }

  public formData: FormData;
  public loadingfile: boolean;
  public fileLoaded: boolean;
  public fileName: string;
  public fileUrl: string;
  public resultMsg: boolean;

  ngOnInit() {
    this.formData = new FormData();
    var emptyImage = this.originalImage == null || this.originalImage == "";
    this.originalImage = this.eventId == 0 || emptyImage ? environment.defaultImage : this.originalImage;
    this.fileUrl = this.originalImage;
  }

  public uploadFile = (files, event) => {
    if (files.length === 0) {
      this.fileLoaded = false;
      return;
    }
    this.resultMsg = false;
    /* Preview */
    if (event.target.files && event.target.files[0]) {
      this.fileUrl = URL.createObjectURL(event.target.files[0]);
    }

    /* Partial Upload */
    let fileToUpload = <File>files[0];
    this.formData.append('file', fileToUpload, fileToUpload.name);
    this.fileLoaded = true;
    this.fileName = fileToUpload.name;

    if(this.eventId == 0){
      this.saveFile();
    }
  }

  public saveFile() {
    if (!this.fileLoaded) {
      return;
    }
    /* Store file */
    this.loadingfile = true;

    this.http.post(`${this.baseurl}/${this.eventId}`, this.formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
          if (this.progress == 100) {
            if(this.eventId != 0){
              this.loadingfile = false;
            }
            this.formData = new FormData();
            this.fileLoaded = false;
            this.resultMsg = true;
          }
        }
        else if (event.type === HttpEventType.Response) {
          if(this.eventId == 0){
            this.loadingfile = false;
          }
          this.onUploadFinished.emit(event.body);
        }
      });
  }

  public clearImage() {
    this.formData = new FormData();
    this.fileLoaded = false;
    this.fileUrl = this.originalImage;
  }

}
