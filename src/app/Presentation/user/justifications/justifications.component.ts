import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { JustificationsService } from './services/justifications.service';
import { ToastrService } from 'ngx-toastr';
import { RequestForJustificationComponent } from 'src/app/shared/components/request-for-justification/request-for-justification.component';
import * as moment from 'moment';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';
@Component({
  selector: 'app-justifications',
  templateUrl: './justifications.component.html',
  styleUrls: ['./justifications.component.scss']
})
export class JustificationsComponent {
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
      name: "رقم الطلب",
      field: "orderNumber",
    },
    {
      name: "الرقم الوظيفي",
      field: "employeeCode",
    },
    {
      name: "اسم الموظف",
      field: "employeeName",
    },
    {
      name: "نوع التبرير",
      field: "typeOfJustification"
    },
    {
      name: "حالة الطلب للتبرير",
      field: "statusName"
    },
    {
      name: "البدايه",
      field: "dateFrom"
    },
    {
      name: "النهاية",
      field: "dateTo"
    },

    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  justifications: any = [];
  private justificationsService = inject(JustificationsService);
  defaultRowPerPage = { name: '5', code: 5 };

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
        this.justifications = this.justifications;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.justifications = this.justifications;

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
      { name: '2', code: 2 },
      { name: '5', code: 5 }

    ];

    this.getInformation();


    this.getJustifications(this.filteration)
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  exportTableToExcel() {

    let columns = [...this.columns];
    delete columns[7]
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'طلبات التبريرات',
      useBom: true,
      header: 'th { font-weight: bold; }',
      headers: columns.map((column:any) => column.name)
    };
    let formatTable = this.justifications.map(justification => {
      
      return {
        orderNumber: justification.orderNumber,
        employeeName: justification.employeeName.name,
        typeOfJustification: justification.typeOfJustification,
        dateFrom: justification.dateFrom,
        dateTo: justification.dateTo
      }
    })
    new ngxCsv(formatTable, "sheet", options);
  }
  exportTableToPDF() {
    let table: any = document.getElementById("tableJustificationHidden");
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100); 
      pdf.save('ملف_PDF.pdf');
    });
  

  }
  filter() {
    let filteration = { ...this.filteration }
    Object.entries(this.filterForm?.value).forEach(([key, value]: any) => {
      if (typeof value  === 'string') {
        if(value != "") {
          filteration[key] = value.trim();
        }
      } else {
        if(value >=0) {
          filteration[key] = value;

        }

      }
    })
    this.getJustifications(filteration);
  }
  resetFilteration() {
    this.filterForm.get("FreeText")?.setValue("");
    this.filterForm.get("code")?.setValue("");

    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getJustifications(this.filteration);
  }
  getInformation() {
    this.spinnerCards = true;

    this.justificationsService.getInformation().subscribe({
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
  editJustification(data: any) {
    const dialogRefAddCurrency = this.dialog.open(RequestForJustificationComponent, {
      width: "50vw",
      data: {
        title: "تعديل التبرير",
        setAsNecessary: "تعيين كضرورية",
        titlePermissionTypeId: "نوع التبرير <span class='color-red'>*</span>",
        placeholderPermissionTypeId: " برجاء اختيار نوع التبرير",
        PermissionTypeIdValidation: "نوع التبرير مطلوب",
        titleCalendar: "تاريخ التبرير <span class='color-red'>*</span>",
        placeholderCalendar: "تاريخ التبرير",
        titleNotes: "الملاحظات <span class='color-red'>*</span>",
        placeholdeNotes: "الملاحظات",
        NotesValidation: "الملاحظات مطلوب",
        dateTaskValidation: "تاريخ التبرير مطلوب",
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
    dialogRefAddCurrency.componentInstance.editjustification = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = new FormData();
      if (result.ForEmployee) {
        formData.append("UpdateRequestJustificationModelString", JSON.stringify({
          id: data.id,
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          EmployeeId: result.EmployeeId.key,
          JustificationTypeId: result.JustificationTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM-DD-YYYY") + " " + moment(new Date(result.time)).format("HH:mm:ss"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM-DD-YYYY") + " " + moment(new Date(result.time)).format("HH:mm:ss")
          
        }));

      } else {
        formData.append("UpdateRequestJustificationModelString", JSON.stringify({
          id: data.id,
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          JustificationTypeId: result.JustificationTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM-DD-YYYY") + " " + moment(new Date(result.time)).format("HH:mm:ss"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM-DD-YYYY") + " " + moment(new Date(result.time)).format("HH:mm:ss")

        }));
      }
      result.files.forEach((file: any) => {
        if (file.detailsImage === false) {
          formData.append("Attachments", file.fileUpload, file.fileUpload.name);
        } else {
          formData.append("ProfileImageName", file.fileUpload.name);
        }
      });
      dialogRefAddCurrency.componentInstance.submitted = false;
      dialogRefAddCurrency.componentInstance.loading = true;

      this.justificationsService.updateJustification(formData).subscribe(
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
                buttonSend: "طلبات التبريرات"

              },
            });
            this.getJustifications(this.filteration);

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
  getJustifications(filteration: any) {
    this.justifications = [];
    this.isLoading = true;
    this.justificationsService.listJustifications(filteration).subscribe(data => {

      data.data.forEach((employee: any) => {
        this.justifications.push({
          id: employee.id,
          orderNumber: employee.code,
          employeeName: {
            name: employee.employee.name,
            alt: employee.employee.name,
            img: employee.employee.profileImagePath ? employee.employee.profileImagePath : "../../../../assets/img/5034901-200.png"
          },
          statusName:employee.statusName,
          employeeCode:employee.employee.code,
          typeOfJustification: employee.justificationTypeName,
          status:employee.status,
          dateFrom: moment(new Date(employee.dateFrom)).format("MM/DD/YYYY"),
          dateTo: moment(new Date(employee.dateTo)).format("MM/DD/YYYY"),
        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;
    })
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 24, actionCode: data.actionCode })
  }
  numberOfRowsPerPage(data: any) {


    this.filteration = { ...this.filteration, PageSize: data.value.code };

    this.getJustifications(this.filteration)
  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getJustifications(this.filteration)
  }

  requestJustification() {
    const dialogRefAddCurrency = this.dialog.open(RequestForJustificationComponent, {
      width: "50vw",
      data: {
        title: "طلب التبرير",
        setAsNecessary: "تعيين كضرورية",
        titlePermissionTypeId: "نوع التبرير <span class='color-red'>*</span>",
        placeholderPermissionTypeId: " برجاء اختيار نوع التبرير",
        PermissionTypeIdValidation: "نوع التبرير مطلوب",
        titleCalendar: "تاريخ التبرير <span class='color-red'>*</span>",
        placeholderCalendar: "تاريخ التبرير",
        titleNotes: "الملاحظات <span class='color-red'>*</span>",
        placeholdeNotes: "الملاحظات",
        NotesValidation: "الملاحظات مطلوب",

        dateTaskValidation: "تاريخ التبرير مطلوب",
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

    dialogRefAddCurrency.componentInstance.editjustification = false;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = new FormData();
      
      if (result.ForEmployee) {
        formData.append("CreateRequestJustificationModelString", JSON.stringify({
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          EmployeeId: result.EmployeeId.key,
          JustificationTypeId: result.JustificationTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM-DD-YYYY") + " " + moment(new Date(result.time)).format("HH:mm:ss"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM-DD-YYYY") + " " + moment(new Date(result.time)).format("HH:mm:ss")
        }));

      } else {
        formData.append("CreateRequestJustificationModelString", JSON.stringify({
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          JustificationTypeId: result.JustificationTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM-DD-YYYY") + " " + moment(new Date(result.time)).format("HH:mm:ss"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM-DD-YYYY") + " " + moment(new Date(result.time)).format("HH:mm:ss")

        }));
      }
      result.files.forEach((file: any) => {
        if (file.detailsImage === false) {
          formData.append("Attachments", file.fileUpload, file.fileUpload.name);
        } else {
          formData.append("ProfileImageName", file.fileUpload.name);
        }
      });
      dialogRefAddCurrency.componentInstance.submitted = false;
      dialogRefAddCurrency.componentInstance.loading = true;

      this.justificationsService.createJustification(formData).subscribe(
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
                buttonSend: "طلبات التبريرات"

              },
            });
            this.getJustifications(this.filteration);

            setTimeout(() => {
              succressDialog.close();

            }, 2000);
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

      this.justificationsService.rejectJustification({ refuseReason: result.notes, id: data.id }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getJustifications(this.filteration);
            reasonOfRefuseDialog.close();
          },
          error: err => {
            reasonOfRefuseDialog.componentInstance.submitted = true;

          }
        }
      )


    })
  }
  sendRequest(data: any) {
    this.justificationsService.accept({ requestId: data.id }).subscribe(
      {
        next: res => {
          this.getJustifications(this.filteration);
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
