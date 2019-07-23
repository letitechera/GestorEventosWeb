import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeographicsApiService {

  constructor(private http: HttpClient) { }
  private headers: HttpHeaders;

  public getAllCountries(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getAllCountriesData()
        .pipe(map((results: any[]) => {
          const data = [];
          if (!results) {
            return data;
          }
          results.forEach((result) => {
            data.push(result);
          });
          return data;
        })).subscribe((data: any[]) => {
          resolve(data);
          return data;
        },
          (err) => {
            reject([]);
          });
    });
  }

  public getAllCities(countryId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getAllCitiesData(countryId)
        .pipe(map((results: any[]) => {
          const data = [];
          if (!results) {
            return data;
          }
          results.forEach((result) => {
            data.push(result);
          });
          return data;
        })).subscribe((data: any[]) => {
          resolve(data);
          return data;
        },
          (err) => {
            reject([]);
          });
    });
  }

  private getAllCountriesData() {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/countries/all`;
    return this.commonHttpGet(url, this.headers);
  }

  private getAllCitiesData(id) {
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
