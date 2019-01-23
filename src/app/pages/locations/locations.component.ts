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
    this.loading = true;
    this.locationsApi.getAllLocations().then((data: any[]) => {
      this.loading = false;
      this.locations = data;
      console.log(data);
      if (this.locations) {
        this.initDataSource();
      }
    }, (err) => {
      console.log(err);
      this.loading = false;
    });
  }

  public removeLocation(id) {
    this.locationsApi.deleteLocation(id).then((data: any[]) => {
      this.initData();
    }, (err) => {
      console.log(err);
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
