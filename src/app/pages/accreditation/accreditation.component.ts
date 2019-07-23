import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { EventsApiService } from '@services/events-api/events-api.service';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material';
import { ParticipantData } from '@models/participant-data';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-accreditation',
  templateUrl: './accreditation.component.html',
  styleUrls: ['./accreditation.component.scss'],
})
export class AccreditationComponent implements OnInit {

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent;

  public loading: boolean;
  public participant: any;

  constructor(private eventsApi: EventsApiService, private notifier: NotifierService, private router: Router,
    private dialog: MatDialog, private deviceService: DeviceDetectorService, private auth: AuthApiService) { }

  ngOnInit() {
    this.initCamera();
    this.qrScannerComponent.capturedQr.subscribe(participantId => {
      this.loading = true;
      this.eventsApi.accredit(participantId).then((participant: ParticipantData) => {
        this.participant = participant;
        this.loading = false;
        if (participant != null) {
        debugger;
          this.openConfirmDialog();
          console.log(participant);
        } else {
        }
      }, (err) => {
        this.loading = false;
        this.notifier.notify('error', 'Hubo un error en la lectura del código QR');
        // this.reloadPage();
        this.initCamera();
        console.log(err);
      });
    });
  }

  public initCamera(){
    this.auth.checkSession();
    this.loading = true;
    this.qrScannerComponent.getMediaDevices().then(devices => {
      this.loading = false;;
      const isMobile = this.deviceService.isMobile();
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
        if (device.kind.toString() === 'videoinput') {
          videoDevices.push(device);
        }
      }
      if (videoDevices.length > 0) {
        let choosenDev;
        for (const dev of videoDevices) {
          if(isMobile){
            if (dev.label.includes('back')) {
              choosenDev = dev;
              break;
            }
          } else{
            if (dev.label.includes('front')) {
              choosenDev = dev;
              break;
            }
          }
        }
        if (choosenDev) {
          this.qrScannerComponent.chooseCamera.next(choosenDev);
        } else {
          this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
        }
      }
    });
  }

  public openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: 'Participante Acreditado',
        message: '¡El paricipante ha sido acreditado con éxito!',
        success: true,
      },
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.initCamera();
        // this.reloadPage();
      }
    });
  }

  public reloadPage(){
    window.location.reload();
  }
}

