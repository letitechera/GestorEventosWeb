import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { EventData } from '@models/event-data';
import { EventsApiService } from '@services/events-api/events-api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sorter: MatSort;
  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<EventData>;
  public events: EventData[];
  public loading: boolean;

  constructor(private eventsApi: EventsApiService) { }

  ngOnInit() {
    this.setDisplayColumns();
    this.initData();
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
      'Topic'
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
    return new Promise<any>((resolve, reject) => {
      this.eventsApi.getAllEvents()
        .pipe(map((results: any[]) => {
          const data = [];
          if (!results) {
            return data;
          }
          results.forEach((result) => {
            data.push({
              EventId: result.id,
              Name: result.name,
              StartDate: result.startDate,
              EndDate: result.endDate,
              Image: result.image != null ? result.image : '',
              Description: result.description,
              LocationId: result.locationId,
              AppUserId: result.appUserId,
              EventTopicId: result.eventTopicId,
              Canceled: result.canceled,
              Schedules: result.schedules,
              Participants: result.participants,
              Location: result.location,
              EventTopic: result.eventTopic,
              PrettyStartDate: result.prettyStartDate,
              PrettyShortStartDate: result.prettyShortStartDate,
              PrettyEndDate: result.prettyEndDate,
              PrettyShortEndDate: result.prettyShortEndDate,
              PrettyStartTime: result.prettyStartTime,
              PrettyEndTime: result.prettyEndTime,
              CreatedByName: result.createdByName,
              CreatedById: result.createdById,
              ModifiedByName: result.modifiedByName,
              ModifiedById: result.modifiedById,
              PrettyCreatedDate: result.prettyCreatedDate,
              PrettyModifiedDate: result.prettyModifiedDate,
            });
          });
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

}
