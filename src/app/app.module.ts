import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from './material/material.module';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS, MatButtonModule } from '@angular/material';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe, registerLocaleData } from '@angular/common';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgQrScannerModule } from 'angular2-qrscanner';
import localeEs from '@angular/common/locales/es';
import { ROUTES } from './app.routing';

import { AuthApiService } from './services/auth-api/auth-api.service';
import { EventsApiService } from '@services/events-api/events-api.service';
import { DateService } from '@services/date/date.service';
import { LocationsApiService } from '@services/locations-api/locations-api.service';
import { AttendantsApiService } from '@services/attendants-api/attendants-api.service';
import { GeographicsApiService } from '@services/geographics-api/geographics-api.service';
import { AccountApiService } from './services/account-api/account-api.service';
import { SchedulesApiService } from '@services/schedules-api/schedules-api.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { CallbackComponent } from './pages/callback/callback.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { EventsComponent } from './pages/events/events.component';
import { EventDetailsComponent } from './pages/event-details/event-details.component';
import { InterestedComponent } from './pages/interested/interested.component';
import { AccreditationComponent } from './pages/accreditation/accreditation.component';
import { LocationsModalComponent } from './shared/locations-modal/locations-modal.component';
import { TopicsModalComponent } from './shared/topics-modal/topics-modal.component';
import { AttendantsModalComponent } from './shared/attendants-modal/attendants-modal.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginHeaderComponent } from './shared/login-header/login-header.component';
import { EventManageComponent } from './pages/event-manage/event-manage.component';
import { UploadComponent } from './shared/upload/upload.component';
import { ParticipantsComponent } from './pages/participants/participants.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { SchedulesModalComponent } from './shared/schedules-modal/schedules-modal.component';
import { ActivityModalComponent } from './shared/activity-modal/activity-modal.component';
import { SpeakerModalComponent } from './shared/speaker-modal/speaker-modal.component';
import { PublicEventsComponent } from './pages/public/public-events/public-events.component';
import { PublicEventComponent } from './pages/public/public-event/public-event.component';
import { EventRegistrationComponent } from './pages/public/event-registration/event-registration.component';
import { ImportModalComponent } from './shared/import-modal/import-modal.component';
import { ConfirmationModalComponent } from './shared/confirmation-modal/confirmation-modal.component';

registerLocaleData(localeEs, 'es');
@NgModule({
  declarations: [
    LocationsModalComponent,
    TopicsModalComponent,
    AttendantsModalComponent,
    LoginHeaderComponent,
    AppComponent,
    LoginComponent,
    CallbackComponent,
    HeaderComponent,
    FooterComponent,
    EventsComponent,
    EventDetailsComponent,
    InterestedComponent,
    AccreditationComponent,
    LocationsComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    ProfileComponent,
    LoginHeaderComponent,
    EventManageComponent,
    UploadComponent,
    ParticipantsComponent,
    ScheduleComponent,
    SchedulesModalComponent,
    ActivityModalComponent,
    SpeakerModalComponent,
    PublicEventsComponent,
    PublicEventComponent,
    EventRegistrationComponent,
    ImportModalComponent,
    ConfirmationModalComponent
  ],
  entryComponents: [
    LocationsModalComponent,
    TopicsModalComponent,
    AttendantsModalComponent,
    SchedulesModalComponent,
    ActivityModalComponent,
    SpeakerModalComponent,
    ImportModalComponent,
    ConfirmationModalComponent
  ],
  imports: [
    MatDialogModule,
    NgbModule.forRoot(),
    ScrollToModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { onSameUrlNavigation: 'reload' }),
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    MatButtonModule,
    NgQrScannerModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: LOCALE_ID, useValue: 'es' },
    DatePipe,
    AuthApiService,
    AccountApiService,
    EventsApiService,
    DateService,
    AttendantsApiService,
    LocationsApiService,
    GeographicsApiService,
    SchedulesApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
