import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UsersApiService } from '@services/users-api/users-api.service';
import { RoleData } from '@models/event-data';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { Router } from '@angular/router';
import {MAT_DIALOG_DATA} from '@angular/material'
  
@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.scss']
})
export class RolesModalComponent implements OnInit {
  public roles: RoleData[];
  public selectedRole: RoleData;
  public loading: boolean;
  public submitted: boolean;

  constructor(public dialogRef: MatDialogRef<RolesModalComponent>, private usersApi: UsersApiService,
    private auth: AuthApiService, private router: Router, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.auth.checkSession();
    this.loading = true;
    this.InitRoles();
  }

  public assignRole() {
    this.usersApi.assignRole(this.data.selectedUser, this.selectedRole).then((data: any[]) => {
      this.close();
    }, (err) => {
      console.log(err);
    });
  }

  private InitRoles() {
    this.usersApi.getAllRoles().then((data: any[]) => {
      this.loading = false;
      this.roles = data;
    }, (err) => {
      console.log(err);
      this.loading = false;
    });
  }

  public close(): void {
    this.dialogRef.close();
  }

}
