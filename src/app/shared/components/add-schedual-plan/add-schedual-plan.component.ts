import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatRadioModule } from '@angular/material/radio';
import { SchedualPlanService } from 'src/app/Presentation/user/schedual-plan/services/schedual-plan.service';

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

  titleScheduleId: string;
  placeholdeScheduleId: string;
  ValidationScheduleId: string;

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
  selector: 'app-add-schedual-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatRadioModule, MultiSelectModule, MatProgressSpinnerModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-schedual-plan.component.html',
  styleUrls: ['./add-schedual-plan.component.scss']
})
export class AddSchedualPlanComponent {
  loading = false;


  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  list: any[] = [
  ];
  @Input() editSchedualPlan!: boolean;
  @Input() id!: string;

  listEmployeeId: any[] = [
  ];
  listGroupId: any[] = [
  ];
  listDepartmentId: any[] = [
  ];
  listScheduleId: any[] = [];

  private schedualPlanService = inject(SchedualPlanService);


  employeeIdToggle = true;
  groupIdToggle = false;
  departmentIdToggle = false;

  weekDays: any[] = [];
  addBranchGroupForm: FormGroup = this.fb.group({
    isActive: [false],
    fieldDisabled: [""],

    SchedulePlanType: ['0', Validators.required],
    EmployeeId: ['', Validators.required],

    ScheduleId: ["", Validators.required],
    DateFrom: ['', Validators.required],
    notes: ["", Validators.required],

  });
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  constructor(
    public dialogRef: MatDialogRef<AddSchedualPlanComponent>,
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
    let employeesDropdown = this.schedualPlanService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });

    let groupsForDropdown = this.schedualPlanService.groupsForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let departmentForDropdown = this.schedualPlanService.departmentForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let schedualForDropdown = this.schedualPlanService.schedualForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });




    combineLatest({
      employeesDropdown,
      groupsForDropdown,
      departmentForDropdown,
      schedualForDropdown
    }).subscribe(
      {
        next: data => {



          this.listEmployeeId = [];
          this.listGroupId = [];
          this.listDepartmentId = [];
          this.listScheduleId = [];

          data.employeesDropdown?.data?.forEach((day: any) => {
            this.listEmployeeId.push({ name: day.name, key: day.id });

          });
          data.groupsForDropdown?.data?.forEach((day: any) => {
            this.listGroupId.push({ name: day.name, key: day.id });

          });
          data.departmentForDropdown?.data?.forEach((day: any) => {
            this.listDepartmentId.push({ name: day.name, key: day.id });

          });
          data.schedualForDropdown?.data?.forEach((day: any) => {
            this.listScheduleId.push({ name: day.name, key: day.id });

          });
          this.loading = true;

          if (this.editSchedualPlan) {
            
            this.schedualPlanService.schedualPlanGetById({ schedulePlanId: this.id }).subscribe(
              {
                next: data => {

                  // SchedulePlanType: ['0', Validators.required],
                  //   EmployeeId: ['', Validators.required],

                  //     ScheduleId: ["", Validators.required],
                  //       DateFrom: ['', Validators.required],
                  //         notes: ["", Validators.required],
                  this.getControl("isActive")?.setValue(data.isActive);
                  this.getControl("notes")?.setValue(data.notes);

                  this.getControl("DateFrom")?.setValue(new Date(data.dateFrom));

                  this.getControl("SchedulePlanType")?.setValue(data.schedulePlanType.toString());
                  this.getControl("fieldDisabled")?.setValue(data.code);



                  this.schedualPlanService.schedualForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.scheduleId }).subscribe(dataDropdown => {
                    this.listScheduleId = [];
                    dataDropdown.data?.forEach((list: any) => {
                      this.listScheduleId.push({ name: list.name, key: list.id });
                    });
                    let indexGroupManager = this.listScheduleId.findIndex(list => list.key === data.scheduleId);
                    if (indexGroupManager >= 0) {
                      this.getControl("ScheduleId")?.setValue(this.listScheduleId[indexGroupManager]);

                    }

                  });
                  if (data.employeeId != null) {
                    this.schedualPlanService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.employeeId }).subscribe(dataDropdown => {
                      this.listEmployeeId = [];
                      dataDropdown.data?.forEach((list: any) => {
                        this.listEmployeeId.push({ name: list.name, key: list.id });
                      });
                      let indexEmployeeId = this.listEmployeeId.findIndex(list => list.key === data.employeeId);
                      if (indexEmployeeId >= 0) {
                        this.getControl("EmployeeId")?.setValue(this.listEmployeeId[indexEmployeeId]);

                      }

                    });
                  }
                  if (data.groupId != null) {
                    this.schedualPlanService.groupsForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.groupId }).subscribe(dataDropdown => {
                      this.listGroupId = [];
                      dataDropdown.data?.forEach((list: any) => {
                        this.listGroupId.push({ name: list.name, key: list.id });
                      });
                      let indexGroupId = this.listGroupId.findIndex(list => list.key === data.groupId);
                      if (indexGroupId >= 0) {
                        this.getControl("GroupId")?.setValue(this.listGroupId[indexGroupId]);

                      }

                    });
                  }
                  if (data.departmentId != null) {
                    this.schedualPlanService.departmentForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.departmentId }).subscribe(dataDropdown => {
                      this.listDepartmentId = [];
                      dataDropdown.data?.forEach((list: any) => {
                        this.listDepartmentId.push({ name: list.name, key: list.id });
                      });
                      let indexlistDepartmentId = this.listDepartmentId.findIndex(list => list.key === data.departmentId);
                      if (indexlistDepartmentId >= 0) {
                        this.getControl("DepartmentId")?.setValue(this.listDepartmentId[indexlistDepartmentId]);

                      }

                    });
                  }

                  // this.groupsService.GetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, ids: data?.employeeIds }).subscribe(dataDropdown => {

                  //   this.listGroupEmployees = [];
                  //   dataDropdown.data?.forEach((list: any) => {
                  //     this.listGroupEmployees.push({ name: list.name, key: list.id });
                  //   });
                  //   data?.employeeIds?.forEach((employee: any) => {


                  //     let indexEmployees = this.listGroupEmployees.findIndex(list => list.key === employee);


                  //     if (indexEmployees >= 0) {
                  //       if (Array.isArray(this.getControl("groupEmployees")?.value)) {
                  //         this.getControl("groupEmployees")?.patchValue(([{ name: this.listGroupEmployees[indexEmployees].name, key: this.listGroupEmployees[indexEmployees].key }, ...this.getControl("groupEmployees")?.value]));
                  //       } else {
                  //         this.getControl("groupEmployees")?.patchValue(([{ name: this.listGroupEmployees[indexEmployees].name, key: this.listGroupEmployees[indexEmployees].key }]));
                  //       }
                  //     }

                  //   });

                  // });

                  // this.groupsService.GetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, ids: data?.managerDelegatorIds }).subscribe(dataDropdown => {

                  //   this.listDeputyDirector = [];
                  //   dataDropdown.data?.forEach((list: any) => {
                  //     this.listDeputyDirector.push({ name: list.name, key: list.id });
                  //   });

                  //   data?.managerDelegatorIds?.forEach((employee: any) => {

                  //     let indexDeputyDirector = this.listDeputyDirector.findIndex(list => list.key === employee);
                  //     if (indexDeputyDirector >= 0) {
                  //       if (Array.isArray(this.getControl("deputyDirector")?.value)) {
                  //         this.getControl("deputyDirector")?.patchValue(([{ name: this.listDeputyDirector[indexDeputyDirector].name, key: this.listDeputyDirector[indexDeputyDirector].key }, ...this.getControl("deputyDirector")?.value]));
                  //       } else {
                  //         this.getControl("deputyDirector")?.patchValue(([{ name: this.listDeputyDirector[indexDeputyDirector].name, key: this.listDeputyDirector[indexDeputyDirector].key }]));
                  //       }
                  //     }

                  //   });

                  // });


                  // data?.zoneIds?.forEach((zone: any) => {

                  //   let indexZones = this.listZones.findIndex(list => list.key === zone);


                  //   if (indexZones >= 0) {
                  //     if (Array.isArray(this.getControl("zoneIds")?.value)) {
                  //       this.getControl("zoneIds")?.patchValue(([{ name: this.listZones[indexZones].name, key: this.listZones[indexZones].key }, ...this.getControl("zoneIds")?.value]));
                  //     } else {
                  //       this.getControl("zoneIds")?.patchValue(([{ name: this.listZones[indexZones].name, key: this.listZones[indexZones].key }]));
                  //     }
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
          if (!this.editSchedualPlan) {
            this.loading = false;

          }

        },
        error: err => {
          this.loading = false;

        }
      }
    )
    this.addBranchGroupForm.get("SchedulePlanType")?.valueChanges.subscribe(data => {

      if (data === "0") {
        this.addBranchGroupForm.removeControl("GroupId");
        this.addBranchGroupForm.removeControl("DepartmentId");

        this.addBranchGroupForm.addControl("EmployeeId", this.fb.control("", [Validators.required]));
        this.employeeIdToggle = true;
        this.groupIdToggle = false;
        this.departmentIdToggle = false;





      } else if (data === "1") {

        this.addBranchGroupForm.removeControl("EmployeeId");
        this.addBranchGroupForm.removeControl("DepartmentId");

        this.addBranchGroupForm.addControl("GroupId", this.fb.control("", [Validators.required]));
        this.employeeIdToggle = false;
        this.groupIdToggle = true;
        this.departmentIdToggle = false;

      } else if (data === "2") {
        this.addBranchGroupForm.removeControl("EmployeeId");
        this.addBranchGroupForm.removeControl("GroupId");

        this.addBranchGroupForm.addControl("DepartmentId", this.fb.control("", [Validators.required]));
        this.employeeIdToggle = false;
        this.groupIdToggle = false;
        this.departmentIdToggle = true;
      }


    })
  }
  nodeSelect(data: any) {
  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'EmployeeId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.schedualPlanService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listEmployeeId = [];
                res.data?.forEach((day: any) => {


                  this.listEmployeeId.push({ name: day.name, key: day.id });

                });


              });
          }

        }
        break;

      case 'GroupId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.schedualPlanService.groupsForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listGroupId = [];
                res.data?.forEach((day: any) => {


                  this.listGroupId.push({ name: day.name, key: day.id });

                });


              });
          }

        }
        break;
      case 'DepartmentId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.schedualPlanService.departmentForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listDepartmentId = [];
                res.data?.forEach((day: any) => {


                  this.listDepartmentId.push({ name: day.name, key: day.id });

                });


              });
          }

        }
        break;
      case 'ScheduleId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.schedualPlanService.schedualForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listScheduleId = [];
                res.data?.forEach((day: any) => {


                  this.listScheduleId.push({ name: day.name, key: day.id });

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

    if (this.addBranchGroupForm.valid && this.submitted) {
      this.submitted = false;
      this.submitClicked.emit(this.addBranchGroupForm.value);
      // this.dialogRef.close(true);
    } else {
      this.getControl("ScheduleId")?.markAsDirty();
      this.getControl("SchedulePlanType")?.markAsDirty();
      this.getControl("DateFrom")?.markAsDirty();
      this.getControl("notes")?.markAsDirty();
      this.getControl("EmployeeId")?.markAsDirty();
      this.getControl("DepartmentId")?.markAsDirty();
      this.getControl("GroupId")?.markAsDirty();



    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
