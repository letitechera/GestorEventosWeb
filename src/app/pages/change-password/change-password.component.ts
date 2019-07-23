import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountApiService } from '@services/account-api/account-api.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public resetForm: FormGroup;
  public error: boolean;
  public loading: boolean;

  constructor(private service: AccountApiService, private router: Router, private formBuilder: FormBuilder,
    private notifier: NotifierService) {
    this.error = false;
    this.loading = false;
  }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.resetForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  resetPassword() {
    this.error = false;
    this.loading = true;

    const currentPassword = this.resetForm.get('currentPassword').value;
    const newPassword = this.resetForm.get('newPassword').value;
    const confirmPassword = this.resetForm.get('confirmPassword').value;

    if (confirmPassword != newPassword) {
      this.loading = false;
      this.error = true;
      return;
    }

    this.service.changePassword(currentPassword, newPassword).subscribe((data) => {
      this.loading = false;
      this.notifier.notify('success', 'La contraseña se cambió con éxito');
      this.router.navigateByUrl('events');
    },
      (err) => {
        console.log(err);
        this.error = true;
        this.loading = false;
      });
  }

  public navigateTo(page) {
    this.router.navigateByUrl(page);
  }

  public goBack() {
    this.router.navigateByUrl('events');
  }
}
