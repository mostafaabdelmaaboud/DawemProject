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
import { MultiSelectModule } from 'primeng/multiselect';
import { EmployeesService } from 'src/app/Presentation/user/employees/services/employees.service';
import { PermissionsService } from 'src/app/Presentation/user/permissions/services/permissions.service';
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { JustificationsService } from 'src/app/Presentation/user/justifications/services/justifications.service';

interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  addBranchesInputsProps: addBranchesInputsProps[],
  uploadFile: string;
  setAsNecessary: string;

  titlePermissionTypeId: string;
  placeholderPermissionTypeId: string;
  PermissionTypeIdValidation: string;
  titleNotes: string;
  placeholdeNotes: string;
  NotesValidation: string;

  placeholderCalendar: string;
  chooseLabel: string;
  titleCalendar: string;
  timeAttendance: string;
  placeholdertimeAttendance: string;
  message: string,

  labelRadioButton: string,
  firstRadio: string,
  secondRadio: string,
  TaskTypeIdValidation: string;
  dateTaskValidation: string;

  titleEmployeeId: string;
  placeholderEmployeeId: string;
  EmployeeIdValidation: string;
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
  selector: 'app-request-for-justification',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatProgressSpinnerModule, MatRadioModule, MultiSelectModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './request-for-justification.component.html',
  styleUrls: ['./request-for-justification.component.scss']
})
export class RequestForJustificationComponent {

  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  @Input() list: any[] = [
  ];
  @Input() workTeamList: any[] = [
  ];
  @Input() id!: string;

  dateTaskMultiple = false;
  listEmployees: any[] = [
  ];
  loading = false;
  private employeesService = inject(EmployeesService);

