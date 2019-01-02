import { Component, OnInit } from '@angular/core';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthApiService, private router: Router) {
  }

  ngOnInit() {
  }

  public navigateTo(page){
    this.router.navigateByUrl(page);
  }

  public logout() {
    this.authService.logout();
  }
}
