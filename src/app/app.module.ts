import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ROUTES } from './app.routing';

import { AuthApiService } from './services/auth-api/auth-api.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { onSameUrlNavigation: 'reload' }),
  ],
  providers: [
    AuthApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