  @Input() editjustification!: boolean;
  addBranchGroupForm: FormGroup = this.fb.group({
    IsNecessary: [false],
    radioButtons: ["false"],
    ForEmployee: [false],
    JustificationTypeId: ['', Validators.required],
    dateTask: [null, Validators.required]
  });
  AttachmentsFiles: any[] = [];
  requiredCommercialRegFiles = false;
  toggleForEmployee = false;
  private justificationsService = inject(JustificationsService);
  constructor(
    public dialogRef: MatDialogRef<RequestForJustificationComponent>,
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

    let justificationTypeForDropDown = this.justificationsService.jusificationTypeDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let employeeForDropDown = this.employeesService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    combineLatest({
      justificationTypeForDropDown,
      employeeForDropDown
    }).subscribe(data => {
      this.list = [];
      this.workTeamList = [];
      this.listEmployees = [];

      data.justificationTypeForDropDown?.data?.forEach((jobTitle: any) => {
        this.list.push({ name: jobTitle.name, key: jobTitle.id })
      });

      data.employeeForDropDown?.data?.forEach((jobTitle: any) => {
        this.workTeamList.push({ name: jobTitle.name, key: jobTitle.id })
      });
      data.employeeForDropDown?.data?.forEach((jobTitle: any) => {
        this.listEmployees.push({ name: jobTitle.name, key: jobTitle.id })
      });

      if (this.editjustification) {

        this.justificationsService.JustificationGetById({ requestId: this.id }).subscribe(
          {
            next: data => {

              if (data?.attachments.length) {
                data?.attachments.forEach((attachment: any) => {
                  this.employeesService.downloadImage(attachment.filePath).subscribe(response => {
                    const blob = new Blob([response]);
                    const file = new File([blob], attachment.fileName);

                    this.AttachmentsFiles.push({ imageSrc: attachment.filePath, fileUpload: file, detailsImage: true });
                  });
                });
              }
              this.addBranchGroupForm.get("IsNecessary")?.setValue(data.isNecessary);

              if (data.forEmployee) {
                this.addBranchGroupForm.addControl("EmployeeId", this.fb.control("", [Validators.required]));
                this.addBranchGroupForm.get("ForEmployee")?.setValue(data.forEmployee);
                this.addBranchGroupForm.get("radioButtons")?.setValue("true");

                this.toggleForEmployee = true;




              } else {

                this.toggleForEmployee = false;
                this.addBranchGroupForm.get("radioButtons")?.setValue("false");

                this.addBranchGroupForm.removeControl("EmployeeId");
                this.addBranchGroupForm.get("ForEmployee")?.setValue(data.forEmployee);

              }

              this.justificationsService.jusificationTypeDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data?.justificationTypeId }).subscribe(dataDropdown => {

                this.list = []


                dataDropdown.data?.forEach((insideData: any) => {
                  this.list.push({ name: insideData.name, key: insideData.id })
                });

                let indexJustificationTypeId = this.list.findIndex(job => job.key === data.justificationTypeId);

                if (indexJustificationTypeId >= 0) {
                  this.addBranchGroupForm.get("JustificationTypeId")?.setValue(this.list[indexJustificationTypeId]);


                }
              });
              this.employeesService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data?.employeeId }).subscribe(dataDropdown => {

                this.listEmployees = []
                dataDropdown.data?.forEach((insideData: any) => {
                  this.listEmployees.push({ name: insideData.name, key: insideData.id })
                });

                let indexEmployeeId = this.listEmployees.findIndex(job => job.key === data.employeeId);
                if (indexEmployeeId >= 0) {
                  this.addBranchGroupForm.get("EmployeeId")?.setValue(this.listEmployees[indexEmployeeId]);
                }
              });
              this.addBranchGroupForm.get("dateTask")?.setValue([new Date(data.dateFrom), new Date(data.dateTo)]);
              this.addBranchGroupForm.get("Notes")?.setValue(data?.notes);


              this.loading = false;
            },
            error: err => {
              this.loading = false;
            }
          }
        )

      }
      if (!this.editjustification) {
        this.loading = false;
        this.addBranchGroupForm.addControl("Notes", this.fb.control(null, Validators.required))
      }

    })
    this.addBranchGroupForm.get("radioButtons")?.valueChanges.subscribe(data => {

      if (data === "true") {
        this.addBranchGroupForm.addControl("EmployeeId", this.fb.control("", [Validators.required]));
        this.addBranchGroupForm.get("ForEmployee")?.setValue(true);
        this.toggleForEmployee = true;




      } else {

        this.toggleForEmployee = false;

        this.addBranchGroupForm.removeControl("EmployeeId");
        this.addBranchGroupForm.get("ForEmployee")?.setValue(false);

      }


    })
  }
  getControl(controlName: string) {
    return this.addBranchGroupForm?.get(controlName);
  }
  onRemoveCommercialReg(event: any) {

    let indexFile = this.AttachmentsFiles.findIndex(item => item.fileUpload.lastModified === event.lastModified);
    this.AttachmentsFiles.splice(indexFile, 1)
    this.AttachmentsFiles.length === 0 ? this.requiredCommercialRegFiles = true : this.requiredCommercialRegFiles = false;
    // this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'JustificationTypeId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.justificationsService.jusificationTypeDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.list = [];
                res?.data?.forEach((item: any) => {
                  this.list.push({ name: item.name, key: item.id })
                });
              });
          }

        }
        break;
      case 'EmployeeId':
        if (data || data === "") {

          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.employeesService.GetForDropDownEmployee({ agingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listEmployees = [];
                res?.data?.forEach((jobTitle: any) => {
                  this.listEmployees.push({ name: jobTitle.name, key: jobTitle.id })
                });
              });
          }

        }
        break;
      default:
        break;
    }
  }
  files(event: UploadEvent) {

    for (let file of event.files) {
      var reader = new FileReader();

      let thisParent = this;
      reader.readAsDataURL(file);
      reader.onload = (function (file) {
        return function (e: any) {
          // Render thumbnail.
          thisParent.AttachmentsFiles.push({ imageSrc: e.target.result, fileUpload: file, detailsImage: false });

        };

      })(file);



      // this.uploadedCommercialRegFiles.push({ imageSrc: src, fileUpload: file });


    }
    // this.uploadedCommercialRegFiles.length === 0 ? this.requiredCommercialRegFiles = true : this.requiredCommercialRegFiles = false;

    // this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
  request() {
    if (this.addBranchGroupForm.value.dateTask != null) {
      if (this.addBranchGroupForm.value.dateTask[1] === null) {
        this.dateTaskMultiple = true;
      } else {
        this.dateTaskMultiple = false;
      }
    }
    if (this.addBranchGroupForm.valid && !this.dateTaskMultiple) {
      this.submitted = false;
      this.submitClicked.emit({ ...this.addBranchGroupForm.value, files: this.AttachmentsFiles });
      // this.dialogRef.close(true);
    } else {
      this.getControl("JustificationTypeId")?.markAsDirty();
      this.getControl("dateTask")?.markAsDirty();
      this.getControl("Notes")?.markAsDirty();
    }
  }
  close(): void {
    this.dialogRef.close(false);
  }
}
