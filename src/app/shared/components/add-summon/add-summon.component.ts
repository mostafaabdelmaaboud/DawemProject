import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatRadioModule } from '@angular/material/radio';
import { SummonsService } from 'src/app/Presentation/user/summons/services/summons.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  titleClose: string;
  setAsActive: string;
  titleNotes: string,
  placeholdeNotes: string,
  ValidationNotes: string,
  Titlesaturday: string,

  labelRadioButton: string;
  firstRadio: string;
  secondRadio: string;
  thirdRadio: string;

  titleDepartmentId: string;
  placeholdeDepartmentId: string;
  ValidationDepartmentId: string;

  titleFieldDisabled: string;
  placeholdeieldDisabled: string;

  titleEmployeeId: string;
  placeholdeEmployeeId: string;
  ValidationEmployeeId: string;

  titleGroupId: string;
  placeholdeGroupId: string;
  ValidationGroupId: string;

  titleSanaction: string;
  placeholdeSanaction: string;
  ValidationSanaction: string;

  titleCalendar: string;
  placeholderCalendar: string;
  validationCalendar: string;


  message: string,
  title: string;
  buttonSend: string,
  buttonClose: string,

}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-add-summon',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatRadioModule, MultiSelectModule, MatProgressSpinnerModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-summon.component.html',
  styleUrls: ['./add-summon.component.scss']
})
export class AddSummonComponent {
  loading = false;


  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  list: any[] = [
  ];
  @Input() editSummon!: boolean;
  @Input() id!: string;

  listEmployeeId: any[] = [
  ];
  listGroupId: any[] = [
  ];
  listDepartmentId: any[] = [
  ];
  listSanctions: any[] = [];
  forAllEmployees = false;
  private summonsService = inject(SummonsService);
  listTimeType:any[] = [];
  listnotifyWays:any[] = [];
  employeeIdToggle = true;
  groupIdToggle = false;
  departmentIdToggle = false;

  weekDays: any[] = [];
  addBranchGroupForm: FormGroup = this.fb.group({
    isActive: [false],
    fieldDisabled: [""],

    forType: ['0', Validators.required],
    forAllEmployees: [false],
    
    allowedTime: ['', [Validators.required, Validators.min(1)]],
    TimeType:['', Validators.required],
    notifyWays:['', Validators.required],
    Employees: ['', Validators.required],

    Sanctions: ["", Validators.required],
    LocalDateAndTime: ['', [Validators.required,this.dateTimeValidator()]]

  });
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  constructor(
    public dialogRef: MatDialogRef<AddSummonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loading = true;
    let employeesDropdown = this.summonsService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });

    let groupsForDropdown = this.summonsService.groupsForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let departmentForDropdown = this.summonsService.departmentForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let sanctionForDropdown = this.summonsService.sanctionForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });


