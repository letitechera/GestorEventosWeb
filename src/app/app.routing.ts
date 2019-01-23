import { Routes } from '@angular/router';
import { LoginComponent } from '@pages/login/login.component';
import { CallbackComponent } from '@pages/callback/callback.component';
import { EventsComponent } from '@pages/events/events.component';
import { EventDetailsComponent } from '@pages/event-details/event-details.component';
import { InterestedComponent } from '@pages/interested/interested.component';
import { AccreditationComponent } from '@pages/accreditation/accreditation.component';
import { LocationsComponent } from '@pages/locations/locations.component';
import { EventManageComponent } from '@pages/event-manage/event-manage.component';

export const ROUTES: Routes = [
    { path: '', redirectTo: 'callback', pathMatch: 'full' },
    { path: 'callback', component: CallbackComponent },
    { path: 'login', component: LoginComponent },
    { path: 'events', component: EventsComponent },
    { path: 'events/:id', component: EventDetailsComponent },
    { path: 'events/manage/:id', component: EventManageComponent },
    { path: 'contacts', component: InterestedComponent },
    { path: 'accreditation', component: AccreditationComponent },
    { path: 'locations', component: LocationsComponent },
  ];
