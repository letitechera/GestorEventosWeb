import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { EventsApiService } from '@services/events-api/events-api.service';
import { TopicData } from '@models/event-data';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthApiService } from '@services/auth-api/auth-api.service';

@Component({
  selector: 'app-topics-modal',
  templateUrl: './topics-modal.component.html',
  styleUrls: ['./topics-modal.component.scss']
})
export class TopicsModalComponent implements OnInit {
  public topics: TopicData[];
  public topicsForm: FormGroup;
  public loading: boolean;
  public submitted: boolean;

  constructor(public dialogRef: MatDialogRef<TopicsModalComponent>, private eventsApi: EventsApiService, private auth: AuthApiService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.auth.checkSession();
    this.getAllTopics().then((data: any[]) => {
      this.topics = data;
    }, (err) => {
      console.log(err);
    });
    this.createForm();
  }

  private createForm() {
    this.topicsForm = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
    this.submitted = false;
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
          console.log(data);
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

  public removeTopic(topicId) {
    this.deleteTopic(topicId).then((data: any[]) => {
      console.log(data);
      this.getAllTopics().then((list: any[]) => {
        this.topics = list;
      }, (err) => {
        console.log(err);
      });
    }, (err) => {
      console.log(err);
    });
  }

  private deleteTopic(topicId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.eventsApi.deleteTopic(topicId).subscribe((data) => {
        console.log(data);
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public addTopic() {
    this.submitted = true;
    if (!this.topicsForm.valid) {
      this.loading = false;
      return;
    }
    const name = this.topicsForm.get('name').value;
    this.postTopic(name).then((data: any[]) => {
      console.log(data);
      this.getAllTopics().then((list: any[]) => {
        this.topics = list;
        this.createForm();
      }, (err) => {
        console.log(err);
      });
    }, (err) => {
      console.log(err);
    });
  }

  private postTopic(name): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.eventsApi.postTopic(name).subscribe((data) => {
        console.log(data);
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  public close(): void {
    this.dialogRef.close();
  }

}
