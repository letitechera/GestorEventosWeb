import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TopicsModalComponent } from '@shared/topics-modal/topics-modal.component';

@Component({
  selector: 'sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.scss']
})
export class SubMenuComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openTopicsDialog(): void {
    const dialogRef = this.dialog.open(TopicsModalComponent, {
      height: '400px',
      width: '350px',
      // data: {name: this.name}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}
