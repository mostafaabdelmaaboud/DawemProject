import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { RequestVacationComponent } from 'src/app/shared/components/request-vacation/request-vacation.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { DialogVacationFileComponent } from 'src/app/shared/components/dialog-vacation-file/dialog-vacation-file.component';
import { VacationsService } from './services/vacations.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-vacations',
  templateUrl: './vacations.component.html',
  styleUrls: ['./vacations.component.scss']
})
export class VacationsComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);

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
      name: "نوع الاجازة",
      field: "kindOfHoliday"
    },
    {
      name: "البداية",
      field: "beginning"
    },
    {
      name: "النهاية",
      field: "final"
    },
    {
      name: "حاله الطلب",
      field: "reason"
    },
    {
      name: "رصيد الاجازات",
      field: "vacationsBalance"
    },
    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  vacations: any = [];

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
  spinnerCards = false;
  cards!: any;
  private _mobileQueryListener: () => void;
  private vacationsService = inject(VacationsService);
  list: any[] = [
    { name: "نسيان تسجيل حضور", key: "1" },
    { name: "نسيان تسجيل انصراف", key: "2" },
    { name: "تسجيل حضور خاطئ", key: "3" },
    { name: "تسجيل انصراف خاطئ", key: "4" }

  ];
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService, private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.vacations = this.vacations;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.vacations = this.vacations;

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
    // this.filterForm = this.fb.group({
    //   date: [],
    //   type: this.fb.group({

    //   }),
    //   currencyCode: this.fb.group({
    //   }),
    //   minimum: [null, this.minimumValidator("maxmimum")
    //   ],
    //   maxmimum: [null, this.maximumValidator("minimum")]
    // });
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
    this.getVacations(this.filteration);

  }
  getInformation() {
    this.spinnerCards = true;

    this.vacationsService.getInformation().subscribe({
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
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 27, actionCode: data.actionCode })
  }
  getVacations(filteration: any) {
    this.vacations = [];
    this.isLoading = true;
    this.vacationsService.listVacations(filteration).subscribe(
      {
        next: data => {
          data.data.forEach((vacation: any) => {
            this.vacations.push({
              id: vacation.id,
              orderNumber: vacation.employee?.code ? vacation.employee?.code : "لا يوجد",
              status: vacation.status,
              employeeName: {
                name: vacation.employee?.name ? vacation.employee?.name : "لا يوجد",
                alt: vacation.employee?.name ? vacation.employee?.name : "لا يوجد",
                img: vacation.employee?.profileImagePath ? vacation.employee?.profileImagePath : "../../../../assets/img/5034901-200.png"
              },
              kindOfHoliday: vacation.vacationTypeName,
              beginning: moment(new Date(vacation.dateFrom)).format("MM/DD/YYYY"),
              final: moment(new Date(vacation.dateTo)).format("MM/DD/YYYY"),
              vacationsBalance: 9,
              reason: vacation.statusName

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
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getVacations(this.filteration)
  }
 
  data = {
    اسم: 'أحمد',
    العمر: 25,
    العنوان: 'العنوان هنا'
  };
  exportTableToExcel() {
    let data = document.getElementById("tableVacationHidden");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ExcelSheet.xlsx');
  }
  exportTableToPDF() {
    let table: any = document.getElementById("tableVacationHidden");
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100); 
      pdf.save('ملف_PDF.pdf');
    });
  

  }
  createDataTable() {
    const tableData = [
      [{ text: 'العنوان', bold: true }, { text: 'القيمة', bold: true }],
      ['اسم', this.data.اسم],
      ['العمر', this.data.العمر],
      ['العنوان', this.data.العنوان]
    ];

    return {
      table: {
        widths: ['*', '*'],
        body: tableData
      },
      layout: 'lightHorizontalLines'
    };
  }
  reasonOfRefuse(data: any) {
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
      reasonOfRefuseDialog.componentInstance.submitted = false;


      this.vacationsService.rejectVacation({ id: data.id, rejectReason: result.notes }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getVacations(this.filteration);
            reasonOfRefuseDialog.close();
          },
          error: err => {
            reasonOfRefuseDialog.componentInstance.submitted = true;

          }
        }
      )


    })
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
    this.getVacations(filteration);
  }
  resetFilteration() {
    this.filterForm.get("FreeText")?.setValue("");
    this.filterForm.get("code")?.setValue("");

    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getVacations(this.filteration);
  }
  requestVacation() {
    const dialogRefAddCurrency = this.dialog.open(RequestVacationComponent, {
      width: "50vw",
      data: {
        title: "طلب اجازة",
        setAsNecessary: "تعيين كضرورية",
        titleVacationTypeId: "نوع الاجازة <span class='color-red'>*</span>",
        placeholderVacationTypeId: " برجاء اختيار نوع الاجازة",
        VacationTypeIdValidation: "نوع الاجازه مطلوب",
        titleCalendar: "تاريخ الاجازة <span class='color-red'>*</span>",
        placeholderCalendar: "تاريخ الاجازة",
        dateTaskValidation: "تاريخ الاجازة مطلوب",
        labelRadioButton: "صاحب الطلب",
        firstRadio: "لنفسي",
        secondRadio: "لموظف",
        titleEmployeeId: "الموظف <span class='color-red'>*</span>",
        placeholderEmployeeId: "الموظف",
        EmployeeIdValidation: "الموظف مطلوب",
        uploadFile: "ارفاق ملف",
        chooseLabel: "اختار الملف ليتم رفعه",
        buttonSend: "إرسال الطلب"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editVacation = false;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {

      let formData = new FormData();
      if (result.ForEmployee) {
        formData.append("CreateRequestVacationModelString", JSON.stringify({
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          EmployeeId: result.EmployeeId.key,
          VacationTypeId: result.VacationTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM/DD/YYYY"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM/DD/YYYY")
        }));

      } else {
        formData.append("CreateRequestVacationModelString", JSON.stringify({
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          VacationTypeId: result.VacationTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM/DD/YYYY"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM/DD/YYYY")
        }));
      }
      result.files.forEach((file: any) => {
        if (file.detailsImage === false) {
          formData.append("Attachments", file.fileUpload, file.fileUpload.name);
        }
      });
      dialogRefAddCurrency.componentInstance.submitted = false;

      this.vacationsService.createVacation(formData).subscribe(
        {
          next: (data: any) => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الاجازات"

              },
            });
            this.getVacations(this.filteration);

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
  editVacation(data: any) {
    const dialogRefAddCurrency = this.dialog.open(RequestVacationComponent, {
      width: "50vw",
      data: {
        title: "طلب اجازة",
        setAsNecessary: "تعيين كضرورية",
        titleVacationTypeId: "نوع الاجازة <span class='color-red'>*</span>",
        placeholderVacationTypeId: " برجاء اختيار نوع الاجازة",
        VacationTypeIdValidation: "نوع الاجازه مطلوب",
        titleCalendar: "تاريخ الاجازة <span class='color-red'>*</span>",
        placeholderCalendar: "تاريخ الاجازة",
        dateTaskValidation: "تاريخ الاجازة مطلوب",
        labelRadioButton: "صاحب الطلب",
        firstRadio: "لنفسي",
        secondRadio: "لموظف",
        titleEmployeeId: "الموظف <span class='color-red'>*</span>",
        placeholderEmployeeId: "الموظف",
        EmployeeIdValidation: "الموظف مطلوب",
        uploadFile: "ارفاق ملف",
        chooseLabel: "اختار الملف ليتم رفعه",
        buttonSend: "إرسال الطلب"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editVacation = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = new FormData();
      if (result.ForEmployee) {
        formData.append("UpdateRequestTaskModelString", JSON.stringify({
          id: data.id,
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          EmployeeId: result.EmployeeId.key,
          VacationTypeId: result.VacationTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM/DD/YYYY"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM/DD/YYYY")
        }));

      } else {
        formData.append("UpdateRequestTaskModelString", JSON.stringify({
          id: data.id,

          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          TaskTypeId: result.TaskTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM/DD/YYYY"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM/DD/YYYY")
        }));
      }
      result.files.forEach((file: any) => {
        if (file.detailsImage === false) {
          formData.append("Attachments", file.fileUpload, file.fileUpload.name);
        }
      });
      dialogRefAddCurrency.componentInstance.submitted = false;

      this.vacationsService.updateVacation(formData).subscribe(
        {
          next: (data: any) => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الاجازات"

              },
            });
            this.getVacations(this.filteration);

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

  sendRequest(data: any) {

    this.vacationsService.accept({ requestId: data.id }).subscribe(
      {
        next: res => {
          this.getVacations(this.filteration);
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
  dialogVacationFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogVacationFileComponent, {
      width: "40vw",
      data: {
        title: "ملف الاجازة"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id

  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getVacations(this.filteration)
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
    this.getVacations(filteration)

  }
  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
