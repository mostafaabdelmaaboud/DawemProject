import { ChangeDetectorRef, Component, Inject, LOCALE_ID, inject } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { AssignmentRequestComponent } from 'src/app/shared/components/assignment-request/assignment-request.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { AddShiftComponent } from 'src/app/shared/components/add-shift/add-shift.component';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { EditShiftComponent } from 'src/app/shared/components/edit-shift/edit-shift.component';
import { DeleteShiftComponent } from 'src/app/shared/components/delete-shift/delete-shift.component';
import { AddGroupComponent } from 'src/app/shared/components/add-group/add-group.component';
import { EditGroupComponent } from 'src/app/shared/components/edit-group/edit-group.component';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DialogGroupFileComponent } from 'src/app/shared/components/dialog-group-file/dialog-group-file.component';
import { AddSchedualPlanComponent } from 'src/app/shared/components/add-schedual-plan/add-schedual-plan.component';
import { DialogSchedulePlanFileComponent } from 'src/app/shared/components/dialog-schedule-plan-file/dialog-schedule-plan-file.component';
import { UserPermissionsService } from './services/user-permissions.service';
import { AddUserPermissionComponent } from 'src/app/shared/components/add-user-permission/add-user-permission.component';
import { DialogDeleteComponent } from 'src/app/shared/components/dialog-delete/dialog-delete.component';
import { DialogUserPermissionFileComponent } from 'src/app/shared/components/dialog-user-permission-file/dialog-user-permission-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss']
})
export class UserPermissionsComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  private userPermissionsService = inject(UserPermissionsService);


  columns: any[] = [
    {
      name: "رقم الصلاحية",
      field: "code",
    },

    {
      name: "نوع الصلاحية",
      field: "forTypeName"
    },
    {
      name: "اسم الصلاحية / المستخدم",
      field: "roleOrUserName",
    },
    {
      name: "عدد الشاشات المسموح بها",
      field: "allowedScreensCount"
    },

    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  permissions: any = [];

  isLoading = true;

  filteration: any = {
    PageSize: 5,
    PageNumber: 0,
    PagingEnabled: true
  };

  services: any[] = [
    { name: 'Cash in', key: 'cashIn' },
    { name: 'Cash out', key: 'cashOut' }
  ];
  page = 0;
  categories: any[] = [
  ];
  public configs: PaginationInstance = {
    id: "custom",
    itemsPerPage: 10,
    currentPage: 1,
  };
  totalItems: number = 0;
  first: number = 0;
  rows: number = 10;
  RowsPerPage!: any[];
  mobileQuery: MediaQueryList;
  opened = false;
  cards!: any;
  spinnerCards = false;
  private _mobileQueryListener: () => void;
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
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
    if (this.mobileQuery.matches) {
      this.opened = true;
    } else {
      this.opened = false;

    }
    this.filterForm = this.fb.group({
      date: [],
      type: this.fb.group({

      }),
      currencyCode: this.fb.group({
      }),
      minimum: [null, this.minimumValidator("maxmimum")
      ],
      maxmimum: [null, this.maximumValidator("minimum")]
    });
    this.categories.push({ name: "adasd", key: "adsas" });
    this.RowsPerPage = [
      { name: '5', code: 5 },
      { name: '10', code: 10 },
      { name: '25', code: 25 },

    ];
    this.getInformation();

    this.getPermissions(this.filteration);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 19, actionCode: data.actionCode })
  }
  getInformation() {
    this.spinnerCards = true;
    this.userPermissionsService.getInformation().subscribe({
      next: data => {

        this.cards = {
          ...data
        };
        this.spinnerCards = false;

      },
      error: err => {
        this.spinnerCards = false;

      }
    })
  }
  getPermissions(filteration: any) {
    this.permissions = [];
    this.isLoading = true;

    this.userPermissionsService.listPermissions(filteration).subscribe(data => {

      data.data.forEach((permission: any) => {


        this.permissions.push({
          id: permission.id,
          code: permission.code,
          roleOrUserName: permission.roleOrUserName,
          forTypeName: permission.forTypeName,
          allowedScreensCount: permission.allowedScreensCount,
          isActive: permission.isActive
        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;

    })
  }
  addUserPermission() {
    const dialogRefAddCurrency = this.dialog.open(AddUserPermissionComponent, {
      width: "90vw",
      maxWidth: "90vw",

      data: {
        title: "اضافه صلاحية",
        setAsActive: "تعيين كنشط",
        labelRadioButton: "النوع",
        firstRadio: "الصلاحية",
        secondRadio: "مستخدم",

        titleRoleId: "نوع الصلاحية",
        placeholdeRoleId: "نوع الصلاحية",
        ValidationRoleId: "نوع الصلاحية مطلوب",

        titleUserId: "نوع المستخدم",
        placeholdeUserId: "نوع المستخدم",
        ValidationUserId: "نوع المستخدم مطلوب",


        titleClose: "تراجع",
        buttonSend: "إضافة صلاحية"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editPermission = false;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      if (dialogRefAddCurrency.componentInstance.editPermission) {
        result.id = dialogRefAddCurrency.componentInstance.id;
        this.userPermissionsService.updatePermission(result).subscribe(
          {
            next: data => {

              if (data?.state === 2) {
                this.toast.error(data?.message);
                dialogRefAddCurrency.close();

              } else {
                dialogRefAddCurrency.componentInstance.submitted = true;

                dialogRefAddCurrency.close();

                const succressDialog = this.dialog.open(ToastSuccessComponent, {
                  width: "30vw",
                  data: {
                    title: "تم ارسال طلبك",
                    message: data.message,
                    buttonSend: "طلبات الصلاحيات"
                  },
                });
                this.getPermissions(this.filteration);
                setTimeout(() => {
                  succressDialog.close();

                }, 2000);

                succressDialog.componentInstance.submitted = true;
                succressDialog.componentInstance.submitClicked.subscribe(result => {
                  succressDialog.close();

                })

              }

            },
            error: err => {
              dialogRefAddCurrency.componentInstance.submitted = true;

            }
          }
        )
      } else {
        this.userPermissionsService.createPermission(result).subscribe(
          {
            next: data => {

              if (data?.state === 2) {
                this.toast.error(data?.message);
                dialogRefAddCurrency.close();

              } else {
                dialogRefAddCurrency.componentInstance.submitted = true;

                dialogRefAddCurrency.close();

                const succressDialog = this.dialog.open(ToastSuccessComponent, {
                  width: "30vw",
                  data: {
                    title: "تم ارسال طلبك",
                    message: data.message,
                    buttonSend: "طلبات الصلاحيات"
                  },
                });
                this.getPermissions(this.filteration);
                setTimeout(() => {
                  succressDialog.close();

                }, 2000);

                succressDialog.componentInstance.submitted = true;
                succressDialog.componentInstance.submitClicked.subscribe(result => {
                  succressDialog.close();

                })

              }

            },
            error: err => {
              dialogRefAddCurrency.componentInstance.submitted = true;

            }
          }
        )
      }

    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  editUserPermission(data: any) {
    const dialogRefAddCurrency = this.dialog.open(AddUserPermissionComponent, {
      width: "90vw",
      maxWidth: "90vw",

      data: {
        title: "تعديل صلاحية",
        setAsActive: "تعيين كنشط",
        labelRadioButton: "النوع",
        firstRadio: "الصلاحية",
        secondRadio: "مستخدم",

        titleRoleId: "نوع الصلاحية",
        placeholdeRoleId: "نوع الصلاحية",
        ValidationRoleId: "نوع الصلاحية مطلوب",

        titleUserId: "نوع المستخدم",
        placeholdeUserId: "نوع المستخدم",
        ValidationUserId: "نوع المستخدم مطلوب",

        titleClose: "تراجع",
        buttonSend: "حفظ الصلاحية"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editPermission = true;
    dialogRefAddCurrency.componentInstance.id = data.id;


    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      if (dialogRefAddCurrency.componentInstance.editPermission) {
        result.id = data.id;
        this.userPermissionsService.updatePermission(result).subscribe(
          {
            next: data => {

              if (data?.state === 2) {
                this.toast.error(data?.message);
                dialogRefAddCurrency.close();

              } else {
                dialogRefAddCurrency.componentInstance.submitted = true;

                dialogRefAddCurrency.close();

                const succressDialog = this.dialog.open(ToastSuccessComponent, {
                  width: "30vw",
                  data: {
                    title: "تم ارسال طلبك",
                    message: data.message,
                    buttonSend: "طلبات الصلاحيات"
                  },
                });
                this.getPermissions(this.filteration);
                setTimeout(() => {
                  succressDialog.close();

                }, 2000);

                succressDialog.componentInstance.submitted = true;
                succressDialog.componentInstance.submitClicked.subscribe(result => {
                  succressDialog.close();

                })

              }

            },
            error: err => {
              dialogRefAddCurrency.componentInstance.submitted = true;

            }
          }
        )
      } else {
        this.userPermissionsService.createPermission(result).subscribe(
          {
            next: data => {

              if (data?.state === 2) {
                this.toast.error(data?.message);
                dialogRefAddCurrency.close();

              } else {
                dialogRefAddCurrency.componentInstance.submitted = true;

                dialogRefAddCurrency.close();

                const succressDialog = this.dialog.open(ToastSuccessComponent, {
                  width: "30vw",
                  data: {
                    title: "تم ارسال طلبك",
                    message: data.message,
                    buttonSend: "طلبات الصلاحيات"
                  },
                });
                this.getPermissions(this.filteration);
                setTimeout(() => {
                  succressDialog.close();

                }, 2000);

                succressDialog.componentInstance.submitted = true;
                succressDialog.componentInstance.submitClicked.subscribe(result => {
                  succressDialog.close();

                })

              }

            },
            error: err => {
              dialogRefAddCurrency.componentInstance.submitted = true;

            }
          }
        )
      }


    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  dialogPermissionFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogUserPermissionFileComponent, {
      width: "80vw",
      data: {
        title: "ملف الصلاحية"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id
  }



  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getPermissions(this.filteration)
  }


  reasonOfRefuse(data: any) {
    const reasonOfRefuseDialog = this.dialog.open(DialogDeleteComponent, {
      width: "30vw",
      data: {
        title: "هل متأكد من حذف الصلاحية؟",
        message: "برجاء توضيح السبب إن أمكن",

        titleClose: "تراجع",
        buttonSend: "حذف"
      },
    });

    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      this.userPermissionsService.deletePermission({ permissionId: data.id }).subscribe({
        next: res => {
          this.toast.success(res.message);
          reasonOfRefuseDialog.componentInstance.submitted = true;
          reasonOfRefuseDialog.close();
          this.getPermissions(this.filteration);
        },
        error: err => {
          reasonOfRefuseDialog.componentInstance.submitted = true;

        }
      })



    })
  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getPermissions(this.filteration)
  }
  minimumValidator(conInput: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      let checkMin = true;
      if (value != null) {

        if (this.filterForm.get(conInput)?.dirty && !this.filterForm.get(conInput)?.hasError('required')) {
          if (value > this.filterForm.get(conInput)?.value) {
            checkMin = false;
          }
        }
      }
      // const hasNumber = /\d/.test(value);
      return checkMin ? null : { numberIsBig: true };

    };
  }
  maximumValidator(conInput: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      let checkMin = true;

      if (value != null) {
        if (this.filterForm.get(conInput)?.dirty && !this.filterForm.get(conInput)?.hasError('required')) {
          if (value < this.filterForm.get(conInput)?.value) {
            checkMin = false;
          }
        }
      }
      // const hasNumber = /\d/.test(value);
      return checkMin ? null : { numberIsLess: true };
    };
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
