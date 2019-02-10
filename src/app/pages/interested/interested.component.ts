import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { map } from 'rxjs/operators';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { AttendantsApiService } from '@services/attendants-api/attendants-api.service';
import { MatDialog } from '@angular/material';
import { Interested } from '@models/interested-data';
import { AttendantsModalComponent } from '@shared/attendants-modal/attendants-modal.component';
import { ImportModalComponent } from '@shared/import-modal/import-modal.component';

@Component({
  selector: 'app-interested',
  templateUrl: './interested.component.html',
  styleUrls: ['./interested.component.scss']
})
export class InterestedComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sorter: MatSort;
  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<Interested>;
  public interestedList: Interested[];
  public loading: boolean;

  constructor(private attendantsApi: AttendantsApiService, private auth: AuthApiService, 
    private dialog: MatDialog) { }

  ngOnInit() {
    this.auth.checkSession();
    this.setDisplayColumns();
    this.initData();
  }

  public openDialog(element){
    const dialogRef = this.dialog.open(AttendantsModalComponent, {
      height: '360px',
      width: '290px',
      data: element,
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result=='changed'){
        this.initData();
      }
    });
  }
  
  public openImportDialog() {
    this.auth.checkSession();
    const dialogRef = this.dialog.open(ImportModalComponent, {
      height: '400px',
      width: '400px',
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'changed') {
        this.initData();
      }
    });
  }

  private setDisplayColumns() {
    this.displayedColumns = [
      'FirstName',
      'LastName',
      'Email',
      'Options'
    ];
  }

  private initData() {
    this.getAllAttendants().then((data: any[]) => {
      this.interestedList = data;
      if (this.interestedList) {
        this.initDataSource();
      }
    }, (err) => {
      console.log(err);
    });
  }

  private getAllAttendants(): Promise<any> {
    this.loading = true;
    return new Promise<any>((resolve, reject) => {
      this.attendantsApi.getAllAttendants()
        .pipe(map((results: any[]) => {
          const data = [];
          if (!results) {
            return data;
          }
          results.forEach((result) => {
            data.push({
              Id: result.id,
              FirstName: result.firstName,
              LastName: result.lastName,
              Email: result.email,
            });
          });
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

  public removeInterested(id) {
    this.deleteInterested(id).then((data: any[]) => {
      this.initData();
    }, (err) => {
      console.log(err);
    });
  }

  private deleteInterested(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.attendantsApi.deleteAttendant(id).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  private initDataSource() {
    this.dataSource = new MatTableDataSource(this.interestedList);
    this.dataSource.paginator = this.paginator;
    this.sorter.start = 'desc';
    this.dataSource.sort = this.sorter;
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
