import { Component, OnInit } from '@angular/core';
import { AuthApiService } from '@services/auth-api/auth-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthApiService) {
  }

  ngOnInit() {
  }

  public logout() {
    this.authService.logout();
  }
}
