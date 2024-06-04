import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { DialogDeleteComponent } from 'src/app/shared/components/dialog-delete/dialog-delete.component';
import { RequestJobTitleComponent } from 'src/app/shared/components/request-job-title/request-job-title.component';
import { DialogJobTitleFileComponent } from 'src/app/shared/components/dialog-job-title-file/dialog-job-title-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { DialogResponsibilityFileAdminComponent } from 'src/app/shared/components/dialog-responsibility-file-admin/dialog-responsibility-file-admin.component';
import { RequestResponsibilityAdminComponent } from 'src/app/shared/components/request-responsibility-admin/request-responsibility-admin.component';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { ScreenGroupsService } from './services/screen-groups.service';
import { UpdateScreenGroupsComponent } from './dialogs/update-screen-groups/update-screen-groups.component';
import { ScreenGroupFileComponent } from './dialogs/screen-group-file/screen-group-file.component';


@Component({
  selector: 'app-screen-groups',
  templateUrl: './screen-groups.component.html',
  styleUrls: ['./screen-groups.component.scss']
})
export class ScreenGroupsComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);

  columns: any[] = [

    {
      name: "إسم المجموعة",
      field: "name",
    },
    {
      name: "المجموعة الأم",
      field: "parentName",
    },
    {
      name:"نوع التطبيق",
      field: "authenticationTypeName",
    },
    {
      name: "الحالة",
      field: "isActive"
    },
    {
      name: "الاجراءات",
      field: "actions"
    }

  ];
  screens: any = [];
  screensIsExport: any = [];
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
  private screenGroupsService = inject(ScreenGroupsService);
  list: any[] = [
    { name: "نسيان تسجيل حضور", key: "1" },
    { name: "نسيان تسجيل انصراف", key: "2" },
    { name: "تسجيل حضور خاطئ", key: "3" },
    { name: "تسجيل انصراف خاطئ", key: "4" }
  ];
  defaultRowPerPage = { name: '5', code: 5 };

  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');
    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.screens = this.screens;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.screens = this.screens;
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
      FreeText: [""],
      code: [""],

    });
    this.categories.push({ name: "adasd", key: "adsas" });
    this.RowsPerPage = [
      { name: '2', code: 2 },
      { name: '5', code: 5 }

    ];
    this.getInformation();

    this.getScreens(this.filteration);
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
    this.getScreens(this.filteration);
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
      title: 'مجموعات الشاشات',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };

    if(!this.isLoading) {
      this.isLoading = true;
      this.screensIsExport = [];
      let filteration = {...this.filteration, isExport:true};
   
      this.screenGroupsService.getScreens(filteration).subscribe(
        {
          next: data => {
   
            data.data.forEach((screen: any) => {
              this.screensIsExport.push({
                id: screen.id,
                name: screen.name ?  screen.name : "لا يوجد",
              parentName: screen.parentName ? screen.parentName : "لا يوجد",
              authenticationTypeName: screen.authenticationTypeName ? screen.authenticationTypeName : "لا يوجد",
                isActive: screen.isActive
  
              })
            });
            let formatTable = this.screensIsExport.map(screen => {
      
              return {
                name: screen.name,
                parentName: screen.parentName,
                authenticationTypeName: screen.authenticationTypeName,
                isActive: screen.isActive ? 'نشط' : 'غير نشط'
              }
            })
            this.isLoading = false;
            new ngxCsv(formatTable, "sheet", options);
          },
          error: err => {
            this.isLoading = false;
  
          }
        }
      )
    }
  }
  exportTableToPDF() {
    if(!this.isLoading) {
      this.isLoading = true;
      let table: any = document.getElementById("plansHidden");
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
    this.getScreens(this.filteration);
  }
  getInformation() {
    this.spinnerCards = true;
    this.screenGroupsService.getInformation().subscribe({
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
  getScreens(filteration: any) {
    this.screens = [];
    this.isLoading = true;
    this.screenGroupsService.getScreens(filteration).subscribe(
      {
        next: data => {
          data.data.forEach((screen: any) => {
            this.screens.push({
              id: screen.id,
              name: screen.name ?  screen.name : "لا يوجد",
              parentName: screen.parentName ? screen.parentName : "لا يوجد",
              authenticationTypeName: screen.authenticationTypeName ? screen.authenticationTypeName : "لا يوجد",
              isActive: screen.isActive

            })
          });
          this.totalItems = data.totalCount
          this.isLoading = false;
        },
        error: err => {
          this.isLoading = false;

        }
      }
    )
  }
  showActions(data: any) {
    if(localStorage.getItem('adminPermissions')) {
      return this.permissionsUserService.checkPermissionAdmin({ type: "actions", screenCode: 4, actionCode: data.actionCode })

    } else {
      return ""
    }

  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getScreens(this.filteration)
  }
  sendRequest(data: any) {

    this.screenGroupsService.accept({ screenGroupId: data.id }).subscribe(
      {
        next: res => {
          this.getScreens(this.filteration);
          const succressDialog = this.dialog.open(ToastSuccessComponent, {
            width: "30vw",
            data: {
              title: "تم قبول الطلب",
              message: res.message,
              buttonSend: "اغلاق"
            },
          });
          setTimeout(() => {
            succressDialog.close();

          }, 2000);
          succressDialog.componentInstance.submitted = true;
          succressDialog.componentInstance.submitClicked.subscribe(result => {
            succressDialog.close();

          })
        },
        error: err => {

        }
      }
    )

  }

  reasonOfRefuse(data: any) {

    let reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
      width: "30vw",
      data: {
        title: "هل متأكد من تعطيل مجموعة الشاشة ؟",
        message: "برجاء توضيح السبب إن أمكن",
        titleReasonOfRefuse:"سبب التعطيل",
        placeholdeReasonOfRefuse: "برجاء كتابة سبب التعطيل",
        titleClose:"تراجع",
        buttonSend: "تعطيل مجموعة الشاشة"
      },
    });

    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;

      this.screenGroupsService.screenDisable({ id: data.id, disableReason: result.notes }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getScreens(this.filteration);
            reasonOfRefuseDialog.close();
          },
          error: err => {
            reasonOfRefuseDialog.componentInstance.submitted = true;

          }
        }
      )
    })
  }


  requestScreen() {
    const dialogRefAddCurrency = this.dialog.open(UpdateScreenGroupsComponent, {
      width: "50vw",
      data: {
        title: "إضافة مجموعة شاشة",
        setAsNecessary: "تعيين كنشط",
        titleVacationTypeId: "نوع الاسنئذان <span class='color-red'>*</span>",
        titleName: "الأسم<span class='color-red'>*</span>",
        placeholdeName: "برجاء ادخال الأسم",
        validationtitleName: "الأسم مطلوب",
        buttonSend:"إضافة مجموعة شاشة",
        titleClose: "تراجع"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editScreen = false;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      formData.NameTranslations = result.NameTranslations.map(translate => {
        return {
          LanguageId: translate.LanguageId.id, 
          Name: translate.name
        }
      })
      formData.AuthenticationType = Number(result.AuthenticationType);
      formData.ParentId = result.ParentId.id;
      formData.Order = result.Order;
      formData.Icon = result.Icon;
      formData.IsActive = result.IsActive;
      formData.Notes = result.Notes;
      dialogRefAddCurrency.componentInstance.submitted = false;
      dialogRefAddCurrency.componentInstance.loading = true;

      
      this.screenGroupsService.createScreen(formData).subscribe(
        {
          next: (data: any) => {

            
            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الشاشات"

              },
            });
            this.getScreens(this.filteration);

            setTimeout(() => {
              succressDialog.close();

            }, 2000);
            succressDialog.componentInstance.submitted = true;
            succressDialog.componentInstance.submitClicked.subscribe(result => {
              succressDialog.close();
            })

          },
          error: (err: any) => {
            

            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;

          }
        }
      )
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  editScreen(data: any) {
    const dialogRefAddCurrency = this.dialog.open(UpdateScreenGroupsComponent, {
      width: "50vw",

      data: {
        title: "تعديل مجموعة الشاشة",
        setAsNecessary: "تعيين كنشط",
        titleVacationTypeId: "نوع الاستئذانات <span class='color-red'>*</span>",
        titleName: "الأسم<span class='color-red'>*</span>",
        placeholdeName: "برجاء ادخال الأسم",
        validationtitleName: "الأسم مطلوب",
        buttonSend:"تعديل مجموعة الشاشة",
      titleClose: "تراجع"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editScreen = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      
      formData.Id = data.id;
      formData.NameTranslations = result.NameTranslations.map(translate => {
        return {
          Id:translate.id,
          LanguageId: translate.LanguageId.id, 
          Name: translate.name
        }
      })
      formData.AuthenticationType = result.AuthenticationType;
      formData.ParentId = result.ParentId.id;
      formData.Order = result.Order;
      formData.Icon = result.Icon;
      formData.IsActive = result.IsActive;
      formData.Notes = result.Notes;




      dialogRefAddCurrency.componentInstance.submitted = false;

      this.screenGroupsService.updateScreen(formData).subscribe(
        {
          next: (data: any) => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الشاشات"

              },
            });
            this.getScreens(this.filteration);

            setTimeout(() => {
              succressDialog.close();

            }, 2000);
            succressDialog.componentInstance.submitted = true;
            succressDialog.componentInstance.submitClicked.subscribe(result => {
              succressDialog.close();
            })

          },
          error: (err: any) => {

            dialogRefAddCurrency.componentInstance.submitted = true;

          }
        }
      )
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }


  dialogScreenFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(ScreenGroupFileComponent, {
      width: "40vw",
      data: {
        title: "ملف مجموعة الشاشة"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id

  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getScreens(this.filteration)
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

  changePage(even: number) {

    this.filteration.page = even;
    let filteration = { ...this.filteration, page: even - 1 };
    this.getScreens(filteration)

  }
  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
