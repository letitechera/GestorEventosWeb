import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthApiService } from '@services/auth-api/auth-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public loginError: boolean;
  public loading: boolean;

  constructor(private service: AuthApiService, private router: Router, private formBuilder: FormBuilder) {
    this.loginError = false;
    this.loading = false;
  }

  ngOnInit() {
    this.service.logout();
    this.createForm();
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    if (!this.loginForm.valid) {
      this.loading = false;
      return;
    }
    this.loginError = false;
    this.loading = true;
    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;
    this.service.login(username, password).subscribe((data) => {
      console.log(data);
      this.service.setSession(data);
      this.loading = false;
      this.router.navigateByUrl('events');
    },
    (err) => {
      console.log(err);
      this.loginError = true;
      this.loading = false;
    });
  }

  public navigateTo(page){
    this.router.navigateByUrl(page);
  }
}
