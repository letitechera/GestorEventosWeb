import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountApiService } from '@services/account-api/account-api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public resetForm: FormGroup;
  public error: boolean;
  public loading: boolean;

  constructor(private service: AccountApiService, private router: Router, private formBuilder: FormBuilder) {
    this.error = false;
    this.loading = false;
  }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.resetForm = this.formBuilder.group({
      code: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  resetPassword() {
    this.error = false;
    this.loading = true;

    const code = this.resetForm.get('code').value;
    const password = this.resetForm.get('password').value;

    this.service.resetPassword(code, password).subscribe((data) => {
      console.log(data);
      this.loading = false;
      this.router.navigateByUrl('login');
    },
    (err) => {
      console.log(err);
      this.error = true;
      this.loading = false;
    });
  }
}
