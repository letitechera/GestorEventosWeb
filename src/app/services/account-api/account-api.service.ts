import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AccountApiService {
  private headers: HttpHeaders;

  constructor(private router: Router, private http: HttpClient) {
  }

  public register(firstName, lastName, email, password) {
    const data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    this.setDefaultHeaders();
    return this.commonHttpPost(`${environment.webApiUrl}/account/register`, data, null);
  }
  
  private getAccessToken() {
    return localStorage.getItem('access_token');
  }

  private setDefaultHeaders() {
    const accessToken = this.getAccessToken();
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
  }

  private commonHttpPost(url: string, data: any, headers: HttpHeaders) {
    return this.http.post(url, data, { headers: headers });
  }

}
