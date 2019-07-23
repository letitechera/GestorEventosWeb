import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {

  constructor(private http: HttpClient) { }
  private headers: HttpHeaders;

  public getUsers(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getUsersData()
        .pipe(map((results: any[]) => {
          const data = [];
          if (!results) {
            return data;
          }
          results.forEach((result) => {
            data.push({
              UserId: result.userId,
              FirstName: result.firstName,
              LastName: result.lastName,
              Email: result.email,
            });
          });
          return data;
        })).subscribe((data: any[]) => {
          resolve(data);
        },
          (err) => {
            reject([]);
          });
    });
  }

  public getAllRoles(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getAllRolesData()
        .pipe(map((results: any[]) => {
          const data = [];
          if (!results) {
            return data;
          }
          results.forEach((result) => {
            let cleanName = '';
            switch(result.name){
              case 'Role_Creditor':{
                cleanName = 'Acreditador'
                break;
              };
              case 'Role_Organizer':{
                cleanName = 'Organizador'
                break;
              };
              case 'Role_Admin':{
                cleanName = 'Administrador'
                break;
              };
            }
            if(result.name != 'Role_Participant'){
              data.push({
                RoleId: result.id,
                Name: cleanName,
              });
            }
          });
          return data;
        })).subscribe((data: any[]) => {
          resolve(data);
        },
          (err) => {
            reject([]);
          });
    });
  }

  public getUserProfile(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      var id = this.getUserId();
      this.getUserById(id)
        .pipe(map((result: any) => {
          if (result == null) {
            return null;
          }
          return result;
        })).subscribe((data: any[]) => {
          resolve(data);
        },
          (err) => {
            reject([]);
          });
    });
  }
  
  public assignRole(userId, role): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.assignRoleData(userId, role).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  private assignRoleData(userId, role) {
    this.setDefaultHeaders();
    var data = {
      userId: userId,
      role: role
    };
    const url = `${environment.webApiUrl}/users/assign-role`;
    return this.commonHttpPost(url, data, this.headers);
  }

  private getUsersData() {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/users`;
    return this.commonHttpGet(url, this.headers);
  }

  private getAllRolesData() {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/users/roles`;
    return this.commonHttpGet(url, this.headers);
  }

  private getUserById(id) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/users/${id}`;
    return this.commonHttpGet(url, this.headers);
  }

  public putAccount(event): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.putAccountData(event).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  private putAccountData(data) {
    this.setDefaultHeaders();
    const url = `${environment.webApiUrl}/account/edit`;
    return this.commonHttpPut(url, data, this.headers);
  }

  private setDefaultHeaders() {
    const accessToken = this.getAccessToken();
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });
  }

  private getAccessToken() {
    return localStorage.getItem('access_token');
  }

  private getUserId() {
    return localStorage.getItem('user_id');
  }

  private commonHttpPost(url: string, data: any, headers: HttpHeaders) {
    return this.http.post(url, data, { headers: headers });
  }

  private commonHttpGet(url: string, headers: HttpHeaders) {
    return this.http.get(url, { headers: headers });
  }

  private commonHttpPut(url: string, data: any, headers: HttpHeaders) {
    return this.http.put(url, data, { headers: headers });
  }
}
