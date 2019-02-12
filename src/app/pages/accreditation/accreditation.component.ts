import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { EventsApiService } from '@services/events-api/events-api.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ParticipantData } from '@models/participant-data';

@Component({
  selector: 'app-accreditation',
  templateUrl: './accreditation.component.html',
  styleUrls: ['./accreditation.component.scss'],
})
export class AccreditationComponent implements OnInit {

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent;

  participant: any;

  constructor(private eventsApi: EventsApiService, private dialog: MatDialog) { }

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
          console.log(participant);
          this.dialog.open(AccreditationModalComponent, {
            data: {
              participant: participant.attendant.fullName,
              event: participant.event.Name
            }
          });
          console.log(participant);
        } else {
        }
      }, (err) => {
        console.log(err);
      });
    });
  }
}

@Component({
  selector: 'accreditation-modal',
  templateUrl: 'accreditation-modal.html',
  styleUrls: ['./accreditation.component.scss'],

})
export class AccreditationModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: AccreditationComponent) {}
}
