import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { environment } from '@environment';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { ExcelService } from '@services/excel/excel.service';

@Component({
  selector: 'app-import-modal',
  templateUrl: './import-modal.component.html',
  styleUrls: ['./import-modal.component.scss']
})
export class ImportModalComponent implements OnInit {

  public formData: FormData;
  public submitted: boolean;
  public loading: boolean;
  public fileLoaded: boolean;
  public fileUrl: string;
  public fileName: string;
  private baseurl = `${environment.webApiUrl}/upload/import/xml`;
  public progress: number;
  public message: string;
  public error: boolean;
  public errorMsg: string;

  constructor(public dialogRef: MatDialogRef<ImportModalComponent>, private auth: AuthApiService,
    private http: HttpClient, private excelService: ExcelService) { }

  ngOnInit() {
    this.auth.checkSession();
    this.formData = new FormData();
  }

  public uploadFile = (files, event) => {
    if (files.length === 0) {
      this.fileLoaded = false;
      return;
    }
    /* Preview */
    if (event.target.files && event.target.files[0]) {
      this.fileUrl = URL.createObjectURL(event.target.files[0]);
    }

    /* Partial Upload */
    const fileToUpload = <File>files[0];
    this.formData.append('file', fileToUpload, fileToUpload.name);
    this.fileLoaded = true;
    this.fileName = this.getShortName(fileToUpload.name);
  }

  public submitImport() {
    if (!this.fileLoaded) {
      return;
    }
    /* Store file */
    this.loading = true;

    this.http.post(`${this.baseurl}`, this.formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
          if (this.progress === 100) {
            this.formData = new FormData();
            this.fileLoaded = false;
          }
        } else if (event.type === HttpEventType.Response) {
          this.loading = false;
          switch (event.status) {
            case 200:
              this.error = false;
              this.dialogRef.close('changed');
              break;
            case 204:
              this.error = true;
              this.errorMsg = "Verifique errores de planilla, o que todos los contactos tengan un Email."
              break;
            case 400:
              this.error = true;
              this.errorMsg = "Error en el archivo subido."
              break;
            default:
              this.error = true;
              this.errorMsg = "Ha ocurrido un error, intente más tarde."
              break;
          }
        }
      }, (err) => {
        console.log(err);
        this.loading = false;
        this.error = true;
        this.errorMsg = "Ha ocurrido un error, intente más tarde."
      });
  }

  public downloadSample() {
    var data: any = [{
      Nombre: '',
      Apellido: '',
      Email: '',
      Telefono: '',
      Celular: '',
    }];
    this.excelService.exportAsExcelFile(data, 'Contactos_Lista');
  }

  public clearImage() {
    this.formData = new FormData();
    this.fileLoaded = false;
    this.fileUrl = '';
  }

  private getShortName(name: string){
    if(name.length>30){
      return name.substr(0, 27)+"...";
    } else {
      return name;
    }
  }

  public close(): void {
    this.dialogRef.close();
  }

}
