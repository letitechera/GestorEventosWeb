import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UsersApiService } from '@services/users-api/users-api.service';
import { RoleData } from '@models/event-data';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { Router } from '@angular/router';
import {MAT_DIALOG_DATA} from '@angular/material'
import { NotifierService } from 'angular-notifier';
  
@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.scss']
})
export class RolesModalComponent implements OnInit {
  public roles: RoleData[];
  public selectedRole: string;
  public loading: boolean;
  public submitted: boolean;

  constructor(public dialogRef: MatDialogRef<RolesModalComponent>, private usersApi: UsersApiService,
    private auth: AuthApiService, private router: Router, private dialog: MatDialog,
     @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService) { }

  ngOnInit() {
    this.auth.checkSession();
    this.loading = true;
    this.InitRoles();
  }

  public assignRole() {
    this.loading = true;
    let rolEnum = ''
    if(this.selectedRole == null || this.selectedRole == ''){
      return;
    }
    switch(this.selectedRole){
      case 'Participante':{
        rolEnum = 'Role_Participant'
        break;
      };
      case 'Acreditador':{
        rolEnum = 'Role_Creditor'
        break;
      };
      case 'Organizador':{
        rolEnum = 'Role_Organizer'
        break;
      };
      case 'Administrador':{
        rolEnum = 'Role_Admin'
        break;
      };
    }
    this.usersApi.assignRole(this.data.selectedUser, rolEnum).then((data: any[]) => {
      this.loading = false;
      this.notifier.notify( 'success', 'Rol Asignado con éxito' );
      this.close();
    }, (err) => {
      this.notifier.notify( 'error', 'Ups.. Ha ocurrido un error' );
      console.log(err);
    });
  }

  private InitRoles() {
    this.loading = true;
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
