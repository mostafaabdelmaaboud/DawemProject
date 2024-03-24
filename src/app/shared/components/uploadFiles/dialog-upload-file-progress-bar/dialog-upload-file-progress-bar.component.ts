import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
interface DataDialog {
  message: string,
  title: string;
  type: string,
  buttonSend: string,
  buttonClose: string,
  refrenceId?: string
}
@Component({
  selector: 'app-dialog-upload-file-progress-bar',
  standalone: true,
  imports: [CommonModule, InputTextModule, FormsModule, ReactiveFormsModule, NgbProgressbarModule],
  templateUrl: './dialog-upload-file-progress-bar.component.html',
  styleUrls: ['./dialog-upload-file-progress-bar.component.scss']
})
export class DialogUploadFileProgressBarComponent {
  @Input() barWidth: any = 0;
  @Input() barWithText: any = 0;

  height = "20px";

  constructor(
    public dialogRef: MatDialogRef<DialogUploadFileProgressBarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null
  ) {
    this.dialogRef.disableClose = true;
  }
  request() {
    this.dialogRef.close(true);

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
