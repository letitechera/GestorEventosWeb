import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '@environment';
import { DateService } from '@services/date/date.service';

@Injectable({
  providedIn: 'root'
})
export class SchedulesApiService {

  constructor(private http: HttpClient, private dateService: DateService) { }
  private headers: HttpHeaders;

  public getSchedulesByEvent(eventId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getSchedulesByEventData(eventId)
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

  public getSchedule(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getScheduleData(id)
        .pipe(map((result: any) => {
          let data = null;
          if (!result) {
            return data;
          }
          data = {
            Id: result.id,
            EventId: result.eventId,
            Date: result.date
          };
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

  public postSchedule(schedule): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.postScheduleData(schedule).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public putSchedule(schedule): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.putScheduleData(schedule).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public deleteSchedule(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.deleteScheduleData(id).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public getActivitiesBySchedule(scheduleId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getActivitiesByScheduleData(scheduleId)
        .pipe(map((results: any[]) => {
          const data = [];
          if (!results) {
            return data;
          }
          results.forEach((result) => {
            data.push({
              Id: result.id,
              Name: result.name,
              Description: result.description,
              StartTime: new Date(result.startTime),
              ActivityTypeId: result.activityTypeId,
              EventScheduleId: result.eventId,
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

  public postActivity(activity): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.postActivityData(activity).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public putActivity(activity): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.putActivityData(activity).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public deleteActivity(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.deleteActivityData(id).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public getSpeakersByActivity(activityId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getSpeakersByActivityData(activityId)
        .pipe(map((results: any[]) => {
          const data = [];
          if (!results) {
            return data;
          }
          results.forEach((result) => {
            data.push({
              Id: result.id,
              FirstName: result.firstName,
              LastName: result.lastName,
              Position: result.position,
              Nationality: result.nationality,
              Company: result.company,
              Contact: result.contact,
              Image: result.image,
              ActivityId: result.activityId,
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

  public postSpeaker(speaker): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.postSpeakerData(speaker).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public putSpeaker(speaker): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.putSpeakerData(speaker).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public deleteSpeaker(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.deleteSpeakerData(id).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public getActivityTypes(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getActivityTypesData()
        .pipe(map((results: any[]) => {
          const data = [];
          if (!results) {
            return data;
          }
          results.forEach((result) => {
            data.push({
              Id: result.id,
              Name: result.name,
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

  private getSchedulesByEventData(eventId) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/schedules/event/${eventId}/all`;
    return this.commonHttpGet(url, this.headers);
  }

  private getScheduleData(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/schedules/${id}`;
    return this.commonHttpGet(url, this.headers);
  }

  private postScheduleData(data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/schedules/CreateSchedule`;

    return this.commonHttpPost(url, data, this.headers);
  }

  private putScheduleData(data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/schedules/UpdateSchedule`;
    return this.commonHttpPut(url, data, this.headers);
  }

  private deleteScheduleData(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/schedules/DeleteSchedule/${id}`;
    return this.commonHttpDelete(url, null, this.headers);
  }

  private getActivitiesByScheduleData(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/schedules/${id}/activities`;
    return this.commonHttpGet(url, this.headers);
  }

  private postActivityData(data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/schedules/CreateActivity`;
    return this.commonHttpPost(url, data, this.headers);
  }

  private putActivityData(data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/schedules/UpdateActivity`;
    return this.commonHttpPut(url, data, this.headers);
  }

  private deleteActivityData(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/schedules/DeleteActivity/${id}`;
    return this.commonHttpDelete(url, null, this.headers);
  }

  private getSpeakersByActivityData(activityId) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/speakers/${activityId}/speakers`;
    return this.commonHttpGet(url, this.headers);
  }

  private postSpeakerData(data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/speakers/CreateSpeaker`;
    return this.commonHttpPost(url, data, this.headers);
  }

  private putSpeakerData(data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/speakers/UpdateSpeaker`;
    return this.commonHttpPut(url, data, this.headers);
  }

  private deleteSpeakerData(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/speakers/DeleteSpeaker/${id}`;
    return this.commonHttpDelete(url, null, this.headers);
  }

  private getActivityTypesData() {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/schedules/activitytypes`;
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
