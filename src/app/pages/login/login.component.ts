import { Component, OnInit } from '@angular/core';
import { AuthApiService } from '../../services/auth-api/auth-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(private service: AuthApiService) { }

  ngOnInit() {
  }

  login(){
    this.service.login(this.username, this.password).subscribe((data) => {
      console.log(data);
    },
    (err) => {
      console.log(err);
    });
  }

}
