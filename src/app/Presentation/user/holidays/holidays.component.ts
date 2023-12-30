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
import { HolidaysService } from './services/holidays.service';
import * as moment from 'moment';

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
      name: "الكود",
      field: "code",
    },
    {
      name: "الاسم",
      field: "name",
    },
    {
      name: "نوع العطلة",
      field: "dateType"
    },
    {
      name: "تاريخ البداية",
      field: "startDate"
    },
    {
      name: "تاريخ النهاية",
      field: "endDate"
    },
    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  holidays: any = [];

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
  private holidaysService = inject(HolidaysService);
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

  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.holidays = this.holidays;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.holidays = this.holidays;

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

    this.getHolidays(this.filteration)

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  getInformation() {
    this.spinnerCards = true;
    this.holidaysService.getInformation().subscribe({
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
  getHolidays(filteration: any) {
    this.holidays = [];
    this.isLoading = true;
    this.holidaysService.listHolidays(filteration).subscribe(data => {
      data.data.forEach((اholiday: any) => {

        this.holidays.push({
          id: اholiday.id,
          code: اholiday.code,
          isActive: اholiday.isActive,
          dateType: اholiday.dateType,
          startDate: اholiday.startDate,
          endDate: اholiday.endDate,
        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;


    })
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {

    this.filteration = { ...this.filteration, PageSize: data.value.code };

    this.getHolidays(this.filteration)
  }
  addholiday() {
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
