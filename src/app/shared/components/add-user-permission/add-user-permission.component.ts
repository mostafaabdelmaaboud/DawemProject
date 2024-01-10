import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription, combineLatest, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';

import { MatRadioModule } from '@angular/material/radio';
import { UserPermissionsService } from 'src/app/Presentation/user/user-permissions/services/user-permissions.service';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { NgxPaginationModule } from 'ngx-pagination';
import { PrimeNGConfig } from 'primeng/api';
import { MediaMatcher } from '@angular/cdk/layout';
import * as moment from 'moment';
import { CheckboxModule } from 'primeng/checkbox';
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

  titleRoleId: string;
  placeholdeRoleId: string;
  ValidationRoleId: string;

  titleUserId: string;
  placeholdeUserId: string;
  ValidationUserId: string;

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
  selector: 'app-add-user-permission',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatRadioModule,
    TableModule,
    PaginatorModule,
    NgxPaginationModule,
    MultiSelectModule, MatProgressSpinnerModule, CheckboxModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-user-permission.component.html',
  styleUrls: ['./add-user-permission.component.scss']
})
export class AddUserPermissionComponent {
  loading = false;


  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  list: any[] = [
  ];
  @Input() editSchedualPlan!: boolean;
  @Input() id!: string;

  listRoleId: any[] = [
  ];
  listUserId: any[] = [
  ];
  permissions: any = [];


  private userPermissionsService = inject(UserPermissionsService);

  filteration: any = {
    PageSize: 40,
    PageNumber: 0,
    PagingEnabled: true
  };

  mobileQuery: MediaQueryList;
  subscription!: Subscription;
  isLoading = true;

  RoleToggle = true;
  userIdToggle = false;
  itemsPerPage = 5;
  page = 0;
  columns: any[] = [
    {
      name: "اسم الشاشة/اسم الصلاحية",
      field: "screenName",
    },
    {
      name: "اضافة",
      field: "0",
    },
    {
      name: "تعديل",
      field: "1"
    },
    {
      name: "حذف",
      field: "2"
    },
    {
      name: "المشاهدة",
      field: "3"
    },
    {
      name: "القبول",
      field: "4"
    },
    {
      name: "الرفض",
      field: "5"
    },
    {
      name: "التفعيل",
      field: "6"
    },
    {
      name: "التعطيل",
      field: "7"
    },
  ];
  RowsPerPage!: any[];
  first: number = 0;
  rows: number = 10;
  weekDays: any[] = [];
  addBranchGroupForm: FormGroup = this.fb.group({
    isActive: [false],
    fieldDisabled: [""],
    ForType: ['0', Validators.required],
    RoleId: ['', Validators.required],
  });
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  opened = false;
  totalItems: number = 0;

