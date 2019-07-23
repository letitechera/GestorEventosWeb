import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationsApiService {

  constructor(private http: HttpClient) { }
  private headers: HttpHeaders;

  public getAllLocations(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getAllLocationsData()
        .pipe(map((results: any[]) => {
          const data = [];
          if (!results) {
            return data;
          }
          results.forEach((result) => {
            data.push({
              Id: result.id,
              Name: result.name,
              Address1: result.address1,
              Address2: result.address2,
              City: result.city,
              Country: result.country,
              Capacity: result.capacity,
              Latitude: result.latitude,
              Longitude: result.longitude,
            });
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
  
  public postLocation(location): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.postLocationData(location).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public putLocation(location): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.putLocationData(location).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }
  
  public deleteLocation(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.deleteLocationData(id).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  private getAllLocationsData() {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/locations/all`;
    return this.commonHttpGet(url, this.headers);
  }

  private postLocationData(data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/locations/CreateLocation`;
    return this.commonHttpPost(url, data, this.headers);
  }

  private putLocationData(data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/locations/UpdateLocation`;
    return this.commonHttpPut(url, data, this.headers);
  }

  private deleteLocationData(id) {
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

  private commonHttpPut(url: string, data: any, headers: HttpHeaders) {
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
