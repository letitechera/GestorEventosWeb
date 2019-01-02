import { Routes } from '@angular/router';
import { LoginComponent } from '@pages/login/login.component';
import { CallbackComponent } from '@pages/callback/callback.component';
import { EventsComponent } from '@pages/events/events.component';
import { EventDetailsComponent } from '@pages/event-details/event-details.component';
import { ParticipantsComponent } from '@pages/participants/participants.component';
import { AccreditationComponent } from '@pages/accreditation/accreditation.component';

export const ROUTES: Routes = [
    { path: '', redirectTo: 'callback', pathMatch: 'full' },
    { path: 'callback', component: CallbackComponent },
    { path: 'login', component: LoginComponent },
    { path: 'events', component: EventsComponent },
    { path: 'events/:id', component: EventDetailsComponent },
    { path: 'participants', component: ParticipantsComponent },
    { path: 'accreditation', component: AccreditationComponent },
  ];
