import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
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
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { AssignmentsService } from 'src/app/Presentation/user/assignments/services/assignments.service';
import { CheckboxModule } from 'primeng/checkbox';
import { UsersService } from 'src/app/Presentation/user/users/services/users.service';

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

  listEmployees: any[] = [
  ];
  loading = false;
  private employeesService = inject(EmployeesService);
  listRoles: any[] = [];
  @Input() editUser!: boolean;
  addBranchGroupForm: FormGroup = this.fb.group({
    IsActive: [false],
    Name: ["", Validators.required],
    Email: ["", [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    Password: ["", [Validators.required, Validators.minLength(5)]],
    ConfirmPassword: ["", [Validators.required, Validators.minLength(5), , this.passwordMatchValidator()]],

    MobileNumber: ["", Validators.required],
    Roles: [""],

    EmployeeId: ["", Validators.required],
    IsAdmin: [false],
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
    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loading = true;

    let rolesDropDown = this.usersService.getRolesDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let employeeForDropDown = this.employeesService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    combineLatest({
      rolesDropDown,
      employeeForDropDown
    }).subscribe(data => {
      this.listRoles = [];
      this.listEmployees = [];

      data.rolesDropDown?.data?.forEach((jobTitle: any) => {
        this.listRoles.push({ name: jobTitle.name, key: jobTitle.id })
      });

      data.employeeForDropDown?.data?.forEach((jobTitle: any) => {
        this.listEmployees.push({ name: jobTitle.name, key: jobTitle.id })
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
              if (data?.profileImagePath) {
                this.employeesService.downloadImage(data.profileImagePath).subscribe(response => {
                  const blob = new Blob([response]);
                  const file = new File([blob], data.profileImageName);

                  this.AttachmentsFiles.push({ imageSrc: data.profileImagePath, fileUpload: file, detailsImage: true });
                });
              }

              // IsActive: [false],
              //   Name: ["", Validators.required],
              //     Email: ["", [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
              //       Password: ["", [Validators.required, Validators.minLength(5)]],
              //         ConfirmPassword: ["", [Validators.required, Validators.minLength(5), , this.passwordMatchValidator()]],

              //           MobileNumber: ["", Validators.required],
              //             Roles: [""],

              //               EmployeeId: ["", Validators.required],
              //                 IsAdmin: [],
              this.addBranchGroupForm.get("Email")?.setValue(data.email);
              // this.addBranchGroupForm.get("Password")?.setValue(data.isNecessary);
              // this.addBranchGroupForm.get("ConfirmPassword")?.setValue(data.isNecessary);
              this.addBranchGroupForm.get("MobileNumber")?.setValue(data.mobileNumber);
              this.addBranchGroupForm.get("IsActive")?.setValue(data.isActive);
              this.addBranchGroupForm.get("IsAdmin")?.setValue(data.isAdmin);
              this.addBranchGroupForm.get("Name")?.setValue(data.name);

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

              this.usersService.getRolesDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, ids: data?.roles }).subscribe(dataDropdown => {



                this.listRoles = [];
                dataDropdown.data?.forEach((list: any) => {
                  this.listRoles.push({ name: list.name, key: list.id });
                });
                data?.roles?.forEach((employee: any) => {



                  let indexRole = this.listRoles.findIndex(list => list.key === employee);


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
  onRemoveCommercialReg(event: any) {

    this.AttachmentsFiles = []
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
          thisParent.AttachmentsFiles = [{ imageSrc: e.target.result, fileUpload: file, detailsImage: false }];
          thisParent.AttachmentsFiles.length === 0 ? thisParent.requiredCommercialRegFiles = true : thisParent.requiredCommercialRegFiles = false

        };

      })(file);



      // this.uploadedCommercialRegFiles.push({ imageSrc: src, fileUpload: file });


    }
    // this.uploadedCommercialRegFiles.length === 0 ? this.requiredCommercialRegFiles = true : this.requiredCommercialRegFiles = false;

    // this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
  request() {

    this.AttachmentsFiles.length === 0 ? this.requiredCommercialRegFiles = true : this.requiredCommercialRegFiles = false
    this.submitted = true;

    if (this.addBranchGroupForm.valid && this.submitted && !this.requiredCommercialRegFiles) {
      this.submitted = false;
      this.submitClicked.emit({ ...this.addBranchGroupForm.value, files: this.AttachmentsFiles });
    } else {

      this.getControl("Name")?.markAsDirty();
      this.getControl("Email")?.markAsDirty();
      this.getControl("Password")?.markAsDirty();
      this.getControl("ConfirmPassword")?.markAsDirty();
      this.getControl("MobileNumber")?.markAsDirty();
      this.getControl("Roles")?.markAsDirty();

      this.getControl("EmployeeId")?.markAsDirty();



    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
