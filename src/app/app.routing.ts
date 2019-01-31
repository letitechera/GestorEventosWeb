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
import { EventManageComponent } from '@pages/event-manage/event-manage.component';
import { ScheduleComponent } from '@pages/schedule/schedule.component';
import { PublicEventsComponent } from '@pages/public/public-events/public-events.component';
import { PublicEventComponent } from '@pages/public/public-event/public-event.component';

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
    { path: 'events/manage/:id', component: EventManageComponent },
    { path: 'schedule/:id', component: ScheduleComponent },
    { path: 'contacts', component: InterestedComponent },
    { path: 'accreditation', component: AccreditationComponent },
    { path: 'locations', component: LocationsComponent },
    { path: 'public/events', component: PublicEventsComponent },
    { path: 'public/events/:id', component: PublicEventComponent }
  ];
