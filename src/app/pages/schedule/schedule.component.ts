import { Component, OnInit } from '@angular/core';
import { Schedule } from '@models/schedule-data';
import { SchedulesApiService } from '@services/schedules-api/schedules-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DateService } from '@services/date/date.service';
import { MatDialog } from '@angular/material';
import { SchedulesModalComponent } from '@shared/schedules-modal/schedules-modal.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  id: number;
  private sub: any;
  public schedules: Schedule[];
  public loading: boolean;

  constructor(private schedulesApi: SchedulesApiService, private auth: AuthApiService, private router: Router,
    private route: ActivatedRoute, private dateService: DateService, private dialog: MatDialog) { }

  ngOnInit() {
    this.auth.checkSession();
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.initSchedules()
    });
  }

  public initSchedules() {
    this.loading = true;
    this.schedulesApi.getSchedulesByEvent(this.id).then((data: any[]) => {
      this.loading = false;
      this.schedules = data;
      if (this.schedules) {
        // this.initDataSource();
      }
    }, (err) => {
      this.loading = false;
      console.log(err);
    });
  }

  public openScheduleDialog(element) {
    const dialogRef = this.dialog.open(SchedulesModalComponent, {
      height: '220px',
      width: '350px',
      hasBackdrop: true,
      data: {
        eventId: this.id,
        schedule: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'changed') {
        this.initSchedules();
      }
    });
  }

}
