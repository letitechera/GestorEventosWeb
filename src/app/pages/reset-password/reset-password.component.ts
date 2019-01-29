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
   
    if(confirmPassword != newPassword){
      this.loading = false;
      this.error = true;
      return;
    }

    this.service.resetPassword(currentPassword, newPassword).subscribe((data) => {
      console.log(data);
      this.loading = false;
      this.router.navigateByUrl('events');
    },
    (err) => {
      console.log(err);
      this.error = true;
      this.loading = false;
    });
  }

  public navigateTo(page){
    this.router.navigateByUrl(page);
  }
}
