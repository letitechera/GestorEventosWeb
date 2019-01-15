import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root'
})
export class LocationsApiService {

  constructor(private http: HttpClient) { }
  private headers: HttpHeaders;

  public getAllLocations() {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/locations/all`;
    return this.commonHttpGet(url, this.headers);
  }

  public postLocation(data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/locations/CreateLocation`;
    return this.commonHttpPost(url, data, this.headers);
  }

  public putLocation(data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/locations/UpdateLocation`;
    return this.commonHttpPatch(url, data, this.headers);
  }

  public deleteLocation(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/locations/DeleteLocation/${id}`;
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
