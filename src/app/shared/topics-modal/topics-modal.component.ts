import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { EventsApiService } from '@services/events-api/events-api.service';
import { TopicData } from '@models/event-data';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-topics-modal',
  templateUrl: './topics-modal.component.html',
  styleUrls: ['./topics-modal.component.scss']
})
export class TopicsModalComponent implements OnInit {

  public topics: TopicData[];
  public loading: boolean;
  public name: string;

  constructor(public dialogRef: MatDialogRef<TopicsModalComponent>, private eventsApi: EventsApiService) { }

  ngOnInit() {
    this.getAllTopics().then((data: any[]) => {
      this.topics = data;
    }, (err) => {
      console.log(err);
    });
  }

  private getAllTopics(): Promise<any> {
    this.loading = true;
    return new Promise<any>((resolve, reject) => {
      this.eventsApi.getAllTopics()
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
          console.log(data)
          return data;
        })).subscribe((data: any[]) => {
          resolve(data);
          this.loading = false;
        },
          (err) => {
            reject([]);
            this.loading = false;
          });
    });
  }

  public addTopic() {
    if (this.name != null && this.name != "") {
      this.postTopic().then((data: any[]) => {
        console.log(data);

      }, (err) => {
        console.log(err);
      });
    }
  }

  private postTopic(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.eventsApi.postTopic(this.name).subscribe((data) => {
        console.log(data);
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

}
