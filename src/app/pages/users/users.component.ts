import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { UserData } from '@models/user-data';
import { UsersApiService } from '@services/users-api/users-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RolesModalComponent } from '../../shared/roles-modal/roles-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sorter: MatSort;
  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<UserData>;
  public users: UserData[];
  public loading: boolean;

  constructor(private route: ActivatedRoute, private usersApi: UsersApiService, private auth: AuthApiService, private router: Router,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.auth.checkSession();
    this.setDisplayColumns();
    this.initData();
  }

  private setDisplayColumns() {
    this.displayedColumns = [
      'FirstName',
      'LastName',
      'Email',
      'Controls'
    ];
  }

  private initData() {
    this.loading = true;
    this.usersApi.getUsers().then((data: any[]) => {
      this.loading = false;
      this.users = data;
      if (this.users) {
        this.initDataSource();
      }
    }, (err) => {
      this.loading = false;
      console.log(err);
    });
  }

  private initDataSource() {
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.paginator = this.paginator;
    this.sorter.start = 'desc';
    this.dataSource.sort = this.sorter;
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openRolesDialog(userId): void {
    const dialogRef = this.dialog.open(RolesModalComponent, {
      height: '230px',
      width: '350px',
      hasBackdrop: true,
      data: { selectedUser: userId }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
