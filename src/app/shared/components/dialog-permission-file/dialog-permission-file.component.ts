import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeesService } from 'src/app/Presentation/user/employees/services/employees.service';
import * as moment from 'moment';
import { VacationsService } from 'src/app/Presentation/user/vacations/services/vacations.service';
import { PermissionsService } from 'src/app/Presentation/user/permissions/services/permissions.service';

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
  selector: 'app-dialog-permission-file',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatProgressSpinnerModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './dialog-permission-file.component.html',
  styleUrls: ['./dialog-permission-file.component.scss']
})
export class DialogPermissionFileComponent {
  loading = false;
  private permissionsService = inject(PermissionsService);

  @Input() submitted!: boolean;
  info!: any;
  @Input() id!: any;
  AttachmentsFiles: any[] = [];

  private employeesService = inject(EmployeesService);

  constructor(
    public dialogRef: MatDialogRef<DialogPermissionFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    public translate: TranslateService, 
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

      this.permissionsService.permissionGetInfo({ requestId: this.id }).subscribe(
        {

          next: data => {
            this.info = data;
            if (this.info?.attachments.length) {
              this.info?.attachments.forEach((attachment: any) => {
                this.employeesService.downloadImage(attachment.filePath).subscribe(response => {
                  const blob = new Blob([response]);
                  const file = new File([blob], attachment.fileName);

                  this.AttachmentsFiles.push({ imageSrc: attachment.filePath, fileUpload: file, detailsImage: true });
                });
              });
            }
            this.info.dateFrom = moment(new Date(this.info.dateFrom)).format("MM/DD/YYYY");
            this.info.dateTo = moment(new Date(this.info.dateTo)).format("MM/DD/YYYY");

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
