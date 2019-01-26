import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersApiService } from '@services/users-api/users-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private sub: any;
  public loading: boolean;
  public user: object;

  constructor(private route: ActivatedRoute, private usersApi: UsersApiService, private auth: AuthApiService,
    private router: Router) { }

  ngOnInit() {
    this.auth.checkSession();

    this.sub = this.route.params.subscribe(params => {
      this.initData();
      // In a real app: dispatch action to load the details here.
    });
  }

  public goBack(){
    this.router.navigateByUrl('events');
  }

  public initData() {
    this.getUserProfile().then((data: any) => {
      if (data != null) {
        this.user = data;
        console.log(event)
      }
    }, (err) => {
      console.log(err);
    });
  }

  private getUserProfile(): Promise<any> {
    this.loading = true;
    return new Promise<any>((resolve, reject) => {
      this.usersApi.getUserProfile()
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