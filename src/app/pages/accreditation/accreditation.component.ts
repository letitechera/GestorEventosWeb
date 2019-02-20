import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { EventsApiService } from '@services/events-api/events-api.service';
import { NotifierService } from 'angular-notifier';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ParticipantData } from '@models/participant-data';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-accreditation',
  templateUrl: './accreditation.component.html',
  styleUrls: ['./accreditation.component.scss'],
})
export class AccreditationComponent implements OnInit {

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent;

  participant: any;

  constructor(private eventsApi: EventsApiService, private notifier: NotifierService, private dialog: MatDialog) { }

  ngOnInit() {
    this.qrScannerComponent.getMediaDevices().then(devices => {
      console.log(devices);
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
        if (device.kind.toString() === 'videoinput') {
          videoDevices.push(device);
        }
      }
      if (videoDevices.length > 0) {
        let choosenDev;
        for (const dev of videoDevices) {
          if (dev.label.includes('front')) {
            choosenDev = dev;
            break;
          }
        }
        if (choosenDev) {
          this.qrScannerComponent.chooseCamera.next(choosenDev);
        } else {
          this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
        }
      }
    });

    this.qrScannerComponent.capturedQr.subscribe(participantId => {
      this.eventsApi.accredit(participantId).then((participant: ParticipantData) => {
        this.participant = participant;
        if (participant != null) {
          this.openConfirmDialog();
          console.log(participant);
        } else {
        }
      }, (err) => {
        this.notifier.notify('error', 'Hubo un error en la lectura del código QR');
        console.log(err);
      });
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
      }
    });
  }
}

