import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from './material/material.module';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { ROUTES } from './app.routing';
import { AuthApiService } from './services/auth-api/auth-api.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { CallbackComponent } from './pages/callback/callback.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventsComponent } from './pages/events/events.component';
import { EventDetailsComponent } from './pages/event-details/event-details.component';
import { DatePipe } from '@angular/common';
import { EventsApiService } from '@services/events-api/events-api.service';
import { DateService } from '@services/date/date.service';
import { SubMenuComponent } from './shared/sub-menu/sub-menu.component';
import { ParticipantsComponent } from './pages/participants/participants.component';
import { AccreditationComponent } from './pages/accreditation/accreditation.component';
import { LocationsModalComponent } from './shared/locations-modal/locations-modal.component';
import { TopicsModalComponent } from './shared/topics-modal/topics-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CallbackComponent,
    HeaderComponent,
    FooterComponent,
    EventsComponent,
    EventDetailsComponent,
    SubMenuComponent,
    ParticipantsComponent,
    AccreditationComponent,
    LocationsModalComponent,
    TopicsModalComponent,
  ],
  entryComponents: [
    LocationsModalComponent,
    TopicsModalComponent
  ],
  imports: [
    MatDialogModule,
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { onSameUrlNavigation: 'reload' }),
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    DatePipe,
    AuthApiService,
    EventsApiService,
    DateService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
