import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountApiService } from '@services/account-api/account-api.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public forgotForm: FormGroup;
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
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required]],
    });
  }

  forgotPassword() {
    this.error = false;
    this.loading = true;
    const email = this.forgotForm.get('email').value;
    this.service.forgotPassword(email).subscribe((data) => {
      this.loading = false;
      this.notifier.notify( 'success', 'Revise su casilla de correo' );
      this.router.navigateByUrl('login');
    },
    (err) => {
      console.log(err);
      this.error = true;
      this.loading = false;
    });
  }

  public goBack() {
    this.router.navigateByUrl('login');
  }
}
