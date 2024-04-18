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
import { EMPTY, Subject, combineLatest, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { SectionsService } from 'src/app/Presentation/user/sections/services/sections.service';
import { ToastrService } from 'ngx-toastr';

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
  imports: [CommonModule, FormsModule, MatRadioModule, MatProgressSpinnerModule,MultiSelectModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './dialog-add-an-employee.component.html',
  styleUrls: ['./dialog-add-an-employee.component.scss']
})
export class DialogAddAnEmployeeComponent {
  loading = false;
  private employeesService = inject(EmployeesService);
  private sectionsService = inject(SectionsService);
  @Input() departmentIsReadOnly = false;
  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  @Input() jobTitleFirst: any[] = [];

  @Input() sectionList: any[] = [];
  @Input() workScheduleList: any[] = [];
  @Input() editEmployee!: boolean;
  @Input() id!: string;
  @Input() departmentID!: any;
  code="+966";
  countriesPhone: any[] = [];
  isCurrentCountry;
  viewImagesIdCopy: any[] = [];
  imageArray: any[] = [];
  errorUploadFileIdCopyIsRequired!: string;
  errorUploadFileIdCopy!: string;
  public viewImage: any[] = [];

  listDirectManager: any[] = [];
  listZones: any[] = [];


  addBranchGroupForm: FormGroup = this.fb.group({
    AttendanceType: ['0'],
    employeeType: ['0'],
    ScheduleId: [''],
    isActive: [false],
    name: ['', Validators.required],
    employeeNumber: ['', [Validators.required, Validators.min(0)]],
    JobTitleId: ['', Validators.required],
    DepartmentId: ['', Validators.required],
    JoiningDate: ['', Validators.required],
    directManager: ['', Validators.required],
    mobileNumber: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    address: ['', Validators.required],
    fieldDisabled: [''],
    zoneIds: ['', Validators.required],
    idCopyFile: ['', Validators.required]
  });
  AttachmentsFiles: any[] = [];
  requiredCommercialRegFiles = false;
  constructor(
    public dialogRef: MatDialogRef<DialogAddAnEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private toastr: ToastrService,
    public translate: TranslateService,
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
    let GetForDropDownZones = this.sectionsService.GetForDropDownZones({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let countries = this.authService.getCountries({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });

    this.authService.getCountries({ PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe({
      next: data => {
   
      },
      error: err => {
      }
    });
    combineLatest({
      employeeForDropDown,
      employeesService,
      departmentGetForDropDown,
      GetForDropDownZones,
      countries,
      scheduleForDropDown
    }).subscribe(data => {
      this.jobTitleFirst = [];
      this.sectionList = [];
      this.workScheduleList = [];
      this.listZones = [];

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
  
      this.countriesPhone = [];
      data.countries?.forEach((country: any) => {        
        this.countriesPhone.push({ name: country.name,dial:country.dial,phoneLength:country.phoneLength, id: country.id, flagPath:country.flagPath });
        if(country.isCurrentCountry) {
          this.isCurrentCountry = { name: country.name,dial:country.dial,phoneLength:country.phoneLength, id: country.id,flagPath:country.flagPath  };
          this.selectCountry();
        }
      });
      if (this.editEmployee) {


        this.employeesService.employeeGetById({ employeeId: this.id }).subscribe(
          {
            next: data => {
              this.sectionsService.GetForDropDownZones({ PagingEnabled: true, PageSize: 5, PageNumber: 0, ids:data?.zoneIds}).subscribe(datainside => {
                this.listZones = [];
                datainside?.data?.forEach((day: any) => {
                  this.listZones.push({ name: day.name, key: day.id });
                });

                data?.zoneIds?.forEach((zone: any) => {
                  let indexZones = this.listZones.findIndex(list => list.key === zone);
                  if (indexZones >= 0) {
                    if (Array.isArray(this.getControl("zoneIds")?.value)) {
                      this.getControl("zoneIds")?.patchValue(([{ name: this.listZones[indexZones].name, key: this.listZones[indexZones].key }, ...this.getControl("zoneIds")?.value]));
                    } else {
                      this.getControl("zoneIds")?.patchValue(([{ name: this.listZones[indexZones].name, key: this.listZones[indexZones].key }]));
                    }
                  }
                });
              });

              if (data?.profileImagePath) {
                var validExts = new Array(".xlsx", ".xls", ".pdf", ".png", ".jpeg",".gif");
                let fileExt = data.profileImageName.substring(data.profileImageName.lastIndexOf('.'));
                if(validExts.indexOf(fileExt?.toLowerCase()) >= 0) {
                  let file!:File;
                  if(fileExt?.toLowerCase().includes("xlsx") || fileExt?.toLowerCase().includes("xls")) {
                     file = new File([data?.profileImagePath], `excel-file${validExts}`, {
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    this.viewImagesIdCopy = ["assets/img/excel.png"];
                  } else if(fileExt?.toLowerCase().includes("pdf")) {
                     file = new File([data?.profileImagePath], `pdf-file${validExts}`, {
                      type: 'application/pdf',
                    });
                    this.viewImagesIdCopy=["assets/img/pdf.png"];
                  } else if(fileExt?.toLowerCase().includes("png") || fileExt?.toLowerCase().includes("jpeg") || fileExt?.toLowerCase().includes("gif")) {
                     file = new File([data?.profileImagePath],`img-file${validExts}`, {
                      type: 'image/' +fileExt.slice(fileExt.indexOf('.') + 1, fileExt.length).toLowerCase(),
                    });
                    this.viewImagesIdCopy=[data?.profileImagePath];
                  }
                  this.AttachmentsFiles=[{ fileUpload: {
                    ...file,
                    lastModified:file.lastModified,
                    size:file.size,
                    type:file.type,
                    name:data.profileImageName,
                  }, detailsImage: true }];
                  this.addBranchGroupForm.get("idCopyFile")?.setValue(data.profileImageName);

                }
                // this.uploadedFiles.push({ imageSrc: data.profileImagePath, fileUpload: {
                //   name:data.profileImageName
                // }, detailsImage: true });

                // this.employeesService.downloadImage(data.profileImagePath).subscribe(response => {
                //   const blob = new Blob([response]);
                //   const file = new File([blob], data.profileImageName);

                //   this.uploadedFiles.push({ imageSrc: data.profileImagePath, fileUpload: file, detailsImage: true });
                // });
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

              let findIndexCountryCode = this.countriesPhone.findIndex(country => country.id === data.mobileCountryId);
              if(findIndexCountryCode>=0) {
                this.isCurrentCountry = this.countriesPhone[findIndexCountryCode];
                this.selectCountry();
              }
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
        data.GetForDropDownZones?.data?.forEach((day: any) => {
          this.listZones.push({ name: day.name, key: day.id });
        });
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
            // if(this.departmentIsReadOnly) {
            //   this.addBranchGroupForm.get("DepartmentId").read
            // }
          });
        }
     
      }

    })
    // this.getCountriesbyPhone();
  } 
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'JobTitleId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.employeesService.getJobTitles({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.jobTitleFirst = [];
                this.lastSearchQuery = "";

                res?.data?.forEach((jobTitle: any) => {
                  this.jobTitleFirst.push({ name: jobTitle.name, key: jobTitle.id })
                });
              });
          }

        }
        break;
      case 'directManager':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.employeesService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listDirectManager = [];
                this.lastSearchQuery = "";

                res?.data?.forEach((jobTitle: any) => {
                  this.listDirectManager.push({ name: jobTitle.name, key: jobTitle.id })
                });
              });
          }



        }

        break;
      case 'DepartmentId':
        if (data || data === "") {

          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.employeesService.getDepartmentForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.sectionList = [];
                this.lastSearchQuery = "";

                res?.data?.forEach((jobTitle: any) => {
                  this.sectionList.push({ name: jobTitle.name, key: jobTitle.id })
                });
              });
          }

        }
        break;
      case 'ScheduleId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.employeesService.getScheduleForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.workScheduleList = [];
                this.lastSearchQuery = "";

                res?.data?.forEach((jobTitle: any) => {
                  this.workScheduleList.push({ name: jobTitle.name, key: jobTitle.id })
                });
              });
          }

        }

        break;
        case 'zoneIds':
          if (data || data === "") {
            if (data !== this.lastSearchQuery || data === "") {
              this.lastSearchQuery = data;
              this.sectionsService.GetForDropDownZones({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
                debounceTime(300),
                distinctUntilChanged()).subscribe((res: any) => {
                  this.listZones = [];
                  this.lastSearchQuery = "";
                  res.data?.forEach((day: any) => {
                    this.listZones.push({ name: day.name, key: day.id });
                  });
  
  
                });
            }
  
          }
          break;
      default:
        break;
    }
  }
  selectCountry() {
    const pattern = new RegExp(`^\\d{${this.isCurrentCountry.phoneLength}}$`);
    this.addBranchGroupForm.get("mobileNumber")?.setValidators([Validators.required, Validators.pattern(pattern)])
    this.code= "+"+this.isCurrentCountry.phoneLength;
  }
  getCountriesbyPhone() {
    this.authService.getCountries({ PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe({
      next: data => {
        this.countriesPhone = [];
        data.forEach((country: any) => {
          
          this.countriesPhone.push({ name: country.name,dial:country.dial,phoneLength:country.phoneLength, id: country.id, flagPath:country.flagPath  });
          if(country.isCurrentCountry) {
            this.isCurrentCountry = { name: country.name,dial:country.dial,phoneLength:country.phoneLength, id: country.id, flagPath:country.flagPath  };
            this.selectCountry();
          }
        });
      },
      error: err => {
      }
    });
  }
  onRemoveCommercialReg(event: any) {
    
    let indexFile = this.AttachmentsFiles.findIndex(item => item.fileUpload.lastModified === event.lastModified);
    this.AttachmentsFiles.splice(indexFile, 1)
    this.AttachmentsFiles.length === 0 ? this.requiredCommercialRegFiles = true : this.requiredCommercialRegFiles = false;
    if(this.requiredCommercialRegFiles) {
      this.addBranchGroupForm.get("idCopyFile")?.setValue("");

    }
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
              this.viewImage=[pFileList.files[index]];
              this.AttachmentsFiles=[{fileUpload:pFileList.files[index], detailsImage: false}];
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
              var validExts = new Array(".xlsx", ".xls");
              let fileExt = this.viewImage[index]?.name.substring(this.viewImage[index]?.name.lastIndexOf('.'));
              await filereaderTwo.readAsDataURL(this.viewImage[index]);
              filereaderTwo.onload = () => {
                if((filereaderTwo.result as string).includes("application/pdf")) {
                  this.imageArray =["assets/img/pdf.png"];
                } else if(validExts.indexOf(fileExt) >= 0) {
                  this.imageArray=["assets/img/excel.png"];
                } else {
                  this.imageArray= [filereaderTwo.result];
                }
                this.viewImagesIdCopy = this.imageArray;
              }
              this.addBranchGroupForm.get("idCopyFile")?.setValue(this.viewImage[0]?.name);
              this.errorUploadFileIdCopyIsRequired = "";
            }
          }
          if(findIndexFileName.length > 1) {
            this.errorUploadFileIdCopy = "The file is duplicate";
          }
        }
        if(this.errorUploadFileIdCopy === "") {
          this.toastr.success("Successfully upload!", '', {
            timeOut: 5000,
            onActivateTick: true
          });        
        }

      } else {
        this.errorUploadFileIdCopyIsRequired = "You can only select up to 5 files.";
      }
    } else {
      this.errorUploadFileIdCopyIsRequired = "You can only select up to 5 files.";
    }
  }
  getControl(controlName: string) {
    return this.addBranchGroupForm?.get(controlName);
  }

  request() {
    
    if (this.addBranchGroupForm.valid && this.submitted) {
      this.submitted = false;
      this.submitClicked.emit({ ...this.addBranchGroupForm.value, files: this.AttachmentsFiles });
      // this.dialogRef.close(true);
    } else {
      this.getControl("name")?.markAsDirty();
      this.getControl("employeeNumber")?.markAsDirty();
      this.getControl("fieldFirst")?.markAsDirty();
      this.getControl("JobTitleId")?.markAsDirty();
      this.getControl("DepartmentId")?.markAsDirty();
      this.getControl("JoiningDate")?.markAsDirty();
      this.getControl("directManager")?.markAsDirty();
      this.getControl("mobileNumber")?.markAsDirty();
      this.getControl("email")?.markAsDirty();
      this.getControl("address")?.markAsDirty();
      this.getControl("zoneIds")?.markAsDirty();
      this.getControl("idCopyFile")?.markAsDirty();

    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
