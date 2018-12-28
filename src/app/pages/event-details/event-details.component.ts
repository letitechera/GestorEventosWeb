import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsApiService } from '@services/events-api/events-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit, OnDestroy {
  id: number;
  private sub: any;
  public loading: boolean;
  public event: object;

  constructor(private route: ActivatedRoute, private eventsApi: EventsApiService, private auth: AuthApiService,
    private router: Router) { }

  ngOnInit() {
    this.auth.checkSession();

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.initData(this.id);
      // In a real app: dispatch action to load the details here.
    });
  }

  public goBack(){
    this.router.navigateByUrl('events');
  }

  public initData(id) {
    this.getEventDetails(id).then((data: any) => {
      if (data != null) {
        this.event = data;
        console.log(event)
      }
    }, (err) => {
      console.log(err);
    });
  }

  private getEventDetails(id): Promise<any> {
    this.loading = true;
    return new Promise<any>((resolve, reject) => {
      this.eventsApi.getEventDetails(id)
        .pipe(map((result: any) => {
          if (result == null) {
            return null;
          }
          console.log(result);
          return result;
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
