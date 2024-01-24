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
import { ShiftsService } from './services/shifts.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DialogShiftFileComponent } from 'src/app/shared/components/dialog-shift-file/dialog-shift-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import * as XLSX from 'xlsx';
import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss']
})
export class ShiftsComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  private shiftsService = inject(ShiftsService);


  columns: any[] = [
    {
      name: "رقم الوردية",
      field: "shiftNumber",
    },
    {
      name: "اسم الوردية",
      field: "shiftName",
    },
    {
      name: "وقت الدخول",
      field: "entryTime"
    },
    {
      name: "وقت الخروج",
      field: "timeToGoOut"
    },
    {
      name: "الدقائق المسموحة",
      field: "allowedMinutes"
    },
    {
      name: "موظفين الوردية",
      field: "shiftStaff"
    },
    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  shifts: any = [];

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
        this.shifts = this.shifts;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.shifts = this.shifts;

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


    this.getShifts(this.filteration)
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  filter() {
    let filteration = { ...this.filteration }
    Object.entries(this.filterForm?.value).forEach(([key, value]: any) => {
        if (value) {
          filteration[key] = value.trim();
        }
    })
    this.getShifts(filteration);
  }
  exportTableToExcel() {
    let data = document.getElementById("tableshift");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ExcelSheet.xlsx');
  }
  exportTableToPDF() {
    let table: any = document.getElementById("tableshift");

    let option = {
      margin: 0,
      filename: "output.pdf",
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 8 },
      jsPDF: { unit: "in", format: 'letter', orientation: 'portrait' }
    }
    html2pdf().from(table).set(option).save()

  }
  resetFilteration() {
    this.filterForm.get("FreeText")?.setValue("");
    this.filterForm.get("code")?.setValue("");

    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getShifts(this.filteration);
  }
  getInformation() {
    this.spinnerCards = true;
    this.shiftsService.getInformation().subscribe({
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
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 32, actionCode: data.actionCode })
  }
  getShifts(filteration: any) {
    this.shifts = [];
    this.isLoading = true;
    this.shiftsService.listShifts(filteration).subscribe(
      {
        next: data => {

          data?.data?.forEach((employee: any) => {

            this.shifts.push({
              id: employee.id,
              shiftNumber: employee.code,
              shiftName: employee.name ? employee.name : "لا يوجد",
              entryTime: employee.checkInTime ? employee.checkInTime : "لا يوجد",
              timeToGoOut: employee.checkOutTime ? employee.checkOutTime : "لا يوجد",
              allowedMinutes: employee.allowedMinutes ? employee.allowedMinutes : "لا يوجد",
              shiftStaff: employee.timePeriod ? employee.timePeriod : "لا يوجد",

            })
          });
          this.totalItems = data?.totalCount
          this.isLoading = false;

        },
        error: err => {
          this.isLoading = false;

        }
      }
    )
  }
  dialogShiftFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogShiftFileComponent, {
      width: "40vw",
      data: {
        title: "ملف الوردية"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {

    this.filteration = { ...this.filteration, PageSize: data.value.code };

    this.getShifts(this.filteration)
  }
  addShift() {
    const dialogRefAddCurrency = this.dialog.open(AddShiftComponent, {
      width: "50vw",
      data: {
        title: "إضافة وردية",

        titleShift: "اسم الوردية <span class='color-red'>*</span>",
        placeholdeShift: "اسم القسم",
        validationtitleShift: "اسم القسم مطلوب",
        titlePermanentType: "نوع الدوام <span class='color-red'>*</span>",
        placeholderPermanentType: " اختار نوع الدوام",
        validationtitlePermanentType: "نوع الدوام مطلوب",
        entryTime: "وقت الدخول <span class='color-red'>*</span>",
        validationEntryTime: "وقت الدخول مطلوب",
        firstRadio: "صباحي",
        secondRadio: "مسائي",
        validationToGoOut: "وقت الخروج مطلوب",
        placeholderEntryTime: "وقت الدخول",
        titletimeToGoOut: "وقت الخروج <span class='color-red'>*</span>",
        validationtitleExtraMinutes: "الدقائق المسموحة مطلوبه",
        placeholdertimeToGoOut: "وقت الخروج",
        extraMinutes: "الدقائق المسموحة <span class='color-red'>*</span>",
        placeholdeExtraMinutes: "عدد الدقائق المسموحة",
        titleClose: "تراجع",
        buttonSend: "إضافة وردية"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editShift = false;

    // dialogRefAddCurrency.componentInstance.list = this.categories;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {

      let formData = result;
      formData.checkInTime = moment(result.checkInTime).format("hh:mm:ss");
      formData.checkOutTime = moment(result.checkOutTime).format("hh:mm:ss")
      formData.timePeriod = Number(formData.timePeriod);
      formData.isActive = true;

      this.shiftsService.createShift(formData).subscribe(
        {
          next: data => {

            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الموظفين"
              },
            });
            this.getShifts(this.filteration);

            setTimeout(() => {
              succressDialog.close();

            }, 2000);

            succressDialog.componentInstance.submitted = true;
            succressDialog.componentInstance.submitClicked.subscribe(result => {


              succressDialog.close();

            })

          },
          error: err => {
            dialogRefAddCurrency.close();

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
  editShift(data: any) {
    const dialogRefAddCurrency = this.dialog.open(AddShiftComponent, {
      width: "50vw",
      data: {
        title: "تعديل الوردية",
        titleFieldDisabled: "رقم الوردية",
        placeholdeieldDisabled: "رقم الوردية",
        titleShift: "اسم الوردية <span class='color-red'>*</span>",
        placeholdeShift: "اسم القسم",
        validationtitleShift: "اسم القسم مطلوب",
        titlePermanentType: "نوع الدوام <span class='color-red'>*</span>",
        placeholderPermanentType: " اختار نوع الدوام",
        validationtitlePermanentType: "نوع الدوام مطلوب",
        entryTime: "وقت الدخول",
        placeholderEntryTime: "وقت الدخول",
        firstRadio: "صباحي",
        secondRadio: "مسائي",
        titletimeToGoOut: "وقت الخروج",
        placeholdertimeToGoOut: "وقت الخروج",
        extraMinutes: "الدقائق المسموحة <span class='color-red'>*</span>",
        placeholdeExtraMinutes: "عدد الدقائق المسموحة",
        code: "#001093",
        titleClose: "تراجع",
        buttonSend: "حفظ الوردية"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    dialogRefAddCurrency.componentInstance.editShift = true;


    // dialogRefAddCurrency.componentInstance.list = this.categories;


    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {

      let formData = result;
      formData.checkInTime = moment(result.checkInTime).format("hh:mm:ss");
      formData.checkOutTime = moment(result.checkOutTime).format("hh:mm:ss")
      formData.timePeriod = Number(formData.timePeriod);
      formData.isActive = true;
      formData.id = data.id;

      this.shiftsService.updateShift(formData).subscribe(
        {
          next: data => {

            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الموظفين"
              },
            });
            this.getShifts(this.filteration);

            setTimeout(() => {
              succressDialog.close();

            }, 2000);

            succressDialog.componentInstance.submitted = true;
            succressDialog.componentInstance.submitClicked.subscribe(result => {


              succressDialog.close();

            })

          },
          error: err => {
            dialogRefAddCurrency.close();

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
  deleteRow(data: any) {
    const reasonOfRefuseDialog = this.dialog.open(DeleteShiftComponent, {
      width: "30vw",
      data: {
        title: "متأكد من حذف الوردية؟",
        message: "لا يمكن الرجوع في في هذا الأمر",

        titleClose: "تراجع",
        buttonSend: "حذف"
      },
    });
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      this.shiftsService.deleteShift({ ShiftWorkingTimeId: data.id }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getShifts(this.filteration);
            reasonOfRefuseDialog.close();
          },
          error: err => {
            reasonOfRefuseDialog.componentInstance.submitted = true;

          }
        }
      )
    })
  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getShifts(this.filteration)
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
