import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SchedulesService } from 'src/app/Presentation/user/tables/services/schedules.service';
import { Subscription, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { GroupsService } from 'src/app/Presentation/user/groups/services/groups.service';
import { TreeModule } from 'primeng/tree';
import { PrimeNGConfig, TreeNode } from 'primeng/api';
import { SectionsService } from 'src/app/Presentation/user/sections/services/sections.service';
import { MatRadioModule } from '@angular/material/radio';
import { EmployeesService } from 'src/app/Presentation/user/employees/services/employees.service';
import { SchedualPlanService } from 'src/app/Presentation/user/schedual-plan/services/schedual-plan.service';
import { VacationBalanceService } from 'src/app/Presentation/user/vacation-balance/services/vacation-balance.service';
import { TableModule } from 'primeng/table';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginatorModule } from 'primeng/paginator';

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
  selector: 'app-add-branch',
  standalone: true,
  imports: [CommonModule,TableModule, FormsModule,NgxPaginationModule,PaginatorModule, ReactiveFormsModule, MatRadioModule, MultiSelectModule, MatProgressSpinnerModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss']
})
export class AddBranchComponent {
  loading = false;

  private dialog = inject(MatDialog);
  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  
  list: any[] = [
  ];
  @Input() editVacation!: boolean;
  @Input() id!: string;
  RowsPerPage!: any[];

  listEmployeeId: any[] = [
  ];
  listGroupId: any[] = [
  ];
  listDepartmentId: any[] = [
  ];
  totalItems: number = 0;

  listVacationType: any[] = [];
  columns: any[] = [
    {
      name: "اسم الفرع",
      field: "name",
    },
    {
      name: "عنوان الفرع",
      field: "address",
    },
    {
      name: "مكان الفرع",
      field: "location"
    },
    {
      name: "رمز البريدي للفرع",
      field: "postalCode"
    },
    {
      name: "الإجراء",
      field: "actions"
    }
  ];
  branches: any[] = [];
  opened = false;

  isLoading = true;
  filteration: any = {
    PageSize: 2,
    PageNumber: 0,
    PagingEnabled: true
  };
  private vacationBalanceService = inject(VacationBalanceService);
  employeeIdToggle = true;
  groupIdToggle = false;
  departmentIdToggle = false;
  weekDays: any[] = [];
  addBranchGroupForm: FormGroup = this.fb.group({
    Name: ["", Validators.required],
    Address: ["", Validators.required],
    Location: ["", Validators.required],
    PostalCode: ["", Validators.required]
  });
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  mobileQuery: MediaQueryList;
  subscription!: Subscription;
  indexIncrement = 1;
  private _mobileQueryListener: () => void;
  clonedProducts: { [s: string]: any } = {};
  defaultRowPerPage = { name: '5', code: 5 };

  constructor(
    public dialogRef: MatDialogRef<AddBranchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | any,
    private changeDetectorRef: ChangeDetectorRef,
    public translate: TranslateService,
    private authService: AuthService,
    private config: PrimeNGConfig,
    private fb: FormBuilder,
    private toast: ToastrService,
     media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.branches = this.branches;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.branches = this.branches;

        changeDetectorRef.detectChanges();

      }

