import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//import { environment } from '@env';

@Injectable()
export class AuthApiService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
  }

  public login(username, password) {
    let data = {
      username: username,
      password: password
    };
    return this.commonHttpPost('https://localhost:44314/api/auth/login', data, null);  
  }

  private setDefaultHeaders(accessToken) {
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
}
