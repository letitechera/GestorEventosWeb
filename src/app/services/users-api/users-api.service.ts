import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

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

  public getUserProfile(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      var id = this.getUserId();
      this.getUserById(id)
        .pipe(map((result: any) => {
          if (result == null) {
            return null;
          }
          return result;
        })).subscribe((data: any[]) => {
          resolve(data);
        },
          (err) => {
            reject([]);
          });
    });
  }
  
  private getUserById(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/users/${id}`;
    return this.commonHttpGet(url, this.headers);
  }

  public putAccount(event): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.putAccountData(event).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }
  
  private putAccountData(data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/account/edit`;
    return this.commonHttpPut(url, data, this.headers);
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

  private commonHttpPut(url: string, data: any, headers: HttpHeaders) {
    return this.http.put(url, data, { headers: headers });
  }
}
