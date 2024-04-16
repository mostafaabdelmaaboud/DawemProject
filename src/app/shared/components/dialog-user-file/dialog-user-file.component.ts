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
import { AssignmentsService } from 'src/app/Presentation/user/assignments/services/assignments.service';
import { UsersService } from 'src/app/Presentation/user/users/services/users.service';

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
  selector: 'app-dialog-user-file',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatProgressSpinnerModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './dialog-user-file.component.html',
  styleUrls: ['./dialog-user-file.component.scss']
})
export class DialogUserFileComponent {
  loading = false;
  private usersService = inject(UsersService);

  @Input() submitted!: boolean;
  info!: any;
  @Input() id!: any;
  AttachmentsFiles: any[] = [];

  private employeesService = inject(EmployeesService);

  constructor(
    public dialogRef: MatDialogRef<DialogUserFileComponent>,
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

      this.usersService.userGetInfo({ userId: this.id }).subscribe(
        {

          next: data => {
            this.info = data;

            if (data?.profileImagePath) {
              var validExts = new Array(".xlsx", ".xls", ".pdf", ".png", ".jpeg",".gif");
              let fileExt = data?.profileImageName?.substring(data?.profileImageName?.lastIndexOf('.'));
              if(validExts.indexOf(fileExt?.toLowerCase()) >= 0) {
                let file!:File;
                if(fileExt?.toLowerCase().includes("xlsx") || fileExt?.toLowerCase().includes("xls")) {
                   file = new File([data?.profileImagePath], `excel-file${validExts}`, {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  });
                  this.AttachmentsFiles.push({ imageSrc: "assets/img/excel.png", download:data?.profileImagePath, fileUpload: {
                    lastModified:file.lastModified,
                    size:file.size,
                    type:file.type,
                    name:data?.profileImageName,
                  }, detailsImage: true });

                } else if(fileExt?.toLowerCase().includes("pdf")) {
                   file = new File([data?.profileImagePath], `pdf-file${validExts}`, {
                    type: 'application/pdf',
                  });
                  this.AttachmentsFiles.push({ imageSrc: "assets/img/pdf.png", download:data?.profileImagePath, fileUpload: {
                    lastModified:file.lastModified,
                    size:file.size,
                    type:file.type,
                    name:data?.profileImageName,
                  }, detailsImage: true });
                } else if(fileExt?.toLowerCase().includes("png") || fileExt?.toLowerCase().includes("jpeg") || fileExt?.toLowerCase().includes("gif")) {
                   file = new File([data?.profileImagePath],`img-file${validExts}`, {
                    type: 'image/' +fileExt.slice(fileExt.indexOf('.') + 1, fileExt.length).toLowerCase(),
                  });
                  this.AttachmentsFiles.push({ imageSrc: data?.profileImagePath, download:data?.profileImagePath, fileUpload: {
                    lastModified:file.lastModified,
                    size:file.size,
                    type:file.type,
                    name:data?.profileImageName,
                  }, detailsImage: true });

                }

              }
              // this.uploadedFiles.push({ imageSrc: data.profileImagePath, fileUpload: {
              //   name:data?.profileImageName
              // }, detailsImage: true });

              // this.employeesService.downloadImage(data.profileImagePath).subscribe(response => {
              //   const blob = new Blob([response]);
              //   const file = new File([blob], data?.profileImageName);

              //   this.uploadedFiles.push({ imageSrc: data.profileImagePath, fileUpload: file, detailsImage: true });
              // });
            }

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
