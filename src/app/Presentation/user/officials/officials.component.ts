import { ChangeDetectorRef, Component, Inject, LOCALE_ID, inject } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { DialogAddAOfficialComponent } from 'src/app/shared/components/dialog-add-a-official/dialog-add-a-official.component';
import { DeleteShiftComponent } from 'src/app/shared/components/delete-shift/delete-shift.component';
import { DialogEditAOfficialComponent } from 'src/app/shared/components/dialog-edit-a-official/dialog-edit-a-official.component';

@Component({
  selector: 'app-officials',
  templateUrl: './officials.component.html',
  styleUrls: ['./officials.component.scss']
})
export class OfficialsComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;

  columns: any[] = [
    {
      name: "رقم الموظف",
      field: "orderNumber",
    },
    {
      name: "اسم المسؤول",
      field: "nameOfTheManager",
    },
    {
      name: "الوظيفة",
      field: "function"
    },
    {
      name: "تاريخ الاضافة",
      field: "dateAdded"
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
  private dialog = inject(MatDialog);

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
        nameOfTheManager: {
          name: "محمد صالح",
          alt: "img1",
          img: "../../../../assets/img/image2.png"
        },
        function: "المدير العام للمستشفي",
        dateAdded: "12/10/2023",
        notes: "ملاحظات التكليف"

      },
      {
        orderNumber: "02",
        nameOfTheManager: {
          name: "محمد صالح",
          alt: "img1",
          img: "../../../../assets/img/image2.png"
        },
        function: "مدير الموارد البشرية",
        dateAdded: "12/10/2023",
        notes: "ملاحظات التكليف"
      },
      {
        orderNumber: "03",
        nameOfTheManager: {
          name: "سارة عدنان",
          alt: "img3",
          img: "../../../../assets/img/image.png"
        },
        function: "مسؤول الموارد البشرية",
        dateAdded: "12/10/2023",
        notes: "ملاحظات التكليف"
      },
      {
        orderNumber: "04",
        nameOfTheManager: {
          name: "ريان سعد",
          alt: "img4",
          img: "../../../../assets/img/image.png"
        },
        function: "مسؤول الموارد البشرية",
        dateAdded: "12/10/2023",
        notes: "ملاحظات على التكليف"
      },
      {
        orderNumber: "05",
        nameOfTheManager: {
          name: "ريان سعد",
          alt: "img5",
          img: "../../../../assets/img/image.png"
        },
        function: "نائب مدير المستشفي",
        dateAdded: "12/10/2023",
        notes: "--"
      },
      {
        orderNumber: "06",
        nameOfTheManager: {
          name: "خالد حمد",
          alt: "img6",
          img: "../../../../assets/img/image.png"
        },
        function: "مسؤول الموارد البشرية",
        dateAdded: "12/10/2023",
        notes: "على التكليف"
      },
      {
        orderNumber: "07",
        nameOfTheManager: {
          name: "ريان سعد",
          alt: "img4",
          img: "../../../../assets/img/image.png"
        },
        function: "مسؤول الموارد البشرية",
        dateAdded: "12/10/2023",
        notes: "على التكليف"
      },
      {
        orderNumber: "08",
        nameOfTheManager: {
          name: "ريان سعد",
          alt: "img5",
          img: "../../../../assets/img/image.png"
        },
        function: "مسؤول الموارد البشرية",
        dateAdded: "12/10/2023",
        notes: "على التكليف"
      },
      {
        orderNumber: "09",
        nameOfTheManager: {
          name: "خالد حمد",
          alt: "img6",
          img: "../../../../assets/img/image.png"
        },
        function: "مسؤول الموارد البشرية",
        dateAdded: "12/10/2023",
        notes: "على التكليف"
      },
      {
        orderNumber: "01#",
        nameOfTheManager: {
          name: "خالد حمد",
          alt: "img6",
          img: "../../../../assets/img/image.png"
        },
        function: "مسؤول الموارد البشرية",
        dateAdded: "12/10/2023",
        notes: "على التكليف"
      },
    ];
    this.isLoading = false;
    this.totalItems = 3;
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  addOfficial() {

    const dialogRefAddCurrency = this.dialog.open(DialogAddAOfficialComponent, {
      width: "50vw",
      data: {
        title: "إضافة مسئول",

        titleShift: "الموظف المسئول <span class='color-red'>*</span>",
        placeholdeShift: "الموظف المسئول",
        validationtitleShift: "الموظف المسئول مطلوب",
        titlePermanentType: "الصلاحية <span class='color-red'>*</span>",
        placeholderPermanentType: " اختار الصلاحية",
        validationtitlePermanentType: "الصلاحية مطلوب",
        titleNotes: "الملاحظات <span class='color-red'>*</span>",
        placeholdeNotes: "برجاء كتابة الملاحظات",
        validationtitleNotes: "الملحظات مطلوبه",
        titleClose: "تراجع",
        buttonSend: "إضافة الموظف"
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
  editOfficials() {
    const dialogRefAddCurrency = this.dialog.open(DialogEditAOfficialComponent, {
      width: "50vw",
      data: {
        title: "إضافة مسئول",

        titleShift: "الموظف المسئول <span class='color-red'>*</span>",
        placeholdeShift: "الموظف المسئول",
        validationtitleShift: "الموظف المسئول مطلوب",
        titlePermanentType: "الصلاحية <span class='color-red'>*</span>",
        placeholderPermanentType: " اختار الصلاحية",
        validationtitlePermanentType: "الصلاحية مطلوب",
        titleNotes: "الملاحظات <span class='color-red'>*</span>",
        placeholdeNotes: "برجاء كتابة الملاحظات",
        validationtitleNotes: "الملحظات مطلوبه",
        titleFieldDisabled: "كود المسئول",
        code: "#001093",
        titleClose: "تراجع",
        buttonSend: "إضافة الموظف"
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
        title: "متأكد من حذف المسئول؟",
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
