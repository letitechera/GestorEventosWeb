import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environment';
import { map } from 'rxjs/operators';
import { DateService } from '@services/date/date.service';

@Injectable({
  providedIn: 'root'
})
export class PublicApiService {

  constructor(private http: HttpClient, private dateService: DateService) { }
  private headers: HttpHeaders;

  public getAllEvents(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getAllEventsData()
        .pipe(map((results: any[]) => {
          const data = [];
          if (!results) {
            return data;
          }
          results.forEach((result) => {
            data.push({
              EventId: result.id,
              Name: result.name,
              StartDate: new Date(result.startDate),
              EndDate: new Date(result.endDate),
              Image: result.image != null ? result.image : environment.defaultImage,
              Description: result.description,
              Location: result.location,
              Address: result.address,
              Topic: result.topic,
              CreatedById: result.createdById,
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

  public getEvent(eventId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getEventData(eventId)
        .pipe(map((result: any) => {
          const data = {
            EventId: result.id,
            Name: result.name,
            StartDate: new Date(result.startDate),
            EndDate: new Date(result.endDate),
            Image: result.image != null ? result.image : environment.defaultImage,
            Description: result.description,
            Location: result.location,
            Address: result.address,
            Topic: result.eventTopic,
            CreatedById: result.createdById,
          };
          return data;
        })).subscribe((data: any) => {
          resolve(data);
          return data;
        },
          (err) => {
            reject([]);
          });
    });
  }

  public getSchedulesByEvent(eventId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getScheduleData(eventId)
        .pipe(map((results: any[]) => {
          const data = [];
          if (!results) {
            return data;
          }
          results.forEach((result) => {
            data.push({
              Id: result.id,
              EventId: result.eventId,
              Date: new Date(result.date),
              PrettyDate: this.dateService.GetPrettyDate(new Date(result.date)),
              Activities: result.activities
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

  private getAllEventsData() {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/public/events`;
    return this.commonHttpGet(url, this.headers);
  }

  private getEventData(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/public/events/${id}`;
    return this.commonHttpGet(url, this.headers);
  }

  private getScheduleData(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/public/event/${id}/schedule`;
    return this.commonHttpGet(url, this.headers);
  }

  private setDefaultHeaders() {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  private commonHttpGet(url: string, headers: HttpHeaders) {
    return this.http.get(url, { headers: headers });
  }
}
