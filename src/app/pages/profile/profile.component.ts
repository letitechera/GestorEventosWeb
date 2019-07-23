import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersApiService } from '@services/users-api/users-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { map } from 'rxjs/operators';
import { AccountData } from '@models/account-data';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public accountForm: FormGroup;
  public account: AccountData;
  private sub: any;
  public loading: boolean;
  public loadingBtn: boolean;
  public submitted: boolean;

  constructor(private route: ActivatedRoute, private usersApi: UsersApiService, private auth: AuthApiService,
    private router: Router, private formBuilder: FormBuilder, private notifier: NotifierService) { }

  ngOnInit() {
    this.auth.checkSession();
    this.submitted = false;
    this.sub = this.route.params.subscribe(params => {
      this.getAccountData();
    });
  }

  private initAccountForm() {
    this.accountForm = this.formBuilder.group({
      Id: [this.account.UserId, [Validators.required]],
      FirstName: [this.account.FirstName, [Validators.required]],
      LastName: [this.account.LastName, [Validators.required]],
      Email: [this.account.Email, [Validators.required]],
      Phone: [this.account.Phone],
      CellPhone: [this.account.CellPhone],
      Job: [this.account.Job],
      Organization: [this.account.Organization],
      Address1: [this.account.Address1],
      Address2: [this.account.Address2],
      City: [this.account.City],
      Country: [this.account.Country],
    });
    this.loading = false;
  }

  public updateAccount() {
    this.submitted = true;
    if (!this.accountForm.valid) {
      return;
    }
    this.loadingBtn = true;
    this.editAccount();
  }

  private editAccount() {
    this.setAccountObject();
    this.usersApi.putAccount(this.account).then((data: any[]) => {
      this.notifier.notify( 'success', 'Tu perfil se editó con éxito!' );
      this.loadingBtn = false;
      this.goBack();
    }, (err) => {
      this.notifier.notify('error', 'Ups.. Ha ocurrido un error');
      console.log(err);
    });
  }

  private setAccountObject() {
    this.account.UserId = this.account.UserId;
    this.account.FirstName = this.accountForm.get('FirstName').value;
    this.account.LastName = this.accountForm.get('LastName').value;
    this.account.Email = this.accountForm.get('Email').value;
    this.account.Phone = this.accountForm.get('Phone').value;
    this.account.CellPhone = this.accountForm.get('CellPhone').value;
    this.account.Job = this.accountForm.get('Job').value;
    this.account.Organization = this.accountForm.get('Organization').value;
    this.account.Address1 = this.accountForm.get('Address1').value;
    this.account.Address2 = this.accountForm.get('Address2').value;
    this.account.City = this.accountForm.get('City').value;
    this.account.Country = this.accountForm.get('Country').value;
  }

  public goBack() {
    this.router.navigateByUrl('events');
  }

  private getAccountData() {
    this.loading = true;
    this.usersApi.getUserProfile().then((data: any) => {
      if (data != null) {
        this.account = {
          UserId: data.userId,
          FirstName: data.firstName,
          LastName: data.lastName,
          Email: data.email,
          Phone: data.phone,
          CellPhone: data.cellPhone,
          Job: data.job,
          Organization: data.organization,
          Address1: data.address1,
          Address2: data.address2,
          City: data.city,
          Country: data.country
        };
        this.initAccountForm();
        this.loading = false;
      }
    }, (err) => {
      console.log(err);
      this.loading = false;
    });
  }

  public navigateTo(page) {
    this.router.navigateByUrl(page);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}