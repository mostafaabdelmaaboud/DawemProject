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
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { DialogAssignementFileComponent } from 'src/app/shared/components/dialog-assignement-file/dialog-assignement-file.component';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss']
})
export class AssignmentsComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
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
      field: "employeeName",
    },
    {
      name: "التكليف",
      field: "assignment"
    },
    {
      name: "التاريخ",
      field: "date"
    },
    {
      name: "الوقت",
      field: "time"
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
        orderNumber: "00001#",
        employeeName: {
          name: "محمد صالح",
          alt: "img1",
          img: "../../../../assets/img/image.png"
        },
        assignment: "مراجعة الجودة",
        date: "12/10/2023",
        time: "11:00 ص",
        notes: "ملاحظات التكليف"

      },
      {
        orderNumber: "00002#",
        employeeName: {
          name: "خالد حمد",
          alt: "img2",
          img: "../../../../assets/img/image.png"
        },
        assignment: "اجتماع الادارة",
        date: "12/10/2023",
        time: "11:00 ص",
        notes: "على الطلب"
      },
      {
        orderNumber: "00003#",
        employeeName: {
          name: "سارة عدنان",
          alt: "img3",
          img: "../../../../assets/img/image2.png"
        },
        assignment: "مأمورية الضرايب",
        date: "12/10/2023",
        time: "11:00 ص",
        notes: "طلب التكليف"
      },
      {
        orderNumber: "00004#",
        employeeName: {
          name: "ريان سعد",
          alt: "img4",
          img: "../../../../assets/img/image2.png"
        },
        assignment: "وزارة العدل",
        date: "12/10/2023",
        time: "11:00 ص",
        notes: "ملاحظات على التكليف"
      },
      {
        orderNumber: "00005#",
        employeeName: {
          name: "ريان سعد",
          alt: "img5",
          img: "../../../../assets/img/image2.png"
        },
        assignment: "فريق الجودة",
        date: "12/10/2023",
        time: "11:00 ص",
        notes: "--"
      },
      {
        orderNumber: "00006#",
        employeeName: {
          name: "خالد حمد",
          alt: "img6",
          img: "../../../../assets/img/image2.png"
        },
        assignment: "تدريب متقدم",
        date: "12/10/2023",
        time: "11:00 ص",
        notes: "على التكليف"
      },
      {
        orderNumber: "00007#",
        employeeName: {
          name: "ريان سعد",
          alt: "img4",
          img: "../../../../assets/img/image2.png"
        },
        assignment: "وزارة العدل",
        date: "12/10/2023",
        time: "11:00 ص",
        notes: "ملاحظات على التكليف"
      },
      {
        orderNumber: "00008#",
        employeeName: {
          name: "ريان سعد",
          alt: "img5",
          img: "../../../../assets/img/image2.png"
        },
        assignment: "وزارة العدل",
        date: "12/10/2023",
        time: "11:00 ص",
        notes: "ملاحظات على التكليف"
      },
      {
        orderNumber: "00009#",
        employeeName: {
          name: "خالد حمد",
          alt: "img6",
          img: "../../../../assets/img/image2.png"
        },
        assignment: "وزارة العدل",
        date: "12/10/2023",
        time: "11:00 ص",
        notes: "ملاحظات على التكليف"
      },
      {
        orderNumber: "000010#",
        employeeName: {
          name: "خالد حمد",
          alt: "img6",
          img: "../../../../assets/img/image2.png"
        },
        assignment: "وزارة العدل",
        date: "12/10/2023",
        time: "11:00 ص",
        notes: "ملاحظات على التكليف"
      },
    ];
    this.isLoading = false;
    this.totalItems = 3;
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  sendRequest() {
    const succressDialog = this.dialog.open(ToastSuccessComponent, {
      width: "30vw",
      data: {
        title: "تم قبول الطلب",
        message: "تم ارسال الموافقة على الطلب للموظف",
        buttonSend: "اعلاق"
      },
    });
    setTimeout(() => {
      succressDialog.close();

    }, 2000);
    succressDialog.componentInstance.submitted = true;
    succressDialog.componentInstance.submitClicked.subscribe(result => {
      succressDialog.close();

    })
  }
  dialogAssignmentFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogAssignementFileComponent, {
      width: "40vw",
      data: {
        title: "ملف التكليف"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id

  }
  reasonOfRefuse() {
    const reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
      width: "30vw",
      data: {
        title: "هل متأكد من رفض الطلب؟",
        message: "برجاء توضيح السبب إن أمكن",
        titleReasonOfRefuse: "سبب الرفض",
        placeholdeReasonOfRefuse: "برجاء كتابة سبب الرفض",
        titleClose: "تراجع",
        buttonSend: "رفض الطلب"
      },
    });

    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.close();

    })
  }
  requestAssignment() {
    const dialogRefAddCurrency = this.dialog.open(AssignmentRequestComponent, {
      width: "50vw",
      data: {
        title: "طلب تكليف",
        setAsNecessary: "تعيين كضرورية",
        titleDropdownOne: "نوع التكليف <span class='color-red'>*</span>",
        placeholderDropdown: " برجاء اختيار نوع مهمة",
        titleCalendar: "تاريخ مهمة عمل <span class='color-red'>*</span>",
        placeholderCalendar: "تاريخ مهمة عمل",
        timeAttendance: "وقت مهمة العمل",
        placeholdertimeAttendance: "وقت مهمة العمل",
        titleWorkTeam: "فريق العمل",
        placeholderWorkTeam: "فريق العمل",
        uploadFile: "ارفاق ملف",
        chooseLabel: "اختار الملف ليتم رفعه",
        titleNotes: "ملاحظات",
        placeholdeNotes: "برجاء كتابة الملاحظات هنا",
        buttonSend: "إرسال الطلب"
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
          message: "طلبك في انتظار الموافقة، ويمكنك متابعة حالة الطلب من صفحة التكليفات",
          buttonSend: "طلبات التكليفات"
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
