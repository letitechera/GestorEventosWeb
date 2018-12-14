import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CallbackComponent } from './pages/callback/callback.component';


export const ROUTES: Routes = [
    { path: '', redirectTo: 'callback', pathMatch: 'full' },
    { path: 'callback', component: CallbackComponent },
    { path: 'login', component: LoginComponent },
  ];
