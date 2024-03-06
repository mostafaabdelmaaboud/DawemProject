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
import { MultiSelectModule } from 'primeng/multiselect';
import { EmployeesService } from 'src/app/Presentation/user/employees/services/employees.service';
import { PermissionsService } from 'src/app/Presentation/user/permissions/services/permissions.service';
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { AssignmentsService } from 'src/app/Presentation/user/assignments/services/assignments.service';

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

  titleAssignmentTypeId: string;
  placeholderAssignmentTypeId: string;
  AssignmentTypeIdValidation: string;
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
  selector: 'app-assignment-request',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatProgressSpinnerModule, MatRadioModule, MultiSelectModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './assignment-request.component.html',
  styleUrls: ['./assignment-request.component.scss']
})
export class AssignmentRequestComponent {

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

  @Input() editAssignment!: boolean;
  addBranchGroupForm: FormGroup = this.fb.group({
    IsNecessary: [false],
    radioButtons: ["false"],
    ForEmployee: [false],
    AssignmentTypeId: ['', Validators.required],
    dateTask: [null, Validators.required],
    time:[null, Validators.required],
    Notes: [null, Validators.required],
    files:["", Validators.required],
  });
  AttachmentsFiles: any[] = [];
  requiredCommercialRegFiles = false;
  toggleForEmployee = false;
  

  viewImagesIdCopy: any[] = [];
  imageArray: any[] = [];
  errorUploadFileIdCopyIsRequired!: string;
  errorUploadFileIdCopy!: string;
  public viewImage: any[] = [];

