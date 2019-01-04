import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventsApiService {

  constructor(private http: HttpClient) { }
  private headers: HttpHeaders;

  public getAllEvents() {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/all`;
    return this.commonHttpGet(url, this.headers);
  }

  public getAllTopics() {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/topics`;
    return this.commonHttpGet(url, this.headers);
  }

  public getAllEventsByUser(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/all/${id}`;
    return this.commonHttpGet(url, this.headers);
  }

  public getEventDetails(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/${id}`;
    return this.commonHttpGet(url, this.headers);
  }

  public postTopic(name) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/CreateTopic/${name}`;
    return this.commonHttpPost(url, null, this.headers);
  }

  public deleteTopic(topicId) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/DeleteTopic/${topicId}`;
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
    return this.http.patch(url, data, { headers: headers });
  }

  private commonHttpDelete(url: string, data: any, headers: HttpHeaders) {
    const requestOptions = {
      body: data,
      headers: headers
    };

    return this.http.delete(url, requestOptions);
  }
}
