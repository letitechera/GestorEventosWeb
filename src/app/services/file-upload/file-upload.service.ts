import { Injectable } from '@angular/core';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  public getEventImageUploadUrl(id){
    return `${environment.webApiUrl}/fileupload/eventimage/${id}`;
  }
  public getAccessToken() {
    return localStorage.getItem('access_token');
  }
}
