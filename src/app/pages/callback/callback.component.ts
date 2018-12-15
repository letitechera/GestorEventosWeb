import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthApiService } from 'src/app/services/auth-api/auth-api.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute, private service: AuthApiService) { }

  ngOnInit() {
  }
}

