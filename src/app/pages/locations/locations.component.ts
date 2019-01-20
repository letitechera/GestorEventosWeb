import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { LocationData } from '@models/location-data';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { LocationsApiService } from '@services/locations-api/locations-api.service';
import { LocationsModalComponent } from '@shared/locations-modal/locations-modal.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sorter: MatSort;
  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<LocationData>;
  public locations: LocationData[];
  public loading: boolean;

  constructor(private locationsApi: LocationsApiService, private auth: AuthApiService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.auth.checkSession();
    this.setDisplayColumns();
    this.initData();
  }

  public openDialog(element) {
    this.auth.checkSession();
    const dialogRef = this.dialog.open(LocationsModalComponent, {
      height: '430px',
      width: '400px',
      data: element,
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'changed') {
        this.initData();
      }
    });
  }

  private setDisplayColumns() {
    this.displayedColumns = [
      'Name',
      'Capacity',
      'Address',
      'Location',
      'Options'
    ];
  }

  private initData() {
    this.getAllLocations().then((data: any[]) => {
      this.locations = data;
      console.log(data);
      if (this.locations) {
        this.initDataSource();
      }
    }, (err) => {
      console.log(err);
    });
  }

  private getAllLocations(): Promise<any> {
    this.loading = true;
    return new Promise<any>((resolve, reject) => {
      this.locationsApi.getAllLocations()
        .pipe(map((results: any[]) => {
          const data = [];
          if (!results) {
            return data;
          }
          results.forEach((result) => {
            data.push({
              Id: result.id,
              Name: result.name,
              Address1: result.address1,
              Address2: result.address2,
              City: result.city,
              Country: result.country,
              Capacity: result.capacity,
              Latitude: result.latitude,
              Longitude: result.longitude,
            });
          });
          console.log(data);
          return data;
        })).subscribe((data: any[]) => {
          resolve(data);
          this.loading = false;
          return data;
        },
          (err) => {
            reject([]);
            this.loading = false;
          });
    });
  }

  public removeLocation(id) {
    this.deleteLocation(id).then((data: any[]) => {
      this.initData();
    }, (err) => {
      console.log(err);
    });
  }

  private deleteLocation(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.locationsApi.deleteLocation(id).subscribe((data) => {
        console.log(data);
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  private initDataSource() {
    this.dataSource = new MatTableDataSource(this.locations);
    this.dataSource.paginator = this.paginator;
    this.sorter.start = 'desc';
    this.dataSource.sort = this.sorter;
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
