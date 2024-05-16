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
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { GroupsService } from 'src/app/Presentation/user/groups/services/groups.service';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { SectionsService } from 'src/app/Presentation/user/sections/services/sections.service';
import { MatRadioModule } from '@angular/material/radio';
import { EmployeesService } from 'src/app/Presentation/user/employees/services/employees.service';
import { SchedualPlanService } from 'src/app/Presentation/user/schedual-plan/services/schedual-plan.service';
import { VacationBalanceService } from 'src/app/Presentation/user/vacation-balance/services/vacation-balance.service';
import { SubscriptionsService } from '../../service/subscriptions.service';

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
  selector: 'app-add-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatRadioModule, MultiSelectModule, MatProgressSpinnerModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-subscription.component.html',
  styleUrls: ['./add-subscription.component.scss']
})
export class AddSubscriptionComponent {
  loading = false;


  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  list: any[] = [
  ];
  @Input() editSubscription!: boolean;
  @Input() id!: string;

  listPlanId: any[] = [
  ];

  listCompanies: any[] = [];

  private subscriptionsService = inject(SubscriptionsService);


  employeeIdToggle = true;
  groupIdToggle = false;
  departmentIdToggle = false;

  weekDays: any[] = [];
  addBranchGroupForm: FormGroup = this.fb.group({
    isActive: [false],
    Status: ['0', Validators.required],
    PlanId: ['', Validators.required],
    CompanyId: ["", Validators.required],
    DurationInDays: ['', Validators.required],
    RenewalCount: ['', Validators.required],
    FollowUpEmail: ['', [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    StartDate:["", Validators.required],
    EndDate:["", Validators.required],
    notes: ["", Validators.required],

  });
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  constructor(
    public dialogRef: MatDialogRef<AddSubscriptionComponent>,
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


    let planGetForDropDown = this.subscriptionsService.planGetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });

    let companyDropdown = this.subscriptionsService.companyDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });




    combineLatest({
      planGetForDropDown,
      companyDropdown
    }).subscribe(
      {
        next: data => {

         

          this.listPlanId = [];
          this.listCompanies = [];

          data.planGetForDropDown?.data?.forEach((day: any) => {
            this.listPlanId.push({ name: day.name, key: day.id });

          });
          data.companyDropdown?.data?.forEach((day: any) => {
            this.listCompanies.push({ name: day.name, key: day.id });

          });
 

          if (this.editSubscription) {
            this.subscriptionsService.SubscriptionGetById({ subscriptionId: this.id }).subscribe(
              {
                next: data => {


                  this.getControl("isActive")?.setValue(data.isActive);
                  // addBranchGroupForm: FormGroup = this.fb.group({
                  //   isActive: [false],
                  //   Status: ['0', Validators.required],
                  //   PlanId: ['', Validators.required],
                  //   CompanyId: ["", Validators.required],
                  //   DurationInDays: ['', Validators.required],
                  //   RenewalCount: ['', Validators.required],
                  //   FollowUpEmail: ['', [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
                  //   StartDate:["", Validators.required],
                  //   EndDate:["", Validators.required],
                  //   notes: ["", Validators.required],
                
                  // });
                  this.getControl("notes")?.setValue(data.notes);
                  this.getControl("Status")?.setValue(data.status.toString());
                  this.getControl("DurationInDays")?.setValue(data.durationInDays);
                  this.getControl("RenewalCount")?.setValue(data.renewalCount);
                  this.getControl("FollowUpEmail")?.setValue(data.followUpEmail);
                  this.getControl("StartDate")?.setValue(new Date(data.startDate));
                  this.getControl("EndDate")?.setValue(new Date(data.endDate));
                    this.subscriptionsService.planGetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.planId }).subscribe(dataDropdown => {
                      this.listPlanId = [];
                      dataDropdown.data?.forEach((list: any) => {
                        this.listPlanId.push({ name: list.name, key: list.id });
                      });
                      let indexplanId = this.listPlanId.findIndex(list => list.key === data.planId);
                      if (indexplanId >= 0) {
                        this.getControl("PlanId")?.setValue(this.listPlanId[indexplanId]);

                      }

                    });
                    this.subscriptionsService.companyDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.companyId }).subscribe(dataDropdown => {
                      this.listCompanies = [];
                      dataDropdown.data?.forEach((list: any) => {
                        this.listCompanies.push({ name: list.name, key: list.id });
                      });
                      let indexcompanyId = this.listCompanies.findIndex(list => list.key === data.companyId);
                      if (indexcompanyId >= 0) {
                        this.getControl("CompanyId")?.setValue(this.listCompanies[indexcompanyId]);

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
          if (!this.editSubscription) {
            this.loading = false;

          }

        },
        error: err => {
          this.loading = false;

        }
      }
    )
   
  }
  nodeSelect(data: any) {
  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'PlanId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.subscriptionsService.planGetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listPlanId = [];
                this.lastSearchQuery = "";
                res.data?.forEach((day: any) => {
                  this.listPlanId.push({ name: day.name, key: day.id });
                });
              });
          }

        }
        break;

      case 'CompanyId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.subscriptionsService.companyDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listCompanies = [];
                this.lastSearchQuery = "";
                res.data?.forEach((day: any) => {
                  this.listCompanies.push({ name: day.name, key: day.id });
                });
              });
          }
        }
        break;
      // case 'DepartmentId':
      //   if (data || data === "") {
      //     if (data !== this.lastSearchQuery || data === "") {
      //       this.lastSearchQuery = data;
      //       this.vacationBalanceService.departmentForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
      //         debounceTime(300),
      //         distinctUntilChanged()).subscribe((res: any) => {
      //           this.listDepartmentId = [];
      //           this.lastSearchQuery = "";
      //           res.data?.forEach((day: any) => {
      //             this.listDepartmentId.push({ name: day.name, key: day.id });
      //           });
      //         });
      //     }

      //   }
      //   break;
      // case 'VacationType':
      //   if (data || data === "") {
      //     if (data !== this.lastSearchQuery || data === "") {
      //       this.lastSearchQuery = data;
      //       this.vacationBalanceService.vacationForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
      //         debounceTime(300),
      //         distinctUntilChanged()).subscribe((res: any) => {
      //           this.listCompanies = [];
      //           this.lastSearchQuery = "";
      //           res.data?.forEach((day: any) => {
      //             this.listCompanies.push({ name: day.name, key: day.id });
      //           });
      //         });
      //     }

      //   }
      //   break;

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
      this.getControl("PlanId")?.markAsDirty();
      this.getControl("CompanyId")?.markAsDirty();
      this.getControl("Status")?.markAsDirty();
      this.getControl("DurationInDays")?.markAsDirty();
      this.getControl("RenewalCount")?.markAsDirty();
      this.getControl("notes")?.markAsDirty();
      this.getControl("FollowUpEmail")?.markAsDirty();
      this.getControl("StartDate")?.markAsDirty();
      this.getControl("EndDate")?.markAsDirty();
    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
