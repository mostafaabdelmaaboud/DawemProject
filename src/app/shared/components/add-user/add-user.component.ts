import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
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
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { AssignmentsService } from 'src/app/Presentation/user/assignments/services/assignments.service';
import { CheckboxModule } from 'primeng/checkbox';
import { UsersService } from 'src/app/Presentation/user/users/services/users.service';
import { ToastrService } from 'ngx-toastr';

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



  titleNotes: string;
  placeholdeNotes: string;
  NotesValidation: string;

  titleName: string;
  placeholdeName: string;
  nameValidation: string;

  titleEmail: string;
  placeholdeEmail: string;
  EmailValidation: string;

  titlePassword: string;
  placeholdePassword: string;
  PasswordValidation: string;

  Roles: string;
  placeholdeRoles: string;
  ValidationRoles: string;


  titleConfirmPassword: string;
  placeholdeConfirmPassword: string;
  ConfirmPasswordValidation: string;

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
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule, MatProgressSpinnerModule, MatRadioModule, MultiSelectModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  togglePassword = true;
  toggleConfirmPassword = true;

  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  @Input() list: any[] = [
  ];
  @Input() workTeamList: any[] = [
  ];
  @Input() id!: string;
  code="+966";
  countriesPhone: any[] = [];
  isCurrentCountry;
  viewImagesIdCopy: any[] = [];
  imageArray: any[] = [];
  errorUploadFileIdCopyIsRequired!: string;
  errorUploadFileIdCopy!: string;
  public viewImage: any[] = [];

  listEmployees: any[] = [
  ];
  loading = false;
  private employeesService = inject(EmployeesService);
  listRoles: any[] = [];
  @Input() editUser!: boolean;
  addBranchGroupForm: FormGroup = this.fb.group({
    Roles: ["", Validators.required],
    EmployeeId: ["", Validators.required],
    IsAdmin: [false]

  });
  uploadImages = false;
  AttachmentsFiles: any[] = [];
  requiredCommercialRegFiles = false;
  toggleForEmployee = false;
  private assignmentsService = inject(AssignmentsService);
  private usersService = inject(UsersService);


  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public translate: TranslateService,

  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

   
    let rolesDropDown = this.usersService.getRolesDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let employeeForDropDown = this.employeesService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let countries = this.authService.getCountries({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });

    combineLatest({
      rolesDropDown,
      employeeForDropDown,
      countries
    }).subscribe(data => {
      this.listRoles = [];
      this.listEmployees = [];

      data.rolesDropDown?.data?.forEach((jobTitle: any) => {
        this.listRoles.push({ name: jobTitle.name, key: jobTitle.id })
      });

      data.employeeForDropDown?.data?.forEach((jobTitle: any) => {
        this.listEmployees.push({ name: jobTitle.name, key: jobTitle.id })
      });
      this.countriesPhone = [];
      data.countries?.forEach((country: any) => {
        
        this.countriesPhone.push({ name: country.name,dial:country.dial,phoneLength:country.phoneLength, id: country.id, flagPath:country.flagPath });
        if(country.isCurrentCountry) {
          this.isCurrentCountry = { name: country.name,dial:country.dial,phoneLength:country.phoneLength, id: country.id, flagPath:country.flagPath };
        }
      });
      if (this.editUser) {


        this.usersService.userGetById({ userId: this.id }).subscribe(
          {
            next: data => {


              // if (data?.files.length) {
              //   data?.files.forEach((attachment: any) => {
              //     this.employeesService.downloadImage(attachment.filePath).subscribe(response => {
              //       const blob = new Blob([response]);
              //       const file = new File([blob], attachment.fileName);

              //       this.AttachmentsFiles.push({ imageSrc: attachment.filePath, fileUpload: file, detailsImage: true });
              //     });
              //   });
              // }
              

              // IsActive: [false],
              //   Name: ["", Validators.required],
              //     Email: ["", [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
              //       Password: ["", [Validators.required, Validators.minLength(5)]],
              //         ConfirmPassword: ["", [Validators.required, Validators.minLength(5), , this.passwordMatchValidator()]],

              //             Roles: [""],

              //               EmployeeId: ["", Validators.required],
              //                 IsAdmin: [],
              // this.addBranchGroupForm.get("Password")?.setValue(data.isNecessary);
              // this.addBranchGroupForm.get("ConfirmPassword")?.setValue(data.isNecessary);
           
              let findIndexCountryCode = this.countriesPhone.findIndex(country => country.id === data.mobileCountryId);
              if(findIndexCountryCode>=0) {
                this.isCurrentCountry = this.countriesPhone[findIndexCountryCode];
              }
              this.addBranchGroupForm.get("IsAdmin")?.setValue(data.isAdmin);

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
              this.usersService.getRolesDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, ids: data?.responsibilities }).subscribe(dataDropdown => {
                this.listRoles = [];
                dataDropdown.data?.forEach((list: any) => {
                  this.listRoles.push({ name: list.name, key: list.id });
                });
                data?.responsibilities?.forEach((responsibility: any) => {
                  let indexRole = this.listRoles.findIndex(list => list.key === responsibility);
                  if (indexRole >= 0) {
                    if (Array.isArray(this.getControl("Roles")?.value)) {
                      this.getControl("Roles")?.patchValue(([{ name: this.listRoles[indexRole].name, key: this.listRoles[indexRole].key }, ...this.getControl("Roles")?.value]));
                    } else {
                      this.getControl("Roles")?.patchValue(([{ name: this.listRoles[indexRole].name, key: this.listRoles[indexRole].key }]));
                    }
                  }

                });

              });

              this.loading = false;
            },
            error: err => {
              this.loading = false;
            }
          }
        )

      }
      if (!this.editUser) {
        this.loading = false;

      }

    })
    if (!this.editUser) {
      this.addBranchGroupForm.addControl("Password", this.fb.control("", [Validators.required, Validators.minLength(5)]));
      this.addBranchGroupForm.addControl("ConfirmPassword", this.fb.control("",  [Validators.required, Validators.minLength(5),this.passwordMatchValidator()]))

      this.loading = false;
      
    }
  }

  getCountriesbyPhone() {
    this.authService.getCountries({ PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe({
      next: data => {
        this.countriesPhone = [];
        data.forEach((country: any) => {          
          this.countriesPhone.push({ name: country.name,dial:country.dial,phoneLength:country.phoneLength, id: country.id, flagPath:country.flagPath });
          if(country.isCurrentCountry) {
            this.isCurrentCountry = { name: country.name,dial:country.dial,phoneLength:country.phoneLength, id: country.id, flagPath:country.flagPath };
          }
        });
      },
      error: err => {
      }
    });
  }
  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      let passwordMismatch = false;
      if (value != "") {
        passwordMismatch = this.getControl('Password')?.value != value;

      }
      return passwordMismatch ? { passwordMismatch: true } : null;
    };
  }
  getControl(controlName: string) {
    return this.addBranchGroupForm?.get(controlName);
  }

  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'AssignmentTypeId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.assignmentsService.assignmentTypeDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.list = [];
                this.lastSearchQuery = "";
                res?.data?.forEach((item: any) => {
                  this.list.push({ name: item.name, key: item.id })
                });
              });
          }

        }
        break;
      case 'Roles':
        if (data || data === "") {

          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.usersService.getRolesDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listRoles = [];
                this.lastSearchQuery = "";

                res?.data?.forEach((jobTitle: any) => {
                  this.listRoles.push({ name: jobTitle.name, key: jobTitle.id })
                });
              });
          }

        }
        // let rolesDropDown = this.usersService.getRolesDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
        // this.listRoles = [];
        // this.listEmployees = [];
  
        // data.rolesDropDown?.data?.forEach((jobTitle: any) => {
        //   this.listRoles.push({ name: jobTitle.name, key: jobTitle.id })
        // });
        break;
      default:
        break;
    }
  }

  request() {

    this.submitted = true;

    if (this.addBranchGroupForm.valid && this.submitted) {
      this.submitted = false;
      this.submitClicked.emit({ ...this.addBranchGroupForm.value});
    } else {

      this.getControl("Password")?.markAsDirty();
      this.getControl("ConfirmPassword")?.markAsDirty();
      this.getControl("Roles")?.markAsDirty();
      this.getControl("EmployeeId")?.markAsDirty();
    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
