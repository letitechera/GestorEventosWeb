import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root'
})
export class GeographicsApiService {

  constructor(private http: HttpClient) { }
  private headers: HttpHeaders;

  public getAllCountries() {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/countries/all`;
    return this.commonHttpGet(url, this.headers);
  }

  public getAllCities(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/countries/${id}/cities`;
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

  private commonHttpGet(url: string, headers: HttpHeaders) {
    return this.http.get(url, { headers: headers });
  }

}
