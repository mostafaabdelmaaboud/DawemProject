import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { AssignmentRequestComponent } from 'src/app/shared/components/assignment-request/assignment-request.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { DialogAssignementFileComponent } from 'src/app/shared/components/dialog-assignement-file/dialog-assignement-file.component';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

import { RequestsService } from './services/requests.service';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  router = inject(Router);

  list: any[] = [
    { name: "نسيان تسجيل حضور", key: "1" },
    { name: "نسيان تسجيل انصراف", key: "2" },
    { name: "تسجيل حضور خاطئ", key: "3" },
    { name: "تسجيل انصراف خاطئ", key: "4" }

  ];
  columns: any[] = [
    {
      name: "رقم الطلب",
      field: "employeeCode",
    },
    {
      name: "رقم الموظف",
      field: "orderNumber",
    },
    {
      name: "اسم الموظف",
      field: "employeeName",
    },
    {
      name: "نوع الطلب",
      field: "requestTypeName"
    },

    {
      name: "التاريخ",
      field: "date"
    },

    {
      name: "حاله الطلب",
      field: "statusName"
    },

    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  requests: any = [];
  requestIsExport: any = [];

  isLoading = true;
  defaultRowPerPage = { name: '5', code: 5 };
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
  private requestsService = inject(RequestsService)
  totalItems: number = 0;
  first: number = 0;
  rows: number = 10;
  RowsPerPage!: any[];
  mobileQuery: MediaQueryList;
  opened = false;
  cards!: any;
  spinnerCards = false;
  private _mobileQueryListener: () => void;
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentLang = localStorage.getItem("lang");
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher, public translate: TranslateService,
     private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');
    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.requests = this.requests;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.requests = this.requests;
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
      this.date = new Date();

    });
  }
  id:any;
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    if (this.mobileQuery.matches) {
      this.opened = true;
    } else {
      this.opened = false;

    }
    this.translate.get("requests").subscribe(data => {
      this.columns= [
        {
          name: data.orderNumber,
          field: "employeeCode",
        },
        {
          name: data.employeeNumber,
          field: "orderNumber",
        },
        {
          name: data.employeeName,
          field: "employeeName",
        },
        {
          name: data.typeOfRequest,
          field: "requestTypeName"
        },
        {
          name: data.theDate,
          field: "date"
        },
        {
          name: data.requestStatus,
          field: "statusName"
        },
        {
          name: data.action,
          field: "actions"
        }
    
      ];
    })
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(dataParent => {
      this.translate.get("requests").subscribe(data => {
        this.columns= [
          {
            name: data.orderNumber,
            field: "employeeCode",
          },
          {
            name: data.employeeNumber,
            field: "orderNumber",
          },
          {
            name: data.employeeName,
            field: "employeeName",
          },
          {
            name: data.typeOfRequest,
            field: "requestTypeName"
          },
      
          {
            name: data.theDate,
            field: "date"
          },
      
          {
            name: data.requestStatus,
            field: "statusName"
          },
      
          {
            name: data.action,
            field: "actions"
          }
      
        ];
      })
      // this.subscription = this.translate.stream('primeng').subscribe(data => {
      //   this.config.setTranslation(data);
      // });  
    })
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

    this.getRequests(this.filteration);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  navigateComponent(componentName) {
    let permissions = JSON.parse(localStorage.getItem("permissions") as string);
    let regex = new RegExp(componentName + '$');
    let findIndexRoute = permissions?.availablePermissions?.findIndex((permission:any) => regex.test(permission?.url));
    if(findIndexRoute >= 0) {
        this.router.navigate([`${permissions?.availablePermissions[findIndexRoute]?.url}/${permissions?.availablePermissions[findIndexRoute]?.screenCode}`])
  
    }

  }
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: Number(this.id), actionCode: data.actionCode })
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
    this.getRequests(this.filteration);
  }
  exportTableToExcel() {
    let columns = [...this.columns];
    delete columns[6]
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'الطلبات',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };
 

    if(!this.isLoading) {
      this.isLoading = true;
      this.requestIsExport = [];
      let filteration = {...this.filteration, isExport:true};
      this.requestsService.listRequests(filteration).subscribe(data => {
        data?.data?.forEach((request: any) => {
          this.requestIsExport.push({
            id: request.id,
            status: request.status,
            employeeCode: request.code,
            orderNumber: request.employee.employeeNumber,
            employeeName: {
              name: request.employee.name,
              alt: request.employee.name,
              img: request.employee.profileImagePath ? request.employee.profileImagePath : "../../../../assets/img/5034901-200.png"
            },
            requestTypeName: request.requestTypeName,
            statusName: request.statusName,
            date: moment(new Date(request.date)).format("MM/DD/YYYY")
          })
        });


        let formatTable = this.requestIsExport.map(request => {
          return {
            employeeCode: request.employeeCode,
            orderNumber: request.orderNumber,
            employeeName: request.employeeName.name,
            requestTypeName: request.requestTypeName,
            date: request.date,
    
            statusName: request.statusName
    
          }
        })
        this.isLoading = false;
        new ngxCsv(formatTable, "sheet", options);


      })
    }

    // new ngxCsv(formatTable, "sheet", options);
  }
  exportTableToPDF() {

    if(!this.isLoading) {
      this.isLoading = true;
      let table: any = document.getElementById("tableRequetstsHidden");
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
    this.getRequests(this.filteration);
  }
  getInformation() {
    this.spinnerCards = true;
    this.requestsService.getInformation().subscribe({
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
  getRequests(filteration: any) {
    this.requests = [];
    this.isLoading = true;
    this.requestsService.listRequests(filteration).subscribe(data => {
      data?.data?.forEach((request: any) => {
        this.requests.push({
          id: request.id,
          status: request.status,
          employeeCode: request.code,

          orderNumber: request.employee.employeeNumber,
          employeeName: {
            name: request.employee.name,
            alt: request.employee.name,
            img: request.employee.profileImagePath ? request.employee.profileImagePath : "../../../../assets/img/5034901-200.png"
          },
          requestTypeName: request.requestTypeName,
          statusName: request.statusName,
          date: moment(new Date(request.date)).format("MM/DD/YYYY")
        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;
    });
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {

    this.filteration = { ...this.filteration, PageSize: data.value.code };

    this.getRequests(this.filteration)
  }
  sendRequest(data: any) {

    this.requestsService.accept({ requestId: data.id }).subscribe(
      {
        next: res => {
          this.getRequests(this.filteration);
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
      reasonOfRefuseDialog.componentInstance.submitted = false;


      this.requestsService.rejectRequest({ id: data.id, refuseReason: result.notes }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getRequests(this.filteration);
            reasonOfRefuseDialog.close();
          },
          error: err => {
            reasonOfRefuseDialog.componentInstance.submitted = true;

          }
        }
      )
    })
  }



  dialogAssignmentFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogAssignementFileComponent, {
      width: "60vw",
      data: {
        title: "ملف التكليف"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id

  }


  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getRequests(this.filteration)
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
  ngOnDestroy() {
    this.destroy$.next(true);
    this.subscription.unsubscribe();
  }

}
