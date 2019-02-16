import { Component, ViewChild, OnInit } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { EventsApiService } from '@services/events-api/events-api.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-accreditation',
  templateUrl: './accreditation.component.html',
  styleUrls: ['./accreditation.component.scss'],
})
export class AccreditationComponent implements OnInit {

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent;

  participant: any;

  constructor(private eventsApi: EventsApiService, private notifier: NotifierService) { }

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
      this.eventsApi.accredit(participantId).then((participant: any[]) => {
        this.participant = participant;
        if (participant != null) {
          this.notifier.notify('success', 'El participante se acreditó con éxito');
        } else {
        this.notifier.notify('error', 'El participante no pudo ser acreditado');
        }
      }, (err) => {
        this.notifier.notify('error', 'Ups.. Ha ocurrido un error');
        console.log(err);
      });
    });
  }
}