import { Injectable, EventEmitter, Output } from '@angular/core';
import { environment } from '@environment';
import { HttpHeaders, HttpClient, HttpEventType } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  public message: string;
  private headers: HttpHeaders;

  @Output() public onUploadFinished = new EventEmitter();

  constructor(private http: HttpClient) { }

  public postEventImage(eventId, formData): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.postEventImageData(eventId, formData).subscribe(event => {
        if (event.type === HttpEventType.Response) {
          this.onUploadFinished.emit(event.body);
        }
        resolve(event);
      });
    });
  };

  private postEventImageData(eventId, data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/upload/eventimage/${eventId}`;
    return this.commonHttpPost(url, data, this.headers);
  }

  private setDefaultHeaders() {
    const accessToken = this.getAccessToken();
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });
  }

  private getAccessToken() {
    return localStorage.getItem('access_token');
  }

  private commonHttpPost(url: string, data: any, headers: HttpHeaders) {
    return this.http.post(url, data, { reportProgress: true, observe: 'events', headers: headers }, );
  }
}
