import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActionsApiService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) { }

  private setDefaultHeaders() {
    const accessToken = this.getAccessToken();
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
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