import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { UserPermissionsService } from './services/user-permissions.service';
import { AddUserPermissionAdminComponent } from 'src/app/shared/components/add-user-permission-admin/add-user-permission-admin.component';
import { DialogDeleteComponent } from 'src/app/shared/components/dialog-delete/dialog-delete.component';
import { DialogUserPermissionFileAdminComponent } from 'src/app/shared/components/dialog-user-permission-file-admin/dialog-user-permission-file-admin.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';
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
  destroy$: Subject<boolean> = new Subject<boolean>();


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
      name: "الحالة",
      field: "isActive"
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
  permissionsIsExport: any = [];
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
  defaultRowPerPage = { name: '5', code: 5 };

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
      this.date = new Date();

    });
  }
  ngOnInit(): void {
    if (this.mobileQuery.matches) {
      this.opened = true;
    } else {
      this.opened = false;

    }
    this.filterForm = this.fb.group({
      FreeText: [""],
      code: [""],

    });
    this.categories.push({ name: "adasd", key: "adsas" });
    this.RowsPerPage = [
      { name: '2', code: 2 },
      { name: '5', code: 5 }

    ];
    this.getInformation();

    this.getPermissions(this.filteration);
    this.translate.get("userPermissions").subscribe(data => {
      this.columns =  [
        {
          name: data.permissionNumber,
          field: "code",
        },
        {
          name: data.permissionType,
          field: "forTypeName"
        },
        {
          name: data.permissionNameUser,
          field: "roleOrUserName",
        },
        {
          name: data.theCondition,
          field: "isActive"
        },
        {
          name: data.numberOfScreensAllowed,
          field: "allowedScreensCount"
        },
        {
          name: data.action,
          field: "actions"
        }
      ];
    })
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(dataParent => {
      this.translate.get("userPermissions").subscribe(data => {
        this.columns =  [
          {
            name: data.permissionNumber,
            field: "code",
          },
          {
            name: data.permissionType,
            field: "forTypeName"
          },
          {
            name: data.permissionNameUser,
            field: "roleOrUserName",
          },
          {
            name: data.theCondition,
            field: "isActive"
          },
          {
            name: data.numberOfScreensAllowed,
            field: "allowedScreensCount"
          },
          {
            name: data.action,
            field: "actions"
          }
        ];
      })
      // this.subscription = this.translate.stream('primeng').subscribe(data => {
      //   this.config.setTranslation(data);
      // });  
    })
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  showActions(data: any) {
    return this.permissionsUserService.checkPermissionAdmin({ type: "actions", screenCode: 19, actionCode: data.actionCode })
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
          roleOrUserName: permission.responsibilityOrUserName ? permission.responsibilityOrUserName : "لا يوجد",
          forTypeName: permission.forTypeName,
          allowedScreensCount: permission.allowedScreensCount,
          isActive: permission.isActive ? "نشط" : 'غير نشط'
        });
      });
      this.totalItems = data.totalCount
      this.isLoading = false;

    })
  }
  filter() {
    Object.entries(this.filterForm?.value).forEach(([key, value]: any) => {
      if (typeof value  === 'string') {
        if(value != "") {
          this.filteration[key] = value.trim();
        }
      } else {
        if(value >=0) {
          this.filteration[key] = value;
        }
      }
    });
    this.filteration.PageNumber = 0;
    this.getPermissions(this.filteration);
  }
  exportTableToExcel() {
    let columns = [...this.columns];
    delete columns[4]
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'الصلاحيات',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };

    if(!this.isLoading) {
      this.isLoading = true;
      this.permissionsIsExport = [];
      let filteration = {...this.filteration, isExport:true};

      this.userPermissionsService.listPermissions(filteration).subscribe(data => {
        data.data.forEach((permission: any) => {
          this.permissionsIsExport.push({
            id: permission.id,
            code: permission.code,
            roleOrUserName: permission.responsibilityOrUserName ? permission.responsibilityOrUserName : "لا يوجد",
            forTypeName: permission.forTypeName,
            allowedScreensCount: permission.allowedScreensCount,
            isActive: permission.isActive ? "نشط" : 'غير نشط'
          });
        });
        let formatTable = this.permissionsIsExport.map(permission => {
      
          return {
            code: permission.code,
            forTypeName: permission.forTypeName,
            roleOrUserName: permission.roleOrUserName,
            allowedScreensCount: permission.allowedScreensCount
          }
        })
        this.isLoading = false;
        new ngxCsv(formatTable, "sheet", options);
  
      })
    }
  }
  exportTableToPDF() {
    if(!this.isLoading) {
      this.isLoading = true;
      let table: any = document.getElementById("tablePermissionsHidden");
      html2canvas(table,{
        scale: 5,
        width: table.offsetWidth,
        height: table.offsetHeight, 
    }).then((canvas) => {
      let fileWidth = 190;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, fileWidth, fileHeight); 
        pdf.save('ملف_PDF.pdf');
        this.isLoading = false;

      });

    }

  }
  resetFilteration() {
    this.filterForm.get("FreeText")?.setValue("");
    this.filterForm.get("code")?.setValue("");

    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getPermissions(this.filteration);
  }
  addUserPermission() {
    let dialogRefAddCurrency!:MatDialogRef<AddUserPermissionAdminComponent, any>;
    this.translate.get("userPermissions").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(AddUserPermissionAdminComponent, {
        width: "90vw",
        maxWidth: "90vw",
        data: {
          title: translate.addPermission,
          setAsActive: translate.setAsActive,
          labelRadioButton: translate.type,
          firstRadio: "مسؤولية",
          titleFieldDisabled:"الكود",
          secondRadio: translate.user,
          titleRoleId: "نوع المسؤولية",
          placeholdeRoleId: "نوع المسؤولية",
          ValidationRoleId: translate.positionTypeRequired,
          titleUserId: translate.userType,
          placeholdeUserId: translate.userType,
          ValidationUserId: translate.userTypeRequired,
          titleClose: translate.toRetreat,
          buttonSend: translate.addPermission
        },
      });
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
                let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
                  this.translate.get("userPermissions").subscribe(translate => {
                    succressDialog = this.dialog.open(ToastSuccessComponent, {
                      width: "30vw",
                      data: {
                        title: translate.yourRequestHasBeenSent,
                        message: data.message,
                        buttonSend: translate.permissionRequests
                      },
                    });
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
                let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
                this.translate.get("userPermissions").subscribe(translate => {
                  succressDialog = this.dialog.open(ToastSuccessComponent, {
                    width: "30vw",
                    data: {
                      title: translate.yourRequestHasBeenSent,
                      message: data.message,
                      buttonSend: translate.permissionRequests
                    },
                  });
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
    let dialogRefAddCurrency!:MatDialogRef<AddUserPermissionAdminComponent, any>;
    this.translate.get("userPermissions").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(AddUserPermissionAdminComponent, {
        width: "90vw",
        maxWidth: "90vw",
        data: {
          title: translate.modifyPermission,
          setAsActive: translate.setAsActive,
          labelRadioButton: translate.type,
          firstRadio: "مسؤولية",
          titleFieldDisabled:"الكود",
          secondRadio: translate.user,
          titleRoleId: "نوع المسؤولية",
          placeholdeRoleId:"نوع المسؤولية",
          ValidationRoleId: translate.positionTypeRequired,
          titleUserId: translate.userType,
          placeholdeUserId: translate.userType,
          ValidationUserId: translate.userTypeRequired,
          titleClose: translate.toRetreat,
          buttonSend: translate.savePermission
        },
      });
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

                let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
                this.translate.get("userPermissions").subscribe(translate => {
                  succressDialog = this.dialog.open(ToastSuccessComponent, {
                    width: "30vw",
                    data: {
                      title: translate.yourRequestHasBeenSent,
                      message: data.message,
                      buttonSend: translate.permissionRequests
                    },
                  });
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
                let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
                this.translate.get("userPermissions").subscribe(translate => {
                  succressDialog = this.dialog.open(ToastSuccessComponent, {
                    width: "30vw",
                    data: {
                      title: translate.yourRequestHasBeenSent,
                      message: data.message,
                      buttonSend: translate.permissionRequests
                    },
                  });
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
    let dialogRefAddCurrency!:MatDialogRef<DialogUserPermissionFileAdminComponent, any>;
    this.translate.get("userPermissions").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(DialogUserPermissionFileAdminComponent, {
        width: "80vw",
        data: {
          title: translate.permissionFile
        },
      });
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
    let reasonOfRefuseDialog!:MatDialogRef<DialogDeleteComponent, any>;
    this.translate.get("userPermissions").subscribe(translate => {
      reasonOfRefuseDialog = this.dialog.open(DialogDeleteComponent, {
        width: "30vw",
        data: {
          title: translate.areYouSureYouWantToDeletePermission,
          message: translate.pleaseExplainWhyIfPossible,
          titleClose: translate.toRetreat,
          buttonSend: translate.delete
        },
      });
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
  ngOnDestroy() {
    this.destroy$.next(true);
    this.subscription.unsubscribe();
  }
}