      this.dialogRef.disableClose = true;


    };
    this.mobileQuery.addListener(this._mobileQueryListener);
    translate.addLangs(['ar', 'en']);
    translate.setDefaultLang('ar');
    const browserLang: any = translate.getBrowserLang();
    let lang = browserLang.match(/ar|en/) ? browserLang : 'ar';

    this.subscription = this.translate.stream('primeng').subscribe(data => {
      this.config.setTranslation(data);
    });
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loading = false;
    this.RowsPerPage = [
      { name: '2', code: 2 },
      { name: '5', code: 5 }

    ];
    this.getBranches(this.filteration);
    
    // this.listVacationType = [
    //   { name: "إعتيادي", key: 0 },
    //   { name: "عارضة", key: 1 },
    //   { name: "مرضي", key: 2 },
    //   { name: "اجازة نسائية", key: 3 },
    //   { name: "أخري", key: 4 }
    // ]
    // let employeesDropdown = this.vacationBalanceService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    // let groupsForDropdown = this.vacationBalanceService.groupsForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    // let departmentForDropdown = this.vacationBalanceService.departmentForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    // combineLatest({
    //   employeesDropdown,
    //   groupsForDropdown,
    //   departmentForDropdown
    // }).subscribe(
    //   {
    //     next: data => {
    //       this.listEmployeeId = [];
    //       this.listGroupId = [];
    //       this.listDepartmentId = [];

    //       data.employeesDropdown?.data?.forEach((day: any) => {
    //         this.listEmployeeId.push({ name: day.name, key: day.id });

    //       });
    //       data.groupsForDropdown?.data?.forEach((day: any) => {
    //         this.listGroupId.push({ name: day.name, key: day.id });

    //       });
    //       data.departmentForDropdown?.data?.forEach((day: any) => {
    //         this.listDepartmentId.push({ name: day.name, key: day.id });

    //       });

    //       this.loading = false;

    //       if (this.editVacation) {
    //         this.vacationBalanceService.vacationGetById({ vacationBalanceId: this.id }).subscribe(
    //           {
    //             next: data => {


    //               this.getControl("isActive")?.setValue(data.isActive);
    //               this.getControl("notes")?.setValue(data.notes);

    //               this.getControl("Year")?.setValue(new Date(data.year.toString()));
    //               this.getControl("Balance")?.setValue(data.balance);

    //               data.employeeId != undefined ? this.getControl("ForType")?.setValue("0") : [];
    //               data.groupId != undefined ? this.getControl("ForType")?.setValue("1") : [];
    //               data.departmentId != undefined ? this.getControl("ForType")?.setValue("2") : [];

    //               this.getControl("fieldDisabled")?.setValue(data.code);


    //               let indexGroupManager = this.listVacationType.findIndex(list => list.key === data.defaultVacationType);
    //               if (indexGroupManager >= 0) {
    //                 this.getControl("VacationType")?.setValue(this.listVacationType[indexGroupManager]);

    //               }

    //               if (data.employeeId != null) {
    //                 this.vacationBalanceService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.employeeId }).subscribe(dataDropdown => {
    //                   this.listEmployeeId = [];
    //                   dataDropdown.data?.forEach((list: any) => {
    //                     this.listEmployeeId.push({ name: list.name, key: list.id });
    //                   });
    //                   let indexEmployeeId = this.listEmployeeId.findIndex(list => list.key === data.employeeId);
    //                   if (indexEmployeeId >= 0) {
    //                     this.getControl("EmployeeId")?.setValue(this.listEmployeeId[indexEmployeeId]);

    //                   }

    //                 });
    //               }
    //               if (data.groupId != null) {
    //                 this.vacationBalanceService.groupsForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.groupId }).subscribe(dataDropdown => {
    //                   this.listGroupId = [];
    //                   dataDropdown.data?.forEach((list: any) => {
    //                     this.listGroupId.push({ name: list.name, key: list.id });
    //                   });
    //                   let indexGroupId = this.listGroupId.findIndex(list => list.key === data.groupId);
    //                   if (indexGroupId >= 0) {
    //                     this.getControl("GroupId")?.setValue(this.listGroupId[indexGroupId]);

    //                   }

    //                 });
    //               }
    //               if (data.departmentId != null) {
    //                 this.vacationBalanceService.departmentForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.departmentId }).subscribe(dataDropdown => {
    //                   this.listDepartmentId = [];
    //                   dataDropdown.data?.forEach((list: any) => {
    //                     this.listDepartmentId.push({ name: list.name, key: list.id });
    //                   });
    //                   let indexlistDepartmentId = this.listDepartmentId.findIndex(list => list.key === data.departmentId);
    //                   if (indexlistDepartmentId >= 0) {
    //                     this.getControl("DepartmentId")?.setValue(this.listDepartmentId[indexlistDepartmentId]);

    //                   }

    //                 });
    //               }

    //               this.loading = false;
    //             },
    //             error: err => {
    //               this.loading = false;
    //             }
    //           }
    //         )

    //       }
    //       if (!this.editVacation) {
    //         this.loading = false;

    //       }

    //     },
    //     error: err => {
    //       this.loading = false;

    //     }
    //   }
    // )
    // this.addBranchGroupForm.get("ForType")?.valueChanges.subscribe(data => {
    //   if (data === "0") {
    //     this.addBranchGroupForm.removeControl("GroupId");
    //     this.addBranchGroupForm.removeControl("DepartmentId");
    //     this.addBranchGroupForm.addControl("EmployeeId", this.fb.control("", [Validators.required]));
    //     this.employeeIdToggle = true;
    //     this.groupIdToggle = false;
    //     this.departmentIdToggle = false;
    //   } else if (data === "1") {
    //     this.addBranchGroupForm.removeControl("EmployeeId");
    //     this.addBranchGroupForm.removeControl("DepartmentId");
    //     this.addBranchGroupForm.addControl("GroupId", this.fb.control("", [Validators.required]));
    //     this.employeeIdToggle = false;
    //     this.groupIdToggle = true;
    //     this.departmentIdToggle = false;

    //   } else if (data === "2") {
    //     this.addBranchGroupForm.removeControl("EmployeeId");
    //     this.addBranchGroupForm.removeControl("GroupId");

    //     this.addBranchGroupForm.addControl("DepartmentId", this.fb.control("", [Validators.required]));
    //     this.employeeIdToggle = false;
    //     this.groupIdToggle = false;
    //     this.departmentIdToggle = true;
    //   }


    // })
  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getBranches(this.filteration)
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getBranches(this.filteration)
  }
  reasonOfRefuse(data: any) {
    const reasonOfRefuseDialog = this.dialog.open(DialogDeleteComponent, {
      width: "30vw",
      data: {
        title: "هل متأكد من حذف الفرع؟",
        titleClose: "تراجع",
        buttonSend: "حذف"
      },
    });

    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
    
      let findIndexBranch = this.branches.findIndex((branch:any) =>branch.id === data.id)
    this.branches.splice(findIndexBranch, 1);
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.close();
    })
  }
  getBranches(filteration) {
this.isLoading = false;
this.totalItems = this.branches.length;

  }
  nodeSelect(data: any) {
  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'EmployeeId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.vacationBalanceService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
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

      case 'GroupId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.vacationBalanceService.groupsForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
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
      case 'DepartmentId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.vacationBalanceService.departmentForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
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
      case 'VacationType':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.vacationBalanceService.vacationForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listVacationType = [];
                this.lastSearchQuery = "";
                res.data?.forEach((day: any) => {
                  this.listVacationType.push({ name: day.name, key: day.id });
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
  onRowEditInit(branch: any) {
    this.clonedProducts[branch.uniqId as string] = { ...branch };
}

onRowEditSave(branch: any) {
    // if (branch.price > 0) {
    //     delete this.clonedProducts[branch.uniqId as string];
    //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'branch is updated' });
    // } else {
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    // }
    delete this.clonedProducts[branch.uniqId as string];

}

onRowEditCancel(branch: any, index: number) {
    this.branches[index] = this.clonedProducts[branch.uniqId as string];
    delete this.clonedProducts[branch.uniqId as string];
}
addBranch() {
  if (this.addBranchGroupForm.valid && this.submitted) {
    // this.submitted = false;
    
    let formatObject = {
      id:0,
      uniqId:this.indexIncrement.toString(),
      name:this.addBranchGroupForm.get("Name")?.value,
      address: this.addBranchGroupForm.get("Address")?.value,
      location: this.addBranchGroupForm.get("Location")?.value,
      postalCode: this.addBranchGroupForm.get("PostalCode")?.value
    }

    this.branches.push(formatObject);
    this.indexIncrement++;
    this.getBranches(this.filteration);
    this.addBranchGroupForm.reset();

    // this.dialogRef.close(true);
  } else {

    this.getControl("Name")?.markAsDirty();
    this.getControl("Address")?.markAsDirty();
    this.getControl("Location")?.markAsDirty();
    this.getControl("PostalCode")?.markAsDirty();
    
  }
}
  request() {
    
    if (this.branches.length > 0 && this.submitted) {
      this.submitted = false;
      let formatBranches = this.branches.map((branch:any) => {
        return {
          id:branch.id,
          name:branch.name,
          address: branch.address,
          location: branch.location,
          postalCode: branch.postalCode
        }
      })
      this.submitClicked.emit(this.branches);
      // this.dialogRef.close(true);
    } else {
      this.toast.error("من فضلك ادخل الفرع");

    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
