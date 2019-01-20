import { Routes } from '@angular/router';
import { LoginComponent } from '@pages/login/login.component';
import { RegisterComponent } from '@pages/register/register.component';
import { ForgotPasswordComponent } from '@pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '@pages/reset-password/reset-password.component';
import { ProfileComponent } from '@pages/profile/profile.component';
import { CallbackComponent } from '@pages/callback/callback.component';
import { EventsComponent } from '@pages/events/events.component';
import { EventDetailsComponent } from '@pages/event-details/event-details.component';
import { InterestedComponent } from '@pages/interested/interested.component';
import { AccreditationComponent } from '@pages/accreditation/accreditation.component';
import { LocationsComponent } from '@pages/locations/locations.component';

export const ROUTES: Routes = [
    { path: '', redirectTo: 'callback', pathMatch: 'full' },
    { path: 'callback', component: CallbackComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'events', component: EventsComponent },
    { path: 'events/:id', component: EventDetailsComponent },
    { path: 'contacts', component: InterestedComponent },
    { path: 'accreditation', component: AccreditationComponent },
    { path: 'locations', component: LocationsComponent },
  ];
