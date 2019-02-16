import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { ParticipantData } from '@models/participant-data';
import { EventsApiService } from '@services/events-api/events-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DateService } from '@services/date/date.service';
import { ExcelService } from '@services/excel/excel.service';
import { NotifierService } from 'angular-notifier';

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

  public sendCertificate(participantId) {
    this.eventsApi.sendCertificate(participantId).then((data: any[]) => {
      this.notifier.notify( 'success', 'Se envió el Certificado!' );
    }, (err) => {
      console.log(err);
    });
  }

  public downloadParticipants() {
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
