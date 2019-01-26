import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {

  constructor(private http: HttpClient) { }
  private headers: HttpHeaders;

  public getUsers() {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/users`;
    return this.commonHttpGet(url, this.headers);
  }

  public getUserProfile() {
    const id = this.getUserId();
    return this.getUserById(id);
  }
  
  public getUserById(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/users/${id}`;
    return this.commonHttpGet(url, this.headers);
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

  private getUserId() {
    return localStorage.getItem('user_id');
  } 

  private commonHttpGet(url: string, headers: HttpHeaders) {
    return this.http.get(url, { headers: headers });
  }
}
