import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from '@services/auth-api/auth-api.service'

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(private router: Router, private authservice: AuthApiService) { 
  }

  ngOnInit() {
    if(this.authservice.isLogged()){
      this.router.navigateByUrl('home');
    }
    else{
      this.router.navigateByUrl('login');
    }
  }

}
