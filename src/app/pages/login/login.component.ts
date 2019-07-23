import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public loginError: boolean;
  public submitted: boolean;
  public loading: boolean;

  constructor(private service: AuthApiService, private router: Router, private formBuilder: FormBuilder,
    private notifier: NotifierService) {
    this.loginError = false;
    this.loading = false;
  }

  ngOnInit() {
    this.service.logout();
    this.submitted = false;
    this.createForm();
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    this.submitted = true;
    if (!this.loginForm.valid) {
      this.loading = false;
      return;
    }
    this.loginError = false;
    this.loading = true;
    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;
    this.service.login(username, password).subscribe((data) => {
      this.submitted = false;
      this.loading = false;
      debugger;
      this.service.setSession(data);
      let rol = this.service.getRole();
      if (rol == null || rol == 'null') {
        this.notifier.notify('warning', 'Para iniciar sesión debes esperar a que un administrador te asigne un Rol');
      } else {
        this.router.navigateByUrl('events');
      }
    },
      (err) => {
        console.log(err);
        this.loginError = true;
        this.loading = false;
      });
  }

  public navigateTo(page) {
    this.router.navigateByUrl(page);
  }
}
