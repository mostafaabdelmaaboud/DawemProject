import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SchedulesService } from 'src/app/Presentation/user/tables/services/schedules.service';
import { combineLatest, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { GroupsService } from 'src/app/Presentation/user/groups/services/groups.service';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { SectionsService } from 'src/app/Presentation/user/sections/services/sections.service';
import { MatRadioModule } from '@angular/material/radio';
import { EmployeesService } from 'src/app/Presentation/user/employees/services/employees.service';
import { SchedualPlanService } from 'src/app/Presentation/user/schedual-plan/services/schedual-plan.service';
import { VacationBalanceService } from 'src/app/Presentation/user/vacation-balance/services/vacation-balance.service';
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

  titleVacationType: string;
  placeholdeVacationType: string;
  ValidationVacationType: string;

  titleCalendar: string;
  placeholderCalendar: string;
  validationCalendar: string;

  titleBalance: string;
  placeholderBalance: string;
  validationBalance: string;


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
  selector: 'app-add-vacation-balance',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatRadioModule, MultiSelectModule, MatProgressSpinnerModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-vacation-balance.component.html',
  styleUrls: ['./add-vacation-balance.component.scss']
})
export class AddVacationBalanceComponent {
  loading = false;


  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  list: any[] = [
  ];
  @Input() editVacation!: boolean;
  @Input() id!: string;

  listEmployeeId: any[] = [
  ];
  listGroupId: any[] = [
  ];
  listDepartmentId: any[] = [
  ];
  listVacationType: any[] = [];

  private vacationBalanceService = inject(VacationBalanceService);


  employeeIdToggle = true;
  groupIdToggle = false;
  departmentIdToggle = false;

  weekDays: any[] = [];
  addBranchGroupForm: FormGroup = this.fb.group({
    isActive: [false],
    fieldDisabled: [""],
    ForType: ['0', Validators.required],
    EmployeeId: ['', Validators.required],
    Balance: ['', Validators.required],
    VacationType: ["", Validators.required],
    Year: ['', Validators.required],
    notes: [""],

  });
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
    private searchSubject = new Subject<{ value: any; type: any }>();
  
