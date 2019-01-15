import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendantsApiService {
  constructor(private http: HttpClient) { }
  private headers: HttpHeaders;

  public getAllAttendants() {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/attendants/all`;
    return this.commonHttpGet(url, this.headers);
  }

  public postAttendant(data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/attendants/CreateAttendant`;
    return this.commonHttpPost(url, data, this.headers);
  }

  public putAttendant(data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/attendants/UpdateAttendant`;
    return this.commonHttpPatch(url, data, this.headers);
  }

  public deleteAttendant(attendantId) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/attendants/DeleteAttendant/${attendantId}`;
    return this.commonHttpDelete(url, null, this.headers);
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

  private commonHttpGet(url: string, headers: HttpHeaders) {
    return this.http.get(url, { headers: headers });
  }

  private commonHttpPost(url: string, data: any, headers: HttpHeaders) {
    return this.http.post(url, data, { headers: headers });
  }

  private commonHttpPatch(url: string, data: any, headers: HttpHeaders) {
    return this.http.put(url, data, { headers: headers });
  }

  private commonHttpDelete(url: string, data: any, headers: HttpHeaders) {
    const requestOptions = {
      body: data,
      headers: headers
    };

    return this.http.delete(url, requestOptions);
  }
}
