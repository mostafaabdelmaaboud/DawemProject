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
import { EMPTY, Subject, combineLatest, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  addBranchesInputsProps: addBranchesInputsProps[],
  setAsNecessary: string;
  titleDropdownSecond: string;
  labelRadioButtonFirst: string;
  firstRadio: string;
  secondRadio: string;
  thirdRadio: string;
  firstRadiTwo: string;
  secondRadioTwo: string;
  thirdRadioTwo: string;
  titleClose: string;
  titleFieldDisabled: string;
  placeholdeieldDisabled: string;
  placeholderDropdown: string;
  fieldFirst: string;
  placeholdefieldFirst: string;
  validationtitlefieldFirst: string;
  labelEmployeeName: string;
  firstRadioEmployeeName: string;
  secondRadioEmployeeName: string;
  thirdRadioEmployeeName: string;
  thirdRadioFour: string;

  placeholderCalendar: string;
  titleNotes: string;
  placeholdeNotes: string;
  titleDropdownFirst: string;
  placeholderDropdownFirst: string;
  validationtitleDropdownFirst: string;
  titleCalendar: string;
  validationCalendar: string;
  labelRadioButtonSecond: string;
  validationtitleDropdownSecond: string;
  validationtitleNotes: string;
  titleWorkSchedule: string
  placeholderWorkSchedule: string;
  validationtitleWorkSchedule: string;
  directManager: string;
  placeholdeDirectManager: string;
  validationtitleDirectManager: string;
  address: string;
  placeholdeAddress: string;
  validationtitleAddress: string;
  email: string;

  placeholdeEmail: string;

  validationtitleEmail: string;
  mobileNumber: string;

  placeholdeMobileNumber: string;
  validationtitleEmailPattern: string;
  validationtitleMobileNumber: string;
  JobNumber: string;
  placeholdeJobNumber: string;
  validationtitleJobNumber: string;
  uploadFile: string;
  chooseLabel: string;
  message: string,
  title: string;
  type: string,
  buttonSend: string,
  code: string;
  buttonClose: string,
  refrenceId?: string,
  subTitle?: string
}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-dialog-add-an-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatProgressSpinnerModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './dialog-add-an-employee.component.html',
  styleUrls: ['./dialog-add-an-employee.component.scss']
})
export class DialogAddAnEmployeeComponent {
  loading = false;
  private employeesService = inject(EmployeesService);

  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  @Input() jobTitleFirst: any[] = [];

  @Input() sectionList: any[] = [];
  @Input() workScheduleList: any[] = [];
  @Input() editEmployee!: boolean;
  @Input() id!: string;
  @Input() departmentID!: any;

  
  listDirectManager: any[] = [];