  private assignmentsService = inject(AssignmentsService);
  constructor(
    public dialogRef: MatDialogRef<AssignmentRequestComponent>,
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
    this.addBranchGroupForm.get("dateTask")?.valueChanges.subscribe(data => {
      if (data != null) {
        if (data[1] === null) {
          this.dateTaskMultiple = true;
        } else {
          this.dateTaskMultiple = false;
        }
      }
    })
    let vacationTypeForDropDown = this.assignmentsService.assignmentTypeDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let employeeForDropDown = this.employeesService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    combineLatest({
      vacationTypeForDropDown,
      employeeForDropDown
    }).subscribe(data => {
      this.list = [];
      this.workTeamList = [];
      this.listEmployees = [];
      
      data.vacationTypeForDropDown?.data?.forEach((jobTitle: any) => {
        this.list.push({ name: jobTitle.name, key: jobTitle.id })
      });

      data.employeeForDropDown?.data?.forEach((jobTitle: any) => {
        this.workTeamList.push({ name: jobTitle.name, key: jobTitle.id })
      });
      data.employeeForDropDown?.data?.forEach((jobTitle: any) => {
        this.listEmployees.push({ name: jobTitle.name, key: jobTitle.id })
      });

      if (this.editAssignment) {

        this.assignmentsService.assignmentGetById({ requestId: this.id }).subscribe(
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
              
              this.assignmentsService.assignmentTypeDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data?.assignmentTypeId }).subscribe(dataDropdown => {

                this.list = []


                dataDropdown.data?.forEach((insideData: any) => {
                  this.list.push({ name: insideData.name, key: insideData.id })
                });

                let indexassignmentTypeId = this.list.findIndex(job => job.key === data.assignmentTypeId);
                if (indexassignmentTypeId >= 0) {
                  this.addBranchGroupForm.get("AssignmentTypeId")?.setValue(this.list[indexassignmentTypeId]);
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
              this.addBranchGroupForm.get("time")?.setValue(new Date(data.dateFrom));
              this.addBranchGroupForm.get("Notes")?.setValue(data?.notes);

              this.loading = false;
            },
            error: err => {
              this.loading = false;
            }
          }
        )

      }
      if (!this.editAssignment) {
        this.loading = false;

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

    let indexFile = this.AttachmentsFiles.findIndex(item => item.fileUpload.lastModified === event.fileUpload.lastModified);
    this.AttachmentsFiles.splice(indexFile, 1)
    this.AttachmentsFiles.length === 0 ? this.requiredCommercialRegFiles = true : this.requiredCommercialRegFiles = false;
    // this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'AssignmentTypeId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.assignmentsService.assignmentTypeDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
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
  async onFileChange(pFileList: any, stepIndex: number) {
    
    if (pFileList.files?.length <= 5 || pFileList.length <= 5) {
      this.errorUploadFileIdCopyIsRequired = "";
      let indexidCopyFiles = [...this.AttachmentsFiles];
      if (indexidCopyFiles.length <= 5) {
        let idCopyFiles = [...this.AttachmentsFiles, ...Object.keys(pFileList.files).map(key => pFileList.files[key])];
        let findIndexFileName:any[] = [];
        for (let index = 0; index < pFileList.files.length; index++) {
          const fileSize = pFileList.files[index];
          findIndexFileName = idCopyFiles.filter(file => file.name == pFileList.files[index].name);
          if(findIndexFileName.length < 2) {
            if(fileSize?.size < (2 * 1024 * 1024)) {
              this.viewImage.push(pFileList.files[index]);
              
              this.AttachmentsFiles.push({fileUpload:pFileList.files[index], detailsImage: false});
              

              this.errorUploadFileIdCopy = "";
            } else {
              this.errorUploadFileIdCopy = "The file size must be less than 2MB";
            }
          } else {
            if(fileSize?.size > (2 * 1024 * 1024)) {
              this.errorUploadFileIdCopy = "The file size must be less than 2MB";
            } else {
              this.errorUploadFileIdCopy = "The file is duplicate";
            }
          }
        }
        if(this.errorUploadFileIdCopy === "" && findIndexFileName.length < 2 && this.viewImage.length > 0) {
          for (let index = 0; index < this.viewImage.length; index++) {
            let filereaderTwo = new FileReader();
            const fileSize = this.viewImage[index];
            if (fileSize?.size > (2 * 1024 * 1024)) {
              this.errorUploadFileIdCopy = "The file size must be less than 2MB";
              return;
            } else {
              this.imageArray = [];
              this.errorUploadFileIdCopy = "";
              await filereaderTwo.readAsDataURL(this.viewImage[index]);
              filereaderTwo.onload = () => {
                if((filereaderTwo.result as string).includes("application/pdf")) {
                  
                  this.imageArray.push("assets/img/pdf.png");
                } else {
                  this.imageArray.push(filereaderTwo.result);
                }
              }
              this.viewImagesIdCopy = this.imageArray;
              this.addBranchGroupForm.get("files")?.setValue(this.viewImage[0]?.name);
              this.errorUploadFileIdCopyIsRequired = "";
            }
          }
          if(findIndexFileName.length > 1) {
            this.errorUploadFileIdCopy = "The file is duplicate";
          }
        }
        if(this.errorUploadFileIdCopy === "") {
          // this._snackBar.open("Successfully upload!", 'Close', {
          //   duration: 10000,
          //   panelClass: ['color-gray']
          // });
        }

      } else {
        this.errorUploadFileIdCopyIsRequired = "You can only select up to 5 files.";
      }
    } else {
      this.errorUploadFileIdCopyIsRequired = "You can only select up to 5 files.";
    }
  }
  request() {
    
    if (this.addBranchGroupForm.value.dateTask != null) {
      if (this.addBranchGroupForm.value.dateTask[1] === null) {
        this.dateTaskMultiple = true;
      } else {
        this.dateTaskMultiple = false;
      }
    }
    if (this.addBranchGroupForm.valid && !this.dateTaskMultiple && this.submitted) {
      this.submitted = false;
                    

      this.submitClicked.emit({ ...this.addBranchGroupForm.value, files: this.AttachmentsFiles });
      // this.dialogRef.close(true);
    } else {
      this.getControl("PermissionTypeId")?.markAsDirty();
      this.getControl("dateTask")?.markAsDirty();
      this.getControl("time")?.markAsDirty();
      this.getControl("Notes")?.markAsDirty();
      this.getControl("AssignmentTypeId")?.markAsDirty();
      this.getControl("EmployeeId")?.markAsDirty();

      


    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
