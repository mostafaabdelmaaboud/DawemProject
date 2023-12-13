import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ZonesService } from 'src/app/Presentation/user/zones/services/zones.service';


interface DataDialog {
  message: string,
  title: string;
  type: string,
  buttonSend: string,
  buttonClose: string,
  refrenceId?: string,
  subTitle?: string
}


@Component({
  selector: 'app-dialog-zone-file',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatProgressSpinnerModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './dialog-zone-file.component.html',
  styleUrls: ['./dialog-zone-file.component.scss']
})
export class DialogZoneFileComponent {
  loading = false;
  private zonesService = inject(ZonesService);

  @Input() submitted!: boolean;
  info!: any;
  @Input() id!: any;
  AttachmentsFiles: any[] = [];


  constructor(
    public dialogRef: MatDialogRef<DialogZoneFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {

    this.loading = true;

    if (this.id) {

      this.zonesService.ZoneGetInfo({ zoneId: this.id }).subscribe(
        {

          next: data => {
            this.info = data;
            this.loading = false;

          },
          error: err => {
            this.loading = false;

          }
        })

    }
  }



  close(): void {
    this.dialogRef.close(false);
  }
}
