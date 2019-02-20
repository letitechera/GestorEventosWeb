import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { ParticipantData } from '@models/participant-data';
import { EventsApiService } from '@services/events-api/events-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DateService } from '@services/date/date.service';
import { ExcelService } from '@services/excel/excel.service';
import { NotifierService } from 'angular-notifier';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sorter: MatSort;
  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<ParticipantData>;
  public participants: ParticipantData[];
  public loading: boolean;
  private id: number;
  private sub: any;

  constructor(private route: ActivatedRoute, private eventsApi: EventsApiService, private auth: AuthApiService, private router: Router,
    private dateService: DateService, private dialog: MatDialog, private excelService: ExcelService, private notifier: NotifierService) { }

  ngOnInit() {
    this.auth.checkSession();

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.setDisplayColumns();
      this.initData(this.id);
    });
  }

  public sendCertificates() {
    this.eventsApi.sendCertificates(this.id).then((data: any[]) => {
      alert('certificate sent');
      this.notifier.notify('success', 'Los certificados están siendo enviados');
    }, (err) => {
      this.notifier.notify( 'error', 'Ups.. Ha ocurrido un error' );
    });
  }

  public openConfirmCertificates() {
    this.auth.checkSession();
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        message: '¿Estás seguro de que deseas enviar los certificados?'
      },
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.sendCertificates();
      }
    });
  }

  public openConfirmAccredit(participantId) {
    this.auth.checkSession();
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: 'Acreditar Usuario',
        message: 'El usuario sumará una asistencia a su historial, ¿desea continuar?'
      },
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.accreditParticipant(participantId);
      }
    });
  }

  public accreditParticipant(participantId) {
    this.loading = true;
    this.eventsApi.accredit(participantId).then((data: any[]) => {
      this.openSuccessDialog();
      this.loading = false;
    }, (err) => {
      this.loading = false;
      this.notifier.notify( 'error', 'Ups.. Ha ocurrido un error' );
      console.log(err);
    });
  }

  public openSuccessDialog() {
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

  public downloadParticipants() {
    if (this.participants == null || this.participants == undefined) {
      return;
    }
    if (this.participants.length > 0) {
      var data = [];
      this.participants.forEach(p => {
        data.push({
          Nombre: p.FirstName,
          Apellido: p.LastName,
          Email: p.Email,
          Telefono: p.Phone,
          Celular: p.CellPhone
        });
      });
      this.excelService.exportAsExcelFile(data, 'Participantes_Evento_' + this.id);
    }
  }

  private setDisplayColumns() {
    this.displayedColumns = [
      'FirstName',
      'LastName',
      'Email',
      'Phone',
      'CellPhone',
      'Controls'
    ];
  }

  private initData(id) {
    this.loading = true;
    this.eventsApi.getParticipants(id).then((data: any[]) => {
      this.loading = false;
      this.participants = data;
      if (this.participants) {
        this.initDataSource();
      }
    }, (err) => {
      this.loading = false;
      console.log(err);
    });
  }

  private initDataSource() {
    this.dataSource = new MatTableDataSource(this.participants);
    this.dataSource.paginator = this.paginator;
    this.sorter.start = 'desc';
    this.dataSource.sort = this.sorter;
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
