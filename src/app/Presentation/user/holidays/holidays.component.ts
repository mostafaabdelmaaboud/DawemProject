import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
import { DialogHolidayFileComponent } from 'src/app/shared/components/dialog-holiday-file/dialog-holiday-file.component';
import { HolidaysService } from './services/holidays.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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

  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private toast: ToastrService, public translate: TranslateService, private fb: FormBuilder,
    private permissionsUserService: PermissionsUserService) {
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
      FreeText: [""],
      code: [""],

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
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 15, actionCode: data.actionCode })
  }
  getInformation() {
    this.spinnerCards = true;
    this.holidaysService.getInformation().subscribe({
      next: data => {
        ;
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
        ;
        this.holidays.push({
          id: اholiday.id,
          code: اholiday.code,
          name: اholiday.name,
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
        titleHolidayName: "اسم العطلة <span class='color-red'>*</span>",
        placeholdeHolidayName: "اسم العطلة",
        labelRadioButtonFirst: "العطلة بالتقويم",
        firstRadio: "الهجري",
        secondRadio: "الميلادي",
        setAsActive: "تعيين كنشط",
        validationtitleHolidayName: "اسم العطلة مطلوب",
        validationCalendarFirst: "تاريخ البداية مطلوب",
        validationCalendarSecond: "تاريخ النهاية مطلوب",
        validationtitleNotes: "الملاحظات مطلوبة",
        titleCalendarFirst: "تاريخ البداية <span class='color-red'>*</span>",
        placeholderCalendarFirst: "اختار تاريخ البداية",
        titleCalendarSecond: "تاريخ النهاية <span class='color-red'>*</span>",
        placeholderCalendarSecond: "اختار تاريخ النهاية",
        titleNotes: "ملاحظات <span class='color-red'>*</span>",
        placeholdeNotes: "برجاء كتابة الملاحظات هنا",
        buttonSend: "إضافة العطلة",
        titleClose: "تراجع"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editHoliday = false;


    // dialogRefAddCurrency.componentInstance.list = this.categories;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      ;
      formData.name = result.name;
      formData.isActive = result.isActive;
      formData.dateType = Number(result.dateType);
      formData.startDate = moment(result.startDate).format("YYYY-MM-DD");
      formData.endDate = moment(result.endDate).format("YYYY-MM-DD");
      formData.notes = result.notes;
      formData.isSpecifiedByYear = Array.isArray(result.isSpecifiedByYear) ? result.isSpecifiedByYear[0] : result.isSpecifiedByYear;

      dialogRefAddCurrency.componentInstance.submitted = false;
      dialogRefAddCurrency.componentInstance.loading = true;

      ;
      this.holidaysService.createHoliday(formData).subscribe(
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
                buttonSend: "طلبات العطلات"

              },
            });
            this.getHolidays(this.filteration);

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
  filter() {
    let filteration = { ...this.filteration }
    Object.entries(this.filterForm?.value).forEach(([key, value]: any) => {
      if (typeof value  === 'string') {
        filteration[key] = value.trim();
      } else {
        filteration[key] = value;

      }
    })
    this.getHolidays(filteration);
  }
  exportTableToExcel() {
    let data = document.getElementById("tableHolidaysHidden");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ExcelSheet.xlsx');
  }
  exportTableToPDF() {
    let table: any = document.getElementById("tableHolidaysHidden");
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100); 
      pdf.save('ملف_PDF.pdf');
    });
  

  }
  resetFilteration() {
    this.filterForm.get("FreeText")?.setValue("");
    this.filterForm.get("code")?.setValue("");

    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getHolidays(this.filteration);
  }
  editHoliday(data: any) {
    const dialogRefAddCurrency = this.dialog.open(AddAholidayComponent, {
      width: "50vw",
      data: {
        title: "تعديل عطلة",
        titleHolidayName: "اسم العطلة <span class='color-red'>*</span>",
        placeholdeHolidayName: "اسم العطلة",
        labelRadioButtonFirst: "العطلة بالتقويم",
        firstRadio: "الهجري",
        secondRadio: "الميلادي",
        setAsActive: "تعيين كنشط",
        validationtitleHolidayName: "اسم العطلة مطلوب",
        validationCalendarFirst: "تاريخ البداية مطلوب",
        validationCalendarSecond: "تاريخ النهاية مطلوب",
        validationtitleNotes: "الملاحظات مطلوبة",
        titleCalendarFirst: "تاريخ البداية <span class='color-red'>*</span>",
        placeholderCalendarFirst: "اختار تاريخ البداية",
        titleCalendarSecond: "تاريخ النهاية <span class='color-red'>*</span>",
        placeholderCalendarSecond: "اختار تاريخ النهاية",
        titleNotes: "ملاحظات <span class='color-red'>*</span>",
        placeholdeNotes: "برجاء كتابة الملاحظات هنا",
        buttonSend: "حفظ العطلة",
        titleClose: "تراجع"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editHoliday = true;
    dialogRefAddCurrency.componentInstance.id = data.id;


    // dialogRefAddCurrency.componentInstance.list = this.categories;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      ;
      formData.id = data.id;

      formData.name = result.name;
      formData.isActive = result.isActive;
      formData.dateType = Number(result.dateType);
      formData.startDate = moment(result.startDate).format("YYYY-MM-DD");
      formData.endDate = moment(result.endDate).format("YYYY-MM-DD");
      formData.notes = result.notes;
      formData.isSpecifiedByYear = Array.isArray(result.isSpecifiedByYear) ? result.isSpecifiedByYear[0] : result.isSpecifiedByYear;

      dialogRefAddCurrency.componentInstance.submitted = false;
      dialogRefAddCurrency.componentInstance.loading = true;

      ;
      this.holidaysService.updateHoliday(formData).subscribe(
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
                buttonSend: "طلبات العطلات"

              },
            });
            this.getHolidays(this.filteration);

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
  enabledRow(data: any) {

    this.holidaysService.enabledHoliday({ HolidayId: data.id }).subscribe(
      {
        next: res => {

          this.toast.success(res.message);
          this.getHolidays(this.filteration);
        },
        error: err => {

        }
      }
    )
  }
  reasonOfRefuse(data: any) {
    const reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
      width: "40vw",
      data: {
        title: "متأكد من تعليق العطلة؟",
        message: "برجاء توضيح السبب إن أمكن ليظهر للموظف عند محاولة تسجيل الدخول",
        titleReasonOfRefuse: "سبب التعليق",
        placeholdeReasonOfRefuse: "برجاء كتابة سبب الرفض ليظهر للموظف",
        titleClose: "تراجع",
        buttonSend: "تعليق الحساب"
      },
    });
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      this.holidaysService.disableHoliday({ id: data.id, disableReason: result.notes }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getHolidays(this.filteration);
            reasonOfRefuseDialog.close();
          },
          error: err => {
            reasonOfRefuseDialog.componentInstance.submitted = true;

          }
        }
      )

    })
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
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getHolidays(this.filteration)
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
