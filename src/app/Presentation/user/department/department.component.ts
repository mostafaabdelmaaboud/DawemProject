import { ChangeDetectorRef, Component, Inject, LOCALE_ID, inject } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddTimeComponent } from 'src/app/shared/components/dialog-add-time/dialog-add-time.component';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { DepartmentService } from './services/department.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  list: any[] = [
    { name: "نسيان تسجيل حضور", key: "1" },
    { name: "نسيان تسجيل انصراف", key: "2" },
    { name: "تسجيل حضور خاطئ", key: "3" },
    { name: "تسجيل انصراف خاطئ", key: "4" }
  ];
  columns: any[] = [
    {
      name: "رقم الموظف",
      field: "orderNumber",
    },
    {
      name: "اسم الموظف",
      field: "name",
    },
    {
      name: "التاريخ",
      field: "date"
    },
    {
      name: "وقت الحضور",
      field: "audience"
    },
    {
      name: "وقت الخروج",
      field: "dismissing"
    },
    {
      name: "الحالة",
      field: "status"
    },
    {
      name: "الفرق",
      field: "timeGap"
    },
    {
      name: "المكان",
      field: "zone"
    },

    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  department: any = [];
  private dialog = inject(MatDialog);

  isLoading = true;

  filteration: any = {
    PageSize: 5,
    PageNumber: 0,
    Month: 11,
    Year: 2023,
    PagingEnabled: true
  };

  services: any[] = [
    { name: 'Cash in', key: 'cashIn' },
    { name: 'Cash out', key: 'cashOut' }
  ];
  page = 0;
  categories: any[] = [
  ];
  private departmentService = inject(DepartmentService);

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
  private _mobileQueryListener: () => void;
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.department = this.department;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.department = this.department;

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


    this.getDepartment(this.filteration)
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  getDepartment(filteration: any) {
    this.department = [];
    this.isLoading = true;
    this.departmentService.listAttendance(filteration).subscribe(data => {
      data.data.employeeAttendances.forEach((attendacne: any) => {
        this.department.push({
          id: attendacne.id,
          orderNumber: attendacne.id,
          name: attendacne.employeeName,
          date: moment(new Date(attendacne.date)).format("MM/DD/YYYY"),
          audience: attendacne.checkInTime.replaceAll(' ', '') ? attendacne.checkInTime : "لا يوجد",
          dismissing: attendacne.checkOutTime.replaceAll(' ', '') ? attendacne.checkOutTime : "لا يوجد",
          status: attendacne.status,
          timeGap: attendacne.timeGap,
          zone: attendacne.zoneName
        })
      });


      this.totalItems = data.data.totalCount
      this.isLoading = false;
    })
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {

    this.filteration = { ...this.filteration, PageSize: data.value.code };

    this.getDepartment(this.filteration)
  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getDepartment(this.filteration)
  }
  addEmployment() {
    const dialogRefAddCurrency = this.dialog.open(DialogAddTimeComponent, {
      width: "50vw",
      data: {
        title: "إضافة دوام",
        titleDropdownFirst: "اسم الموظف <span class='color-red'>*</span>",
        placeholderDropdownFirst: "اسم الموظف",
        validationtitleDropdownFirst: "اسم الموظف مطلوب",
        titleCalendarFirst: "التاريخ <span class='color-red'>*</span>",
        validationCalendarFirst: "التاريخ مطلوب",
        placeholderCalendarFirst: "بداية - نهاية",
        titleCalendarSecond: "وقت الحضور <span class='color-red'>*</span>",
        placeholderCalendarSecond: "وقت الحضور",
        validationCalendarSecond: "وقت الحضور مطلوب",
        titleCalendarThird: "وقت الانصراف <span class='color-red'>*</span>",
        placeholderCalendarThird: "وقت الانصراف ",
        validationCalendarThird: "وقت الانصراف مطلوب",
        titleNotes: "ملاحظات",
        placeholdeNotes: "برجاء كتابة الملاحظات هنا",
        titleClose: "تراجع",
        buttonSend: "إضافة الدوام"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    // dialogRefAddCurrency.componentInstance.list = this.categories;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      dialogRefAddCurrency.close();

      const succressDialog = this.dialog.open(ToastSuccessComponent, {
        width: "30vw",
        data: {
          title: "تم ارسال طلبك",
          message: "طلبك في انتظار الموافقة، ويمكنك متابعة حالة الطلب من صفحة التبريرات",
          buttonSend: "طلبات التبريرات"
        },
      });
      setTimeout(() => {
        succressDialog.close();

      }, 2000);
      succressDialog.componentInstance.submitted = true;
      succressDialog.componentInstance.submitClicked.subscribe(result => {
        succressDialog.close();

      })
      dialogRefAddCurrency.componentInstance.submitted = false;
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  editEmployment() {
    const dialogRefAddCurrency = this.dialog.open(DialogAddTimeComponent, {
      width: "50vw",
      data: {
        title: "تعديل دوام",
        titleDropdownFirst: "اسم الموظف <span class='color-red'>*</span>",
        placeholderDropdownFirst: "اسم الموظف",
        validationtitleDropdownFirst: "اسم الموظف مطلوب",
        titleCalendarFirst: "التاريخ <span class='color-red'>*</span>",
        validationCalendarFirst: "التاريخ مطلوب",
        placeholderCalendarFirst: "بداية - نهاية",
        titleCalendarSecond: "وقت الحضور <span class='color-red'>*</span>",
        placeholderCalendarSecond: "وقت الحضور",
        validationCalendarSecond: "وقت الحضور مطلوب",
        titleCalendarThird: "وقت الانصراف <span class='color-red'>*</span>",
        placeholderCalendarThird: "وقت الانصراف ",
        validationCalendarThird: "وقت الانصراف مطلوب",
        titleNotes: "ملاحظات",
        placeholdeNotes: "برجاء كتابة الملاحظات هنا",
        titleClose: "تراجع",
        buttonSend: "إضافة الدوام"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    // dialogRefAddCurrency.componentInstance.list = this.categories;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      dialogRefAddCurrency.close();

      const succressDialog = this.dialog.open(ToastSuccessComponent, {
        width: "30vw",
        data: {
          title: "تم ارسال طلبك",
          message: "طلبك في انتظار الموافقة، ويمكنك متابعة حالة الطلب من صفحة التبريرات",
          buttonSend: "طلبات التبريرات"
        },
      });
      setTimeout(() => {
        succressDialog.close();

      }, 2000);
      succressDialog.componentInstance.submitted = true;
      succressDialog.componentInstance.submitClicked.subscribe(result => {
        succressDialog.close();

      })
      dialogRefAddCurrency.componentInstance.submitted = false;
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  deleteRow(data: any) {
    const reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
      width: "30vw",
      data: {
        title: "متأكد من حذف الحضور والانصراف؟",
        message: "برجاء توضيح السبب إن أمكن ليظهر للموظف كتنبيه في التطبيق",
        titleReasonOfRefuse: "سبب الحذف",
        placeholdeReasonOfRefuse: "برجاء كتابة سبب الحذف ان امكن",
        titleClose: "تراجع",
        buttonSend: "حذف"
      },
    });
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      // this.departmentService.deleteAttendance({ departmentid: data.id }).subscribe(
      //   {
      //     next: res => {

      //       this.toast.success(res.message);
      //       reasonOfRefuseDialog.componentInstance.submitted = true;
      //       this.getDepartment(this.filteration);
      //       reasonOfRefuseDialog.close();
      //     },
      //     error: err => {
      //       reasonOfRefuseDialog.componentInstance.submitted = true;

      //     }
      //   }
      // )

    })
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

    // if (this.filteration.page < even) {
    //   if (this.page === 0) {
    //     if (this.filteration.page + 1 < even) {
    //       let minusCurrentPage = even - this.filteration.page;
    //       this.page += this.itemsPerPage * minusCurrentPage;
    //     } else {
    //       this.page = this.itemsPerPage;
    //     }
    //   } else {
    //     if (this.filteration.page + 1 < even) {
    //       let minusCurrentPage = even - this.filteration.page;
    //       this.page += this.itemsPerPage * minusCurrentPage;

    //     } else {
    //       this.page += this.itemsPerPage;

    //     }
    //   }
    // } else {
    //       //   if (this.filteration.page > even + 1) {
    //     let minusCurrentPage = this.filteration.page - even;
    //     this.page -= this.itemsPerPage * minusCurrentPage;

    //   } else {
    //     this.page -= this.itemsPerPage;

    //   }
    //   this.page -= this.itemsPerPage;
    // }

    this.filteration.page = even;
    let filteration = { ...this.filteration, page: even - 1 };
    // this.getListTransaction(filteration)

  }
  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
