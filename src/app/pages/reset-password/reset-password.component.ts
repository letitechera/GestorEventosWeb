import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  private id: string;
  private code: string;
  private sub: any;

  constructor(private route: ActivatedRoute, private service: AccountApiService, private router: Router, private formBuilder: FormBuilder) {
    this.error = false;
    this.loading = false;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['userID'];
      this.code = params['code'];
    });

    this.createForm();
  }

  private createForm() {
    this.resetForm = this.formBuilder.group({
      code: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  resetPassword() {
    this.error = false;
    this.loading = true;

    const password = this.resetForm.get('password').value;
    const confirmPassword = this.resetForm.get('confirmPassword').value;

    if (confirmPassword != password)
      return;

    this.service.resetPassword(this.id, this.code, password).subscribe((data) => {
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