  private _mobileQueryListener: () => void;
  constructor(public dialogRef: MatDialogRef<AddUserPermissionComponent>,
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private fb: FormBuilder, private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, public translate: TranslateService, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.permissions = this.permissions;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.permissions = this.permissions;

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
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loading = true;
    let RoleDropdown = this.userPermissionsService.GetForDropDownRole({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });

    let usersForDropdown = this.userPermissionsService.usersForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });





    combineLatest({
      RoleDropdown,
      usersForDropdown
    }).subscribe(
      {
        next: data => {



          this.listRoleId = [];
          this.listUserId = [];


          data.RoleDropdown?.data?.forEach((day: any) => {
            this.listRoleId.push({ name: day.name, key: day.id });

          });
          data.usersForDropdown?.data?.forEach((day: any) => {
            this.listUserId.push({ name: day.name, key: day.id });

          });

          this.getPermissions(this.filteration);


          if (this.editSchedualPlan) {
            this.userPermissionsService.schedualPlanGetById({ schedulePlanId: this.id }).subscribe(
              {
                next: data => {


                  this.getControl("isActive")?.setValue(data.isActive);


                  this.getControl("ForType")?.setValue(data.forType.toString());
                  this.getControl("fieldDisabled")?.setValue(data.code);



                  if (data.roleId != null) {
                    this.userPermissionsService.GetForDropDownRole({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.employeeId }).subscribe(dataDropdown => {
                      this.listRoleId = [];
                      dataDropdown.data?.forEach((list: any) => {
                        this.listRoleId.push({ name: list.name, key: list.id });
                      });
                      let indexRoleId = this.listRoleId.findIndex(list => list.key === data.roleId);
                      if (indexRoleId >= 0) {
                        this.getControl("RoleId")?.setValue(this.listRoleId[indexRoleId]);

                      }

                    });
                  }
                  if (data.userId != null) {
                    this.userPermissionsService.usersForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.userId }).subscribe(dataDropdown => {
                      this.listUserId = [];
                      dataDropdown.data?.forEach((list: any) => {
                        this.listUserId.push({ name: list.name, key: list.id });
                      });
                      let indexUserId = this.listUserId.findIndex(list => list.key === data.userId);
                      if (indexUserId >= 0) {
                        this.getControl("UserId")?.setValue(this.listUserId[indexUserId]);

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
    this.addBranchGroupForm.get("ForType")?.valueChanges.subscribe(data => {

      if (data === "0") {
        this.addBranchGroupForm.removeControl("UserId");

        this.addBranchGroupForm.addControl("RoleId", this.fb.control("", [Validators.required]));
        this.RoleToggle = true;
        this.userIdToggle = false;





      } else if (data === "1") {

        this.addBranchGroupForm.removeControl("RoleId");

        this.addBranchGroupForm.addControl("UserId", this.fb.control("", [Validators.required]));
        this.RoleToggle = false;
        this.userIdToggle = true;

      }


    })
    this.RowsPerPage = [
      { name: '5', code: 5 },
      { name: '10', code: 10 },
      { name: '25', code: 25 },

    ];

  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getPermissions(this.filteration)
  }

  nodeSelect(data: any) {
  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getPermissions(this.filteration)
  }
  lastSearchQuery = "";
  getPermissions(filteration: any) {
    this.permissions = [];
    this.isLoading = true;

    this.userPermissionsService.availableActions(filteration).subscribe({
      next: data => {

        data.data.screens.forEach((screen: any) => {


          this.permissions.push({
            screenCode: screen.screenCode,
            screenName: screen.screenName,
            "0": {
              readoOnly: screen.availableActions[0] >= 0 ? false : true,
              checkbox: false
            },
            "1": {
              readoOnly: screen.availableActions[1] >= 0 ? false : true,
              checkbox: false
            },
            "2": {
              readoOnly: screen.availableActions[2] >= 0 ? false : true,
              checkbox: false
            },
            "3": {
              readoOnly: screen.availableActions[3] >= 0 ? false : true,
              checkbox: false
            },
            "4": {
              readoOnly: screen.availableActions[4] >= 0 ? false : true,
              checkbox: false
            },
            "5": {
              readoOnly: screen.availableActions[5] >= 0 ? false : true,
              checkbox: false
            },
            "6": {
              readoOnly: screen.availableActions[6] >= 0 ? false : true,
              checkbox: false
            },
            "7": {
              readoOnly: screen.availableActions[7] >= 0 ? false : true,
              checkbox: false
            }
          })
        });

        this.totalItems = data.totalCount
        this.isLoading = false;
        this.loading = false;

      },
      error: err => {
        this.isLoading = false;
        this.loading = false;
      }
    }
    )
  }
  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'RoleId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.userPermissionsService.GetForDropDownRole({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listRoleId = [];
                res.data?.forEach((day: any) => {


                  this.listRoleId.push({ name: day.name, key: day.id });

                });


              });
          }

        }
        break;

      case 'UserId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.userPermissionsService.usersForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listUserId = [];
                res.data?.forEach((day: any) => {


                  this.listUserId.push({ name: day.name, key: day.id });

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
    let formatObject: any = {};
    let filterPermission = this.permissions.filter((permission: any) => {
      let changeCechbox = false;
      for (let per in permission) {
        const pro = permission[per];
        if (pro.readoOnly === false && pro.checkbox === true) {
          changeCechbox = true
        }
      }
      return changeCechbox;

    });


    formatObject.PermissionScreens = filterPermission.map((permission: any) => {
      let filterObject: any = {};

      for (let per in permission) {
        const pro = permission[per];
        if (pro.readoOnly === false && pro.checkbox === true) {
          filterObject[per] = pro;
        }
      }
      let arrayChange: any = Object.keys(filterObject);
      arrayChange = arrayChange.map((changeCheck: any) => {
        return { ActionCode: Number(changeCheck) }
      })
      return { ScreenCode: permission.screenCode, PermissionScreenActions: arrayChange };
    });
    //  && this.submitted
    if (this.addBranchGroupForm.valid && this.submitted && formatObject.PermissionScreens.length > 0) {
      this.submitted = false;

      formatObject.ForType = Number(this.addBranchGroupForm.value.ForType);
      formatObject.RoleId = formatObject.ForType === 0 ? this.addBranchGroupForm.value.RoleId.key : null;
      formatObject.UserId = formatObject.ForType === 1 ? this.addBranchGroupForm.value.UserId.key : null;




      this.submitClicked.emit(formatObject);
    } else {
      this.getControl("UserId")?.markAsDirty();
      this.getControl("RoleId")?.markAsDirty();
      if (formatObject.PermissionScreens.length == 0) {
        this.toast.error("الرجاء اختيار صلاحية");
      }



    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
