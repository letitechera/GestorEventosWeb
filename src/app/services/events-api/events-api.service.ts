import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class EventsApiService {

  constructor(private http: HttpClient, private notifier: NotifierService) { }
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
              SmallImage: result.smallImage != null ? result.smallImage : '',
              Image: result.image != null ? result.image : '',
              Description: result.description,
              Location: result.location,
              Address: result.address,
              Topic: result.topic,
              Percentage: result.percentage,
              CreatedById: result.createdById,
              Canceled: result.canceled
            });
          });
          return data;
        })).subscribe((data: any[]) => {
          resolve(data);
        },
          (err) => {
            reject([]);
          });
    });
  }

  public getAllEventsById(userId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getAllEventsByUser(userId)
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
              SmallImage: result.smallImage != null ? result.smallImage : '',
              Image: result.image != null ? result.image : '',
              Description: result.description,
              Location: result.location,
              Address: result.address,
              Topic: result.topic,
              Percentage: result.percentage,
              CreatedById: result.createdById,
              Canceled: result.canceled
            });
          });
          return data;
        })).subscribe((data: any[]) => {
          resolve(data);
        },
          (err) => {
            reject([]);
          });
    });
  }

  public getEventDetails(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getEventDetailsData(id)
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

  public getEventDates(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getEventDatesData(id)
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

  public getCompleteEvent(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getCompleteEventData(id)
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

  public postEvent(event): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.postEventData(event).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public putEvent(event): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.putEventData(event).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public deleteEvent(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.deleteEventData(id).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public cancelEvent(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.cancelEventData(id).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public getAllTopics(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getAllTopicsData()
        .pipe(map((results: any[]) => {
          const data = [];
          if (!results) {
            return data;
          }
          results.forEach((result) => {
            data.push({
              TopicId: result.id,
              Name: result.name,
            });
          });
          return data;
        })).subscribe((data: any[]) => {
          resolve(data);
        },
          (err) => {
            reject([]);
          });
    });
  }

  public postTopic(name): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.postTopicData(name).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public deleteTopic(topicId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.deleteTopicData(topicId).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public sendCampaign(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.sendCampaignData(id)
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

  public accredit(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.accreditParticipant(id)
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

  public getParticipants(eventId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getParticipantsData(eventId)
        .pipe(map((results: any[]) => {
          const data = [];
          if (!results) {
            return data;
          }
          results.forEach((result) => {
            data.push({
              ParticipantId: result.id,
              FirstName: result.firstName,
              LastName: result.lastName,
              Email: result.email,
              Phone: result.phone,
              CellPhone: result.cellPhone
            });
          });
          return data;
        })).subscribe((data: any[]) => {
          resolve(data);
        },
          (err) => {
            reject([]);
          });
    });
  }

  public sendCertificates(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.sendCertificateData(id)
        .pipe(map((result: any) => {
          debugger;
          if (result == null) {
            return null;
          }
          return result;
        })).subscribe((data: any[]) => {
          resolve(data);
          debugger;
        },
          (err) => {
            reject([]);
            if (err.status == 200) {
              this.notifier.notify('success', 'Los certificados están siendo enviados');
            } else {
              this.notifier.notify('error', 'Ups.. Ha ocurrido un error');
            }
          });
    });
  }

  public registerToEvent(participant): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.registerToEventData(participant)
        .pipe(map((result: any) => {
          if (result == null) {
            return null;
          }
          return result;
        })).subscribe(data => {
          resolve(data);
        },
          (err) => {
            reject([]);
          });
    });
  }

  private getAllEventsData() {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/all`;
    return this.commonHttpGet(url, this.headers);
  }

  private getAllEventsByUser(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/all/${id}`;
    return this.commonHttpGet(url, this.headers);
  }

  private getEventDetailsData(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/${id}`;
    return this.commonHttpGet(url, this.headers);
  }

  private getEventDatesData(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/${id}/dates`;
    return this.commonHttpGet(url, this.headers);
  }

  private getCompleteEventData(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/${id}/whole`;
    return this.commonHttpGet(url, this.headers);
  }

  private postEventData(data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/CreateEvent`;
    return this.commonHttpPost(url, data, this.headers);
  }

  private putEventData(data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/UpdateEvent`;
    return this.commonHttpPut(url, data, this.headers);
  }

  private deleteEventData(eventId) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/DeleteEvent/${eventId}`;
    return this.commonHttpDelete(url, null, this.headers);
  }

  private cancelEventData(eventId) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/CancelEvent/${eventId}`;
    return this.commonHttpPost(url, null, this.headers);
  }

  private getAllTopicsData() {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/topics`;
    return this.commonHttpGet(url, this.headers);
  }

  private postTopicData(name) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/CreateTopic/${name}`;
    return this.commonHttpPost(url, null, this.headers);
  }

  private deleteTopicData(topicId) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/DeleteTopic/${topicId}`;
    return this.commonHttpDelete(url, null, this.headers);
  }

  private sendCampaignData(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/SendCampaign/${id}`;
    return this.commonHttpGet(url, this.headers);
  }

  private accreditParticipant(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/accredit/${id}`;
    return this.commonHttpGet(url, this.headers);
  }

  private getParticipantsData(eventId) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/` + eventId + `/participants`;
    return this.commonHttpGet(url, this.headers);
  }

  private sendCertificateData(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/certificates/${id}`;
    return this.commonHttpGet(url, this.headers);
  }

  private registerToEventData(participant) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/events/registerToEvent`;
    return this.http.post(url, participant, { headers: this.headers, observe: 'events' });
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