  constructor(
    public dialogRef: MatDialogRef<AddVacationBalanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    public translate: TranslateService,
    private authService: AuthService,
        private toastr: ToastrService,
    
    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loading = true;
    this.listVacationType = [
      { name: "إعتيادي", key: 0 },
      { name: "عارضة", key: 1 },
      { name: "مرضي", key: 2 },
      { name: "اجازة نسائية", key: 3 },
      { name: "أخري", key: 4 }
    ]
    let employeesDropdown = this.vacationBalanceService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });

    let groupsForDropdown = this.vacationBalanceService.groupsForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let departmentForDropdown = this.vacationBalanceService.departmentForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });




    combineLatest({
      employeesDropdown,
      groupsForDropdown,
      departmentForDropdown,

    }).subscribe(
      {
        next: data => {



          this.listEmployeeId = [];
          this.listGroupId = [];
          this.listDepartmentId = [];

          data.employeesDropdown?.data?.forEach((day: any) => {
            this.listEmployeeId.push({ name: day.name, key: day.id });

          });
          data.groupsForDropdown?.data?.forEach((day: any) => {
            this.listGroupId.push({ name: day.name, key: day.id });

          });
          data.departmentForDropdown?.data?.forEach((day: any) => {
            this.listDepartmentId.push({ name: day.name, key: day.id });

          });

          this.loading = false;

          if (this.editVacation) {
            this.vacationBalanceService.vacationGetById({ vacationBalanceId: this.id }).subscribe(
              {
                next: data => {


                  this.getControl("isActive")?.setValue(data.isActive);
                  this.getControl("notes")?.setValue(data.notes);

                  this.getControl("Year")?.setValue(new Date(data.year.toString()));
                  this.getControl("Balance")?.setValue(data.balance);

                  data.employeeId != undefined ? this.getControl("ForType")?.setValue("0") : [];
                  data.groupId != undefined ? this.getControl("ForType")?.setValue("1") : [];
                  data.departmentId != undefined ? this.getControl("ForType")?.setValue("2") : [];

                  this.getControl("fieldDisabled")?.setValue(data.code);


                  let indexGroupManager = this.listVacationType.findIndex(list => list.key === data.defaultVacationType);
                  if (indexGroupManager >= 0) {
                    this.getControl("VacationType")?.setValue(this.listVacationType[indexGroupManager]);

                  }

                  if (data.employeeId != null) {
                    this.vacationBalanceService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.employeeId }).subscribe(dataDropdown => {
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
                    this.vacationBalanceService.groupsForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.groupId }).subscribe(dataDropdown => {
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
                    this.vacationBalanceService.departmentForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.departmentId }).subscribe(dataDropdown => {
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

                  this.loading = false;
                },
                error: err => {
                  this.loading = false;
                }
              }
            )

          }
          if (!this.editVacation) {
            this.loading = false;

          }

        },
        error: err => {
          this.loading = false;

        }
      }
    )
    this.addBranchGroupForm.get("ForType")?.valueChanges.subscribe(data => {

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


    });
    this.searchSubject
    .pipe(
      debounceTime(500),
      distinctUntilChanged((prev, curr) =>  prev.value === curr.value && prev.type === curr.type
    ) 
    )
    .subscribe(({ value, type }) => {
      this.searchDropdown(value, type, true);
    });
  }
  nodeSelect(data: any) {
  }
  searchList(target:any, type:any) {
    let value = target.value;

    this.searchSubject.next({ value, type }); 

  }
  lastSearchQuery = "";
  sortArrayBySearchTerm(
    array: { name: string; key: number }[],
    searchTerm: string
  ): { name: string; key: number }[] {
    return array.sort((a, b) => {
      const aIndex = a.name.indexOf(searchTerm);
      const bIndex = b.name.indexOf(searchTerm);
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });
  }
  searchDropdown(data: any, type: string, searchInput?) {

    switch (type) {
      case 'EmployeeId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.vacationBalanceService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              distinctUntilChanged()).subscribe((res: any) => {
                let newArray:any[]= [];
                this.lastSearchQuery = "";
                res?.data?.forEach((jobTitle: any) => {
                  newArray.push({ name: jobTitle.name, key: jobTitle.id })
                });
                newArray = newArray.filter(newItem => 
                  !this.listEmployeeId.some(oldItem => oldItem.key === newItem.key || oldItem.name === newItem.name)
                );
                const searchTerm = data;

                if(res?.data?.length > 0 || searchInput){
                  if(newArray?.length >0) {
                    this.listEmployeeId = [...this.listEmployeeId, ...newArray]
                  }
                  let formatSearch = this.sortArrayBySearchTerm(this.listEmployeeId, searchTerm);
                  this.listEmployeeId = [...formatSearch];

                } else {
                  if(!res?.data?.length) {
                    this.toastr.error("لا يوجد بيانات");
                  }
                }

              });
          }

        }
        break;

      case 'GroupId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.vacationBalanceService.groupsForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              distinctUntilChanged()).subscribe((res: any) => {
                let newArray:any[]= [];
                this.lastSearchQuery = "";
                res?.data?.forEach((jobTitle: any) => {
                  newArray.push({ name: jobTitle.name, key: jobTitle.id })
                });
                newArray = newArray.filter(newItem => 
                  !this.listGroupId.some(oldItem => oldItem.key === newItem.key || oldItem.name === newItem.name)
                );
                const searchTerm = data;

                if(res?.data?.length > 0 || searchInput){
                  if(newArray?.length >0) {
                    this.listGroupId = [...this.listGroupId, ...newArray]
                  }
                  let formatSearch = this.sortArrayBySearchTerm(this.listGroupId, searchTerm);
                  this.listGroupId = [...formatSearch];

                } else {
                  if(!res?.data?.length) {
                    this.toastr.error("لا يوجد بيانات");
                  }
                }
              });
          }
        }
        break;
      case 'DepartmentId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.vacationBalanceService.departmentForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              distinctUntilChanged()).subscribe((res: any) => {
   
                let newArray:any[]= [];
                this.lastSearchQuery = "";
                res?.data?.forEach((jobTitle: any) => {
                  newArray.push({ name: jobTitle.name, key: jobTitle.id })
                });
                newArray = newArray.filter(newItem => 
                  !this.listDepartmentId.some(oldItem => oldItem.key === newItem.key || oldItem.name === newItem.name)
                );
                const searchTerm = data;

                if(res?.data?.length > 0 || searchInput){
                  if(newArray?.length >0) {
                    this.listDepartmentId = [...this.listDepartmentId, ...newArray]
                  }
                  let formatSearch = this.sortArrayBySearchTerm(this.listDepartmentId, searchTerm);
                  this.listDepartmentId = [...formatSearch];

                } else {
                  if(!res?.data?.length) {
                    this.toastr.error("لا يوجد بيانات");
                  }
                }
              });
          }

        }
        break;
      case 'VacationType':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.vacationBalanceService.vacationForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              distinctUntilChanged()).subscribe((res: any) => {
                let newArray:any[]= [];
                this.lastSearchQuery = "";
                res?.data?.forEach((jobTitle: any) => {
                  newArray.push({ name: jobTitle.name, key: jobTitle.id })
                });
                newArray = newArray.filter(newItem => 
                  !this.listVacationType.some(oldItem => oldItem.key === newItem.key || oldItem.name === newItem.name)
                );
                const searchTerm = data;

                if(res?.data?.length > 0 || searchInput){
                  if(newArray?.length >0) {
                    this.listVacationType = [...this.listVacationType, ...newArray]
                  }
                  let formatSearch = this.sortArrayBySearchTerm(this.listVacationType, searchTerm);
                  this.listVacationType = [...formatSearch];

                } else {
                  if(!res?.data?.length) {
                    this.toastr.error("لا يوجد بيانات");
                  }
                }
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
      this.getControl("VacationType")?.markAsDirty();
      this.getControl("ForType")?.markAsDirty();
      this.getControl("Year")?.markAsDirty();
      this.getControl("Balance")?.markAsDirty();
      this.getControl("EmployeeId")?.markAsDirty();
      this.getControl("DepartmentId")?.markAsDirty();
      this.getControl("GroupId")?.markAsDirty();



    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
