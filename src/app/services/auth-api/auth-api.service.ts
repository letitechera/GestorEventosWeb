import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environment';
import { Router } from '@angular/router';

@Injectable()
export class AuthApiService {

  constructor(private http: HttpClient, private router: Router) {
  }

  public login(username, password) {
    const data = {
      username: username,
      password: password
    };
    return this.commonHttpPost(`${environment.webApiUrl}/auth/login`, data, null);
  }

  public setSession(data) {
    const expiresAt = JSON.stringify((data.expires_in * 1000) + new Date().getTime());
    localStorage.setItem('eg_auth_token', data.auth_token);
    localStorage.setItem('expires_in', expiresAt);
  }

  public isLogged() {
    const token = this.getAccessToken();
    return token != null && token !== '' ? true : false;
  }

  private getAccessToken() {
    return localStorage.getItem('eg_auth_token');
  }

  private deleteSession() {
    localStorage.removeItem('eg_auth_token');
    localStorage.removeItem('expires_in');
    localStorage.clear();
  }

  public logout() {
    this.deleteSession();
    this.router.navigateByUrl('login');
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_in'));
    return new Date().getTime() < expiresAt;
  }

  private setDefaultHeaders() {
    const accessToken = this.getAccessToken();
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
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

}
