import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { EventData } from '@models/event-data';
import { EventsApiService } from '@services/events-api/events-api.service';
import { map } from 'rxjs/operators';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { Router } from '@angular/router';
import { DateService } from '@services/date/date.service';
import { TopicsModalComponent } from '@shared/topics-modal/topics-modal.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sorter: MatSort;
  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<EventData>;
  public events: EventData[];
  public loading: boolean;

  constructor(private eventsApi: EventsApiService, private auth: AuthApiService, private route: Router,
    private dateService: DateService, private dialog: MatDialog) { }

  ngOnInit() {
    this.auth.checkSession();

    this.setDisplayColumns();
    this.initData();
  }

  public getEvent(row) {
    this.route.navigate(['/events', row.EventId]);
  }

  public showDate(date) {
    return this.dateService.GetShortDate(date);
  }

  public showTime(date) {
    return this.dateService.GetTime(date);
  }

  private setDisplayColumns() {
    this.displayedColumns = [
      'Image',
      'Name',
      'Description',
      'Location',
      'StartDate',
      'FinishDate',
      'StartTime',
      'FinishTime',
      'Topic',
      'Options'
    ];
  }

  private initData() {
    this.getAllEvents().then((data: any[]) => {
      this.events = data;
      if (this.events) {
        this.initDataSource();
      }
    }, (err) => {
      console.log(err);
    });
  }

  private getAllEvents(): Promise<any> {
    this.loading = true;
    let userId = this.auth.getUserId();
    return new Promise<any>((resolve, reject) => {
      this.eventsApi.getAllEventsByUser(userId)
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
              EndDate: new Date(result.finishDate),
              Image: result.image != null ? result.image : '',
              Description: result.description,
              Location: result.location,
              Topic: result.topic,
              CreatedById: result.createdById,
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

  private initDataSource() {
    this.dataSource = new MatTableDataSource(this.events);
    this.dataSource.paginator = this.paginator;
    this.sorter.start = 'desc';
    this.dataSource.sort = this.sorter;
  }

  openTopicsDialog(): void {
    const dialogRef = this.dialog.open(TopicsModalComponent, {
      height: '400px',
      width: '350px',
      // data: {name: this.name}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
