import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  public title: string;
  public message: string;
  public success: boolean;
  public defaultTitle = 'Corfirmar Acción';
  public defaultMessage = '¿Estás seguro de que deseas realizar esta acción?';

  constructor(public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data != null) {
      this.title = this.data.title != null ? this.data.title : this.defaultTitle;
      this.message = this.data.message != null ? this.data.message : this.defaultMessage;
      this.success = this.data.success != null ? true : null;
    } else {
      this.title = this.defaultTitle;
      this.message = this.defaultMessage;
      this.success = null;
    }
  }

  public submitAccept() {
    console.log('accepted');
    this.dialogRef.close('confirm');
  }

  public close(): void {
    this.dialogRef.close();
  }

}
