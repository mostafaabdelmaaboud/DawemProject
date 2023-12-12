import { ChangeDetectorRef, Component, Inject, LOCALE_ID, inject } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteShiftComponent } from 'src/app/shared/components/delete-shift/delete-shift.component';
import { AddAholidayComponent } from 'src/app/shared/components/add-aholiday/add-aholiday.component';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { EditAholidayComponent } from 'src/app/shared/components/edit-aholiday/edit-aholiday.component';
import { DialogHolidayFileComponent } from 'src/app/shared/components/dialog-holiday-file/dialog-holiday-file.component';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss']
})
export class HolidaysComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);

  columns: any[] = [
    {
      name: "#",
      field: "orderNumber",
    },
    {
      name: "اسم العطلة",
      field: "holidayName",
    },
    {
      name: "مدة العطلة",
      field: "vacationDuration"
    },
    {
      name: "تاريخ البداية",
      field: "startDate"
    },
    {
      name: "تاريخ النهاية",
      field: "expiryDate"
    },
    {
      name: "الملاحظات",
      field: "notes"
    },
    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  customers: any = [];

  isLoading = true;

  filteration: any = {
    page: 0,
    branchId: "7ecf59aa-a3c6-45d1-9f14-86671b814a8d",
    sort: "DESC",
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
  private _mobileQueryListener: () => void;

  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.customers = this.customers;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.customers = this.customers;

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
      { name: '1', code: '1' },
      { name: '2', code: '2' },
      { name: '3', code: '3' },
      { name: '4', code: '4' },
      { name: '5', code: '5' }
    ];

    this.customers = [
      {
        orderNumber: "01",
        holidayName: "عيد الفطر",
        vacationDuration: "7 أيام",
        startDate: "12/10/2023",
        expiryDate: "12/10/2023",
        notes: "ملاحظات المهمة"

      },
      {
        orderNumber: "02",
        holidayName: "عيد الأضحى",
        vacationDuration: "7 أيام",
        startDate: "12/10/2023",
        expiryDate: "12/10/2023",
        notes: "ملاحظات المهمة"
      },
      {
        orderNumber: "03",
        holidayName: "اليوم الوطني",
        vacationDuration: "7 أيام",
        startDate: "12/10/2023",
        expiryDate: "12/10/2023",
        notes: "ملاحظات المهمة"
      },
      {
        orderNumber: "04",
        holidayName: "يوم التأسيس",
        vacationDuration: "7 أيام",
        startDate: "12/10/2023",
        expiryDate: "12/10/2023",
        notes: "ملاحظات المهمة"
      },
      {
        orderNumber: "05",
        holidayName: "عطلة الافتتاح",
        vacationDuration: "7 أيام",
        startDate: "12/10/2023",
        expiryDate: "12/10/2023",
        notes: "ملاحظات المهمة"
      },
      {
        orderNumber: "06",
        holidayName: "عطلة رسمية",
        vacationDuration: "7 أيام",
        startDate: "12/10/2023",
        expiryDate: "12/10/2023",
        notes: "ملاحظات المهمة"
      },
      {

        orderNumber: "07",
        holidayName: "عطلة الافتتاح",
        vacationDuration: "7 أيام",
        startDate: "12/10/2023",
        expiryDate: "12/10/2023",
        notes: "ملاحظات المهمة"
      },
      {

        orderNumber: "08",
        holidayName: "عطلة الافتتاح",
        vacationDuration: "7 أيام",
        startDate: "12/10/2023",
        expiryDate: "12/10/2023",
        notes: "ملاحظات المهمة"
      },
      {

        orderNumber: "09",
        holidayName: "عطلة الافتتاح",
        vacationDuration: "7 أيام",
        startDate: "12/10/2023",
        expiryDate: "12/10/2023",
        notes: "ملاحظات المهمة"
      },
      {

        orderNumber: "10",
        holidayName: "عطلة الافتتاح",
        vacationDuration: "7 أيام",
        startDate: "12/10/2023",
        expiryDate: "12/10/2023",
        notes: "ملاحظات المهمة"
      },
    ];
    this.isLoading = false;
    this.totalItems = 3;
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  editHoliday() {

    const dialogRefAddCurrency = this.dialog.open(EditAholidayComponent, {
      width: "50vw",
      data: {
        title: "تعديل العطلة",
        titleHolidayName: "اسم العطلة",
        placeholdeHolidayName: "اسم العطلة",

        titleCalendarFirst: "تاريخ البداية",
        placeholderCalendarFirst: "اختار تاريخ البداية (هجري)",
        titleCalendarSecond: "تاريخ النهاية",
        placeholderCalendarSecond: "اختار تاريخ النهاية (هجري)",
        titleNotes: "ملاحظات",
        placeholdeNotes: "برجاء كتابة الملاحظات هنا",
        buttonSend: "حفظ التعديل",
        titleClose: "تراجع"
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
  dialogHolidayFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogHolidayFileComponent, {
      width: "40vw",
      data: {
        title: "ملف العطلة"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id

  }
  addAholiday() {
    const dialogRefAddCurrency = this.dialog.open(AddAholidayComponent, {
      width: "50vw",
      data: {
        title: "إضافة عطلة",
        titleHolidayName: "اسم العطلة",
        placeholdeHolidayName: "اسم العطلة",
        labelRadioButtonFirst: "العطلة بالتقويم",
        firstRadio: "الهجري",
        secondRadio: "الميلادي",
        titleCalendarFirst: "تاريخ البداية",
        placeholderCalendarFirst: "اختار تاريخ البداية (هجري)",
        titleCalendarSecond: "تاريخ النهاية",
        placeholderCalendarSecond: "اختار تاريخ النهاية (هجري)",
        titleNotes: "ملاحظات",
        placeholdeNotes: "برجاء كتابة الملاحظات هنا",
        buttonSend: "إضافة العطلة",
        titleClose: "تراجع"
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
  deleteRow() {
    const reasonOfRefuseDialog = this.dialog.open(DeleteShiftComponent, {
      width: "30vw",
      data: {
        title: "متأكد من حذف العطلة؟",
        message: "لا يمكن الرجوع في في هذا الأمر",
        titleClose: "تراجع",
        buttonSend: "حذف"
      },
    });
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.close();

    })
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
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