  addBranchGroupForm: FormGroup = this.fb.group({
    AttendanceType: ['0'],
    employeeType: ['0'],
    ScheduleId: ['', Validators.required],
    isActive: [false],
    name: ['', Validators.required],
    employeeNumber: ['', [Validators.required, Validators.min(0)]],
    JobTitleId: ['', Validators.required],
    DepartmentId: ['', Validators.required],
    JoiningDate: ['', Validators.required],
    directManager: ['', Validators.required],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{8,}$/)]],
    email: ['', [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    address: ['', Validators.required],
    fieldDisabled: [''],
    AnnualVacationBalance: ['', [Validators.required, Validators.min(0)]]
  });
  uploadedFiles: any[] = [];
  requiredCommercialRegFiles = false;
  constructor(
    public dialogRef: MatDialogRef<DialogAddAnEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.data?.code) {
      this.addBranchGroupForm.get("fieldDisabled")?.setValue(this.data?.code);
    }
    this.loading = true;

    let employeeForDropDown = this.employeesService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });

    let employeesService = this.employeesService.getJobTitles({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let departmentGetForDropDown = this.employeesService.getDepartmentForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let scheduleForDropDown = this.employeesService.getScheduleForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0 });


    combineLatest({
      employeeForDropDown,
      employeesService,
      departmentGetForDropDown,
      scheduleForDropDown
    }).subscribe(data => {
      this.jobTitleFirst = [];
      this.sectionList = [];
      this.workScheduleList = [];
      this.listDirectManager = [];
      data.employeeForDropDown?.data?.forEach((jobTitle: any) => {
        this.listDirectManager.push({ name: jobTitle.name, key: jobTitle.id })
      });
      data.employeesService?.data?.forEach((jobTitle: any) => {
        this.jobTitleFirst.push({ name: jobTitle.name, key: jobTitle.id })
      });
      data.departmentGetForDropDown?.data?.forEach((jobTitle: any) => {
        this.sectionList.push({ name: jobTitle.name, key: jobTitle.id })
      });
      data.scheduleForDropDown?.data?.forEach((jobTitle: any) => {
        this.workScheduleList.push({ name: jobTitle.name, key: jobTitle.id })
      });
      if (this.editEmployee) {


        this.employeesService.employeeGetById({ employeeId: this.id }).subscribe(
          {
            next: data => {

              if (data?.profileImagePath) {
                this.employeesService.downloadImage(data.profileImagePath).subscribe(response => {
                  const blob = new Blob([response]);
                  const file = new File([blob], data.profileImageName);

                  this.uploadedFiles.push({ imageSrc: data.profileImagePath, fileUpload: file, detailsImage: true });
                });
              }

              this.addBranchGroupForm.get("isActive")?.setValue(data.isActive);


              this.employeesService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data?.directManagerId }).subscribe(dataDropdown => {

                this.listDirectManager = []
                dataDropdown.data?.forEach((insideData: any) => {
                  this.listDirectManager.push({ name: insideData.name, key: insideData.id })
                });

                let indexDirectManager = this.listDirectManager.findIndex(job => job.key === data.directManagerId);
                if (indexDirectManager >= 0) {
                  this.addBranchGroupForm.get("directManager")?.setValue(this.listDirectManager[indexDirectManager]);
                }
              });
              this.addBranchGroupForm.get("email")?.setValue(data.email);
              this.addBranchGroupForm.get("address")?.setValue(data.address);
              this.addBranchGroupForm.get("mobileNumber")?.setValue(data.mobileNumber);
              this.addBranchGroupForm.get("AttendanceType")?.setValue(data.attendanceType.toString());
              this.addBranchGroupForm.get("name")?.setValue(data.name);

              this.addBranchGroupForm.get("employeeType")?.setValue(data.employeeType.toString());
              this.addBranchGroupForm.get("employeeNumber")?.setValue(data.employeeNumber);


              this.employeesService.getJobTitles({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.jobTitleId }).subscribe(dataDropdown => {

                this.jobTitleFirst = []
                dataDropdown.data?.forEach((insideData: any) => {
                  this.jobTitleFirst.push({ name: insideData.name, key: insideData.id })
                });
                let JobTitleId = this.jobTitleFirst.findIndex(job => job.key === data.jobTitleId);
                if (JobTitleId >= 0) {
                  this.addBranchGroupForm.get("JobTitleId")?.setValue(this.jobTitleFirst[JobTitleId]);
                }
              });
              this.employeesService.getDepartmentForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.departmentId }).subscribe(dataDropdown => {

                this.sectionList = []
                dataDropdown.data?.forEach((insideData: any) => {
                  this.sectionList.push({ name: insideData.name, key: insideData.id })
                });
                let sectionList = this.sectionList.findIndex(job => job.key === data.departmentId);
                if (sectionList >= 0) {
                  this.addBranchGroupForm.get("DepartmentId")?.setValue(this.sectionList[sectionList]);
                }
              });
              this.addBranchGroupForm.get("JoiningDate")?.setValue(new Date(data.joiningDate));
              this.employeesService.getScheduleForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.scheduleId }).subscribe(dataDropdown => {
                this.workScheduleList = []
                dataDropdown.data?.forEach((insideData: any) => {
                  this.workScheduleList.push({ name: insideData.name, key: insideData.id })
                });
                let ScheduleId = this.workScheduleList.findIndex(job => job.key === data.scheduleId);
                if (ScheduleId >= 0) {
                  this.addBranchGroupForm.get("ScheduleId")?.setValue(this.workScheduleList[ScheduleId]);
                }
              });
              this.addBranchGroupForm.get("AnnualVacationBalance")?.setValue(data.annualVacationBalance);
              this.loading = false;
            },
            error: err => {
              this.loading = false;
            }
          }
        )

      }
      if (!this.editEmployee) {
        this.loading = false;
        
        if(this.departmentID >= 0) {
          
          this.employeesService.getDepartmentForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, id: this.departmentID }).subscribe(dataDropdown => {

            this.sectionList = []
            
            dataDropdown.data?.forEach((insideData: any) => {
              this.sectionList.push({ name: insideData.name, key: insideData.id })
            });
            let sectionList = this.sectionList.findIndex(job => job.key === this.departmentID);
            if (sectionList >= 0) {
              this.addBranchGroupForm.get("DepartmentId")?.setValue(this.sectionList[sectionList]);
            }
          });
        }
     
      }

    })

  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'JobTitleId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.employeesService.getJobTitles({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.jobTitleFirst = [];
                res?.data?.forEach((jobTitle: any) => {
                  this.jobTitleFirst.push({ name: jobTitle.name, key: jobTitle.id })
                });
              });
          }

        }
        break;
      case 'directManager':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.employeesService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listDirectManager = [];
                res?.data?.forEach((jobTitle: any) => {
                  this.listDirectManager.push({ name: jobTitle.name, key: jobTitle.id })
                });
              });
          }



        }

        break;
      case 'DepartmentId':
        if (data || data === "") {

          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.employeesService.getDepartmentForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.sectionList = [];
                res?.data?.forEach((jobTitle: any) => {
                  this.sectionList.push({ name: jobTitle.name, key: jobTitle.id })
                });
              });
          }

        }
        break;
      case 'ScheduleId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.employeesService.getScheduleForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.sectionList = [];
                res?.data?.forEach((jobTitle: any) => {
                  this.sectionList.push({ name: jobTitle.name, key: jobTitle.id })
                });
              });
          }

        }

        break;

      default:
        break;
    }
  }
  onRemovefile(event: any) {

    let indexFile = this.uploadedFiles.findIndex(item => item.fileUpload.lastModified === event.lastModified);
    this.uploadedFiles.splice(indexFile, 1)
    this.uploadedFiles.length === 0 ? this.requiredCommercialRegFiles = true : this.requiredCommercialRegFiles = false;
    // this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
  files(event: UploadEvent) {

    var reader = new FileReader();

    let thisParent = this;
    reader.readAsDataURL(event.files[0]);
    reader.onload = (function (file) {
      return function (e: any) {

        // Render thumbnail.
        thisParent.uploadedFiles[0] = { imageSrc: e.target.result, fileUpload: file, detailsImage: false };

      };

    })(event.files[0]);



    // this.uploadedCommercialRegFiles.push({ imageSrc: src, fileUpload: file });


    // this.uploadedCommercialRegFiles.length === 0 ? this.requiredCommercialRegFiles = true : this.requiredCommercialRegFiles = false;

    // this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
  getControl(controlName: string) {
    return this.addBranchGroupForm?.get(controlName);
  }

  request() {
    
    if (this.addBranchGroupForm.valid && this.submitted) {
      this.submitted = false;
      this.submitClicked.emit({ ...this.addBranchGroupForm.value, files: this.uploadedFiles });
      // this.dialogRef.close(true);
    } else {
      this.getControl("name")?.markAsDirty();
      this.getControl("employeeNumber")?.markAsDirty();

      
      this.getControl("fieldFirst")?.markAsDirty();
      this.getControl("JobTitleId")?.markAsDirty();
      this.getControl("DepartmentId")?.markAsDirty();
      this.getControl("JoiningDate")?.markAsDirty();
      this.getControl("ScheduleId")?.markAsDirty(); this.getControl("directManager")?.markAsDirty();

      this.getControl("mobileNumber")?.markAsDirty();

      this.getControl("email")?.markAsDirty();
      this.getControl("address")?.markAsDirty();

      this.getControl("AnnualVacationBalance")?.markAsDirty();

    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