this.listTimeType = [
  { name: "ثانيه", key: 0 },
  { name: "دقيقه", key: 1 },
  { name: "ساعه", key: 2 }
]
this.listnotifyWays = [
  { name: "تنبيه عن طريق رسالة", key: 0 },
  { name: "تنبيه علي البريد الالكتروني", key: 1 }
]
  this.addBranchGroupForm.get("TimeType")?.setValue({ name: "ثانيه", key: 0 });
    combineLatest({
      employeesDropdown,
      groupsForDropdown,
      departmentForDropdown,
      sanctionForDropdown
    }).subscribe(
      {
        next: data => {



          this.listEmployeeId = [];
          this.listGroupId = [];
          this.listDepartmentId = [];
          this.listSanctions = [];

          data.employeesDropdown?.data?.forEach((day: any) => {
            this.listEmployeeId.push({ name: day.name, key: day.id });

          });
          data.groupsForDropdown?.data?.forEach((day: any) => {
            this.listGroupId.push({ name: day.name, key: day.id });

          });
          data.departmentForDropdown?.data?.forEach((day: any) => {
            this.listDepartmentId.push({ name: day.name, key: day.id });

          });
          data.sanctionForDropdown?.data?.forEach((day: any) => {
            this.listSanctions.push({ name: day.name, key: day.id });

          });
          this.loading = true;

          if (this.editSummon) {
            this.summonsService.summonGetById({ summonId: this.id }).subscribe(
              {
                next: data => {
                  
                  this.getControl("isActive")?.setValue(data.isActive);

                  this.getControl("LocalDateAndTime")?.setValue(new Date(data.localDateAndTime));
                  this.getControl("allowedTime")?.setValue(data.allowedTime);

                  this.getControl("forAllEmployees")?.setValue(data.forAllEmployees ? true : false);
                  
                  if(!data.forAllEmployees) {

                    if (data.employees != null) {
                      // this.summonsService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.employees }).subscribe(dataDropdown => {
                      //   this.listEmployeeId = [];
                      //   dataDropdown.data?.forEach((list: any) => {
                      //     this.listEmployeeId.push({ name: list.name, key: list.id });
                      //   });
                      //   let indexEmployeeId = this.listEmployeeId.findIndex(list => list.key === data.employeeId);
                      //   if (indexEmployeeId >= 0) {
                      //     this.getControl("Employees")?.setValue(this.listEmployeeId[indexEmployeeId]);
  
                      //   }
  
                      // });
                      this.summonsService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0, ids: data?.employees }).subscribe(dataDropdown => {
                        this.listEmployeeId = [];
                        dataDropdown.data?.forEach((list: any) => {
                          this.listEmployeeId.push({ name: list.name, key: list.id });
                        });
                        data?.employees?.forEach((employee: any) => {
                          let indexEmployee = this.listEmployeeId.findIndex(list => list.key === employee);
                          if (indexEmployee >= 0) {
                            if (Array.isArray(this.getControl("Employees")?.value)) {
                              this.getControl("Employees")?.patchValue(([{ name: this.listEmployeeId[indexEmployee].name, key: this.listEmployeeId[indexEmployee].key }, ...this.getControl("Employees")?.value]));
                            } else {
                              this.getControl("Employees")?.patchValue(([{ name: this.listEmployeeId[indexEmployee].name, key: this.listEmployeeId[indexEmployee].key }]));
                            }
                          }
                        });
    
                      });
                    }
                    if (data.groups != null) {
                      // this.summonsService.groupsForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.groupId }).subscribe(dataDropdown => {
                      //   this.listGroupId = [];
                      //   dataDropdown.data?.forEach((list: any) => {
                      //     this.listGroupId.push({ name: list.name, key: list.id });
                      //   });
                      //   let indexGroupId = this.listGroupId.findIndex(list => list.key === data.groupId);
                      //   if (indexGroupId >= 0) {
                      //     this.getControl("Groups")?.setValue(this.listGroupId[indexGroupId]);
  
                      //   }
  
                      // });
                      this.summonsService.groupsForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, ids: data?.groups }).subscribe(dataDropdown => {
                        this.listGroupId = [];
                        dataDropdown.data?.forEach((list: any) => {
                          this.listGroupId.push({ name: list.name, key: list.id });
                        });
                        data?.groups?.forEach((employee: any) => {
                          let indexGroup = this.listGroupId.findIndex(list => list.key === employee);
                          if (indexGroup >= 0) {
                            if (Array.isArray(this.getControl("Groups")?.value)) {
                              this.getControl("Groups")?.patchValue(([{ name: this.listGroupId[indexGroup].name, key: this.listGroupId[indexGroup].key }, ...this.getControl("Groups")?.value]));
                            } else {
                              this.getControl("Groups")?.patchValue(([{ name: this.listGroupId[indexGroup].name, key: this.listGroupId[indexGroup].key }]));
                            }
                          }
                        });
    
                      });
                    }
                    if (data.departments != null) {
                      // this.summonsService.departmentForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.departments }).subscribe(dataDropdown => {
                      //   this.listDepartmentId = [];
                      //   dataDropdown.data?.forEach((list: any) => {
                      //     this.listDepartmentId.push({ name: list.name, key: list.id });
                      //   });
                      //   let indexlistDepartmentId = this.listDepartmentId.findIndex(list => list.key === data.departmentId);
                      //   if (indexlistDepartmentId >= 0) {
                      //     this.getControl("Departments")?.setValue(this.listDepartmentId[indexlistDepartmentId]);
  
                      //   }
  
                      // });
                      this.summonsService.departmentForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, ids: data?.departments }).subscribe(dataDropdown => {
                        this.listDepartmentId = [];
                        dataDropdown.data?.forEach((list: any) => {
                          this.listDepartmentId.push({ name: list.name, key: list.id });
                        });
                        data?.departments?.forEach((department: any) => {
                          let indexDepartment = this.listDepartmentId.findIndex(list => list.key === department);
                          if (indexDepartment >= 0) {
                            if (Array.isArray(this.getControl("Departments")?.value)) {
                              this.getControl("Departments")?.patchValue(([{ name: this.listDepartmentId[indexDepartment].name, key: this.listDepartmentId[indexDepartment].key }, ...this.getControl("Departments")?.value]));
                            } else {
                              this.getControl("Departments")?.patchValue(([{ name: this.listDepartmentId[indexDepartment].name, key: this.listDepartmentId[indexDepartment].key }]));
                            }
                          }
                        });
    
                      });
                    }

                  }
                  this.summonsService.sanctionForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, ids: data?.sanctions }).subscribe(dataDropdown => {
                      this.listSanctions = [];
                      dataDropdown.data?.forEach((list: any) => {
                        this.listSanctions.push({ name: list.name, key: list.id });
                      });
                      data?.sanctions?.forEach((employee: any) => {
                        let indexSanction = this.listSanctions.findIndex(list => list.key === employee);
                        if (indexSanction >= 0) {
                          if (Array.isArray(this.getControl("Sanctions")?.value)) {
                            this.getControl("Sanctions")?.patchValue(([{ name: this.listSanctions[indexSanction].name, key: this.listSanctions[indexSanction].key }, ...this.getControl("Sanctions")?.value]));
                          } else {
                            this.getControl("Sanctions")?.patchValue(([{ name: this.listSanctions[indexSanction].name, key: this.listSanctions[indexSanction].key }]));
                          }
                        }
                      });
  
                    });
                    data?.notifyWays?.forEach((notifyWay: any) => {
                      let indexnotifyWays = this.listnotifyWays.findIndex(list => list.key === notifyWay);
                      if (indexnotifyWays >= 0) {
                        if (Array.isArray(this.getControl("notifyWays")?.value)) {
                          this.getControl("notifyWays")?.patchValue(([{ name: this.listnotifyWays[indexnotifyWays].name, key: this.listnotifyWays[indexnotifyWays].key }, ...this.getControl("notifyWays")?.value]));
                        } else {
                          this.getControl("notifyWays")?.patchValue(([{ name: this.listnotifyWays[indexnotifyWays].name, key: this.listnotifyWays[indexnotifyWays].key }]));
                        }
                      }
                    });
                  this.getControl("forType")?.setValue(data.forType.toString());
                  this.getControl("fieldDisabled")?.setValue(data.code);
                  this.getControl("timeType")?.setValue(data.code);
                  let indexlistTimeType = this.listTimeType.findIndex(list => list.key === data.timeType);
                    if (indexlistTimeType >= 0) {
                      this.getControl("TimeType")?.setValue(this.listTimeType[indexlistTimeType]);

                    }
                  
                  // this.summonsService.sanctionForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.scheduleId }).subscribe(dataDropdown => {
                  //   this.listSanctions = [];
                  //   dataDropdown.data?.forEach((list: any) => {
                  //     this.listSanctions.push({ name: list.name, key: list.id });
                  //   });
                  //   let indexGroupManager = this.listSanctions.findIndex(list => list.key === data.scheduleId);
                  //   if (indexGroupManager >= 0) {
                  //     this.getControl("Sanctions")?.setValue(this.listSanctions[indexGroupManager]);

                  //   }

                  // });
            
                  this.loading = false;
                },
                error: err => {
                  this.loading = false;
                }
              }
            )

          }
          if (!this.editSummon) {
            this.loading = false;

          }

        },
        error: err => {
          this.loading = false;

        }
      }
    )
    this.addBranchGroupForm.get("forType")?.valueChanges.subscribe(data => {
      
      if (data === "0") {
        this.addBranchGroupForm.removeControl("Groups");
        this.addBranchGroupForm.removeControl("Departments");

        this.addBranchGroupForm.addControl("Employees", this.fb.control("", [Validators.required]));
        this.employeeIdToggle = true;
        this.groupIdToggle = false;
        this.departmentIdToggle = false;





      } else if (data === "1") {

        this.addBranchGroupForm.removeControl("Employees");
        this.addBranchGroupForm.removeControl("Departments");

        this.addBranchGroupForm.addControl("Groups", this.fb.control("", [Validators.required]));
        this.employeeIdToggle = false;
        this.groupIdToggle = true;
        this.departmentIdToggle = false;

      } else if (data === "2") {
        this.addBranchGroupForm.removeControl("Employees");
        this.addBranchGroupForm.removeControl("Groups");

        this.addBranchGroupForm.addControl("Departments", this.fb.control("", [Validators.required]));
        this.employeeIdToggle = false;
        this.groupIdToggle = false;
        this.departmentIdToggle = true;
      }


    })
    this.addBranchGroupForm.get("forAllEmployees")?.valueChanges.subscribe(data => {
      if (data) {
        this.forAllEmployees = true;
        this.addBranchGroupForm.removeControl("forType");
        this.addBranchGroupForm.removeControl("Departments");
        this.addBranchGroupForm.removeControl("Employees");
        this.employeeIdToggle = true;
        this.groupIdToggle = false;
        this.departmentIdToggle = false;
      } else  {
        this.forAllEmployees = false;
        this.addBranchGroupForm.addControl("forType", this.fb.control("0", [Validators.required]));
        this.addBranchGroupForm.removeControl("Groups");
        this.addBranchGroupForm.removeControl("Departments");
        this.addBranchGroupForm.addControl("Employees", this.fb.control("", [Validators.required]));
        this.employeeIdToggle = true;
        this.groupIdToggle = false;
        this.departmentIdToggle = false;
        this.addBranchGroupForm.get("forType")?.valueChanges.subscribe(data => {
          
          if (data === "0") {
            this.addBranchGroupForm.removeControl("Groups");
            this.addBranchGroupForm.removeControl("Departments");
    
            this.addBranchGroupForm.addControl("Employees", this.fb.control("", [Validators.required]));
            this.employeeIdToggle = true;
            this.groupIdToggle = false;
            this.departmentIdToggle = false;
    
    
    
    
    
          } else if (data === "1") {
    
            this.addBranchGroupForm.removeControl("Employees");
            this.addBranchGroupForm.removeControl("Departments");
    
            this.addBranchGroupForm.addControl("Groups", this.fb.control("", [Validators.required]));
            this.employeeIdToggle = false;
            this.groupIdToggle = true;
            this.departmentIdToggle = false;
    
          } else if (data === "2") {
            this.addBranchGroupForm.removeControl("Employees");
            this.addBranchGroupForm.removeControl("Groups");
    
            this.addBranchGroupForm.addControl("Departments", this.fb.control("", [Validators.required]));
            this.employeeIdToggle = false;
            this.groupIdToggle = false;
            this.departmentIdToggle = true;
          }
    
    
        })

      }


    })
  }
  dateTimeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const now = new Date();
  
      // تحقق من أن التاريخ أو الوقت المحدد ليس في الماضي
      return selectedDate >= now ? null : { invalidDateTime: true };
    };
  }
  nodeSelect(data: any) {
  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'Employees':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.summonsService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listEmployeeId = [];
                this.lastSearchQuery = "";
                res.data?.forEach((day: any) => {
                  this.listEmployeeId.push({ name: day.name, key: day.id });
                });
              });
          }
        }
        break;

      case 'Groups':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.summonsService.groupsForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listGroupId = [];
                this.lastSearchQuery = "";
                res.data?.forEach((day: any) => {
                  this.listGroupId.push({ name: day.name, key: day.id });
                });


              });
          }

        }
        break;
      case 'Departments':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.summonsService.departmentForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listDepartmentId = [];
                this.lastSearchQuery = "";
                res.data?.forEach((day: any) => {
                  this.listDepartmentId.push({ name: day.name, key: day.id });
                });


              });
          }

        }
        break;
      case 'Sanctions':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.summonsService.sanctionForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listSanctions = [];
                res.data?.forEach((day: any) => {


                  this.listSanctions.push({ name: day.name, key: day.id });

                });


              });
          }

        }
        break;

      default:
        break;
    }
  }
  getControl(controlName: string) {
    return this.addBranchGroupForm?.get(controlName);
  }

  request() {
  this.addBranchGroupForm?.get("LocalDateAndTime")?.setValue(this.addBranchGroupForm?.get("LocalDateAndTime")?.value);
  if(this.addBranchGroupForm?.get("LocalDateAndTime")?.invalid) {
    this.toast.error("عفوا لا يمكن تسجيل استدعاء لوقت مضى");

  }
  if (this.addBranchGroupForm.valid && this.submitted) {
      this.submitted = false;
      this.submitClicked.emit(this.addBranchGroupForm.value);
      // this.dialogRef.close(true);
    } else {
      this.getControl("forType")?.markAsDirty();
      this.getControl("Employees")?.markAsDirty();
      this.getControl("Groups")?.markAsDirty();
      this.getControl("Sanctions")?.markAsDirty();
      this.getControl("LocalDateAndTime")?.markAsDirty();
      this.getControl("Departments")?.markAsDirty();
      this.getControl("allowedTime")?.markAsDirty();
      this.getControl("notifyWays")?.markAsDirty();
      this.getControl("TimeType")?.markAsDirty();
    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
