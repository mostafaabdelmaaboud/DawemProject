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
import { EmployeesService } from 'src/app/Presentation/user/employees/services/employees.service';
import * as moment from 'moment';

import { PermissionTypeService } from 'src/app/Presentation/user/permission-type/services/permission-type.service';
import { JustificationsTypeService } from 'src/app/Presentation/user/justifications-type/services/justifications-type.service';

interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  message: string,
  title: string;
  type: string,
  buttonSend: string,
  buttonClose: string,
  refrenceId?: string,
  subTitle?: string
}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-dialog-justification-type-file',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatProgressSpinnerModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './dialog-justification-type-file.component.html',
  styleUrls: ['./dialog-justification-type-file.component.scss']
})
export class DialogJustificationTypeFileComponent {
  loading = false;
  private justificationsTypeService = inject(JustificationsTypeService);

  @Input() submitted!: boolean;
  info!: any;
  @Input() id!: any;
  AttachmentsFiles: any[] = [];


  constructor(
    public dialogRef: MatDialogRef<DialogJustificationTypeFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loading = true;

    if (this.id) {

      this.justificationsTypeService.jusificationGetInfo({ justificationTypeId: this.id }).subscribe(
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
  getMoment(date: any) {
    return moment(new Date(date)).format("MM/DD/YYYY")
  }


  close(): void {
    this.dialogRef.close(false);
  }
}
