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
import { TasksService } from 'src/app/Presentation/user/tasks/services/tasks.service';

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
  selector: 'app-dialog-task-file',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatProgressSpinnerModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './dialog-task-file.component.html',
  styleUrls: ['./dialog-task-file.component.scss']
})
export class DialogTaskFileComponent {
  loading = false;
  private tasksService = inject(TasksService);

  @Input() submitted!: boolean;
  info!: any;
  @Input() id!: any;

  AttachmentsFiles: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogTaskFileComponent>,
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

      this.tasksService.taskGetInfo({ requestId: this.id }).subscribe(
        {
          next: data => {
            this.info = data;
            if (this.info?.attachments.length) {
              this.info?.attachments.forEach((attachment: any) => {
                // this.employeesService.downloadImage(attachment.filePath).subscribe(response => {
                //   const blob = new Blob([response]);
                //   const file = new File([blob], attachment.fileName);
                //   this.AttachmentsFiles.push({ imageSrc: attachment.filePath, fileUpload: file, detailsImage: true });
                // });
                var validExts = new Array(".xlsx", ".xls", ".pdf", ".png", ".jpeg",".gif", ".jpg");
                let fileExt = attachment.fileName.substring(attachment.fileName.lastIndexOf('.'));
                if(validExts.indexOf(fileExt?.toLowerCase()) >= 0) {
                  let file!:File;
                  if(fileExt?.toLowerCase().includes("xlsx") || fileExt?.toLowerCase().includes("xls")) {
                     file = new File([attachment.filePath], `excel-file${validExts}`, {
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    this.AttachmentsFiles.push({ imageSrc: "assets/img/excel.png", download:attachment.filePath, fileUpload: {
                      lastModified:file.lastModified,
                      size:file.size,
                      type:file.type,
                      name:attachment.fileName,
                    }, detailsImage: true });

                  } else if(fileExt?.toLowerCase().includes("pdf")) {
                     file = new File([attachment.filePath], `pdf-file${validExts}`, {
                      type: 'application/pdf',
                    });
                    this.AttachmentsFiles.push({ imageSrc: "assets/img/pdf.png", download:attachment.filePath, fileUpload: {
                      lastModified:file.lastModified,
                      size:file.size,
                      type:file.type,
                      name:attachment.fileName,
                    }, detailsImage: true });
                  } else if(fileExt?.toLowerCase().includes("png") || fileExt?.toLowerCase().includes("jpeg") || fileExt?.toLowerCase().includes("jpg") || fileExt?.toLowerCase().includes("gif")) {
                     file = new File([attachment.filePath],`img-file${validExts}`, {
                      type: 'image/' +fileExt.slice(fileExt.indexOf('.') + 1, fileExt.length).toLowerCase(),
                    });
                    this.AttachmentsFiles.push({ imageSrc: attachment.filePath, download:attachment.filePath, fileUpload: {
                      lastModified:file.lastModified,
                      size:file.size,
                      type:file.type,
                      name:attachment.fileName,
                    }, detailsImage: true });
                  }

                }
              });
            }
            this.info.dateFrom = moment(new Date(this.info.dateFrom)).format("MM-DD-YYYY h:mm a");
            this.info.dateTo = moment(new Date(this.info.dateFrom)).format("MM-DD-YYYY h:mm a");
            this.info.taskTime = moment(new Date(this.info.dateFrom)).format("hh:mm:ss a");
            
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
