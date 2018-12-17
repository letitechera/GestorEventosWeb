import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environment';
import { Router } from '@angular/router';

@Injectable()
export class AuthApiService {
  private headers: HttpHeaders;

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
    console.log(data);
    // const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    // localStorage.setItem('access_token', authResult.accessToken);
    // localStorage.setItem('expires_at', expiresAt);
  }

  public isLogged() {
    const token = this.getAccessToken();
    return token != null && token !== '' ? true : false;
  }

  private getAccessToken() {
    return localStorage.getItem('access_token');
  }

  private deleteSession() {
    localStorage.removeItem('access_token');
    // localStorage.removeItem('expires_at');
    localStorage.clear();
  }

  public logout() {
    this.deleteSession();
    this.router.navigateByUrl('login');
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
