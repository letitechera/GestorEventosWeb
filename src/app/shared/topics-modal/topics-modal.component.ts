import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { EventsApiService } from '@services/events-api/events-api.service';
import { TopicData } from '@models/event-data';
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
    this.loading = true;
    this.createForm();
  }

  private InitTopics(){
    this.eventsApi.getAllTopics().then((data: any[]) => {
      this.loading = false;
      this.topics = data;
    }, (err) => {
      console.log(err);
      this.loading = false;
    });
  }

  private createForm() {
    this.topicsForm = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
    this.submitted = false;
  }

  public removeTopic(topicId) {
    this.eventsApi.deleteTopic(topicId).then((data: any[]) => {
      console.log(data);
      this.InitTopics();
    }, (err) => {
      console.log(err);
    });
  }

  public addTopic() {
    this.submitted = true;
    if (!this.topicsForm.valid) {
      this.loading = false;
      return;
    }
    const name = this.topicsForm.get('name').value;
    this.eventsApi.postTopic(name).then((data: any[]) => {
      console.log(data);
      this.InitTopics();
    }, (err) => {
      console.log(err);
    });
  }

  public close(): void {
    this.dialogRef.close();
  }

}
