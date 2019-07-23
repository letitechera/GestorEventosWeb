import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountApiService } from '@services/account-api/account-api.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;
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
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    if (!this.registerForm.valid) {
      this.loading = false;
      return;
    }
    this.error = false;
    this.loading = true;
    const firstName = this.registerForm.get('firstName').value;
    const lastName = this.registerForm.get('lastName').value;
    const email = this.registerForm.get('email').value;
    const password = this.registerForm.get('password').value;

    this.service.register(firstName, lastName, email, password).subscribe((data) => {
      this.loading = false;
      this.notifier.notify( 'success', 'Registro exitoso!' );
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
