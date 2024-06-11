import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { SubscriptionsService } from './service/subscriptions.service';
import moment from 'moment';
import { AddSubscriptionComponent } from './dialogs/add-subscription/add-subscription.component';
import { SubscriptionInfoComponent } from './dialogs/subscription-info/subscription-info.component';
import { DialogDeleteComponent } from 'src/app/shared/components/dialog-delete/dialog-delete.component';
import { DialogApproveWithDateComponent } from 'src/app/shared/components/dialog-approve-with-date/dialog-approve-with-date.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);

  columns: any[] = [
    {
      name: "كود الاشتراك",
      field: "code",
    },
    {
      name: "اسم الخطة",
      field: "planeName",
    },
    {
      name: "اسم الشركة",
      field: "companyName"
    },
    {
      name: "حالة الاشتراك",
      field: "statusName"
    },
    {
      name: "في انتظار التاكيد ",
      field: "isWaitingForApproval"
    },
    {
      name: "الاجراءات",
      field: "actions"
    }
  ];
  subscriptions: any = [];
  subscriptionsIsExport: any = [];
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
  private subscriptionsService = inject(SubscriptionsService);
  list: any[] = [
    { name: "نسيان تسجيل حضور", key: "1" },
    { name: "نسيان تسجيل انصراف", key: "2" },
    { name: "تسجيل حضور خاطئ", key: "3" },
    { name: "تسجيل انصراف خاطئ", key: "4" }
  ];
  defaultRowPerPage = { name: '5', code: 5 };

  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');
    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.subscriptions = this.subscriptions;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.subscriptions = this.subscriptions;
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
  id:any;
  private route = inject(ActivatedRoute);
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;

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
      { name: '2', code: 2 },
      { name: '5', code: 5 }

    ];
    this.getInformation();

    this.getSubscriptions(this.filteration);
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
    this.getSubscriptions(this.filteration);
  }
  exportTableToExcel() {
    let columns = [...this.columns];
    delete columns[3]
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'الاشتراكات',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };

    if(!this.isLoading) {
      this.isLoading = true;
      this.subscriptionsIsExport = [];
      let filteration = {...this.filteration, isExport:true};
   
      this.subscriptionsService.getSubscriptions(filteration).subscribe(
        {
          next: data => {
     
            data.data.forEach((subscription: any) => {
              this.subscriptionsIsExport.push({
                id: subscription.id,
                code: subscription.code,
                planeName: subscription.planName ? subscription.planName : "لا يوجد",
                companyName: subscription.companyName ? subscription.companyName : "لا يوجد",
                statusName: subscription.statusName ? subscription.statusName : "لا يوجد",
                isWaitingForApproval: subscription.isWaitingForApproval ? "نعم" : "لا",
                isActive: subscription.isActive ? "نشط":"غير نشط"
  
              })
            });
            let formatTable = this.subscriptionsIsExport.map(subscription => {
      
              return {
                code: subscription.code,
                planeName: subscription.planeName,
                companyName: subscription.companyName,
                statusName: subscription.statusName,
                isWaitingForApproval: subscription.isWaitingForApproval,
                isActive: subscription.isActive
              }
            })
            this.isLoading = false;
            new ngxCsv(formatTable, "sheet", options);
          },
          error: err => {
            this.isLoading = false;
  
          }
        }
      )
    }
  }
  exportTableToPDF() {
    if(!this.isLoading) {
      this.isLoading = true;
      let table: any = document.getElementById("SubscriptionsHidden");
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
    this.getSubscriptions(this.filteration);
  }
  getInformation() {
    this.spinnerCards = true;
    this.subscriptionsService.getInformation().subscribe({
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
  getSubscriptions(filteration: any) {
    this.subscriptions = [];
    this.isLoading = true;
    this.subscriptionsService.getSubscriptions(filteration).subscribe(
      {
        next: data => {
          data.data.forEach((subscription: any) => {
            this.subscriptions.push({
              id: subscription.id,
              code: subscription.code,
              planeName: subscription.planName ? subscription.planName : "لا يوجد",
              companyName: subscription.companyName ? subscription.companyName : "لا يوجد",
              statusName: subscription.statusName ? subscription.statusName : "لا يوجد",
              isWaitingForApproval: subscription.isWaitingForApproval ? "نعم" : "لا",
              isActive: subscription.isActive
            });
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
  showActions(data: any) {
    if(localStorage.getItem('adminPermissions')) {
      return this.permissionsUserService.checkPermissionAdmin({ type: "actions", screenCode: Number(this.id), actionCode: data.actionCode });

    } else {
      return ""
    }
  }
  
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getSubscriptions(this.filteration)
  }
  accept(data:any) {
    let reasonOfRefuseDialog = this.dialog.open(DialogApproveWithDateComponent, {
      width: "30vw",
      data: {
        title: "هل متأكد من قبول الاشتراك",
        message: "برجاء توضيح السبب إن أمكن",
        titleClose: "تراجع",
        buttonSend: "قبول"
      },
    });

    reasonOfRefuseDialog.componentInstance.companyName = data.companyName;
    reasonOfRefuseDialog.componentInstance.planName = data.planeName;

  reasonOfRefuseDialog.componentInstance.submitted = true;
  reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
    reasonOfRefuseDialog.componentInstance.submitted = false;
    

    let date = moment(result.activationStart).format("YYYY-MM-DD") ;
    
    this.subscriptionsService.accept({ subscriptionId: data.id, activationStartDate:date}).subscribe({
      next: res => {
        this.toast.success(res.message);
        reasonOfRefuseDialog.componentInstance.submitted = true;
        reasonOfRefuseDialog.close();
        this.getSubscriptions(this.filteration);
      },
      error: err => {
        reasonOfRefuseDialog.componentInstance.submitted = true;

      }
    })



  })
  }
  sendRequest(data: any) {

    this.subscriptionsService.enable({ subscriptionId: data.id }).subscribe(
      {
        next: res => {
          this.getSubscriptions(this.filteration);
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

    let reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
      width: "30vw",
      data: {
        title: "هل متأكد من رفض الإشتراك؟",
        message: "برجاء توضيح السبب إن أمكن",
        titleReasonOfRefuse:"سبب الرفض",
        placeholdeReasonOfRefuse: "برجاء كتابة سبب الرفض",
        titleClose:"تراجع",
        buttonSend: "رفض الإشتراك"
      },
    });

    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      reasonOfRefuseDialog.componentInstance.submitted = false;


      this.subscriptionsService.disableSubscription({ id: data.id, disableReason: result.notes }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getSubscriptions(this.filteration);
            reasonOfRefuseDialog.close();
          },
          error: err => {
            reasonOfRefuseDialog.componentInstance.submitted = true;

          }
        }
      )
    })
  }

  requestSubscriptions() {
    let dialogRefAddCurrency = this.dialog.open(AddSubscriptionComponent, {
      width: "50vw",
      data: {
        title: "اضافة إشتراك",
        setAsActive: "تعيين كنشط",
        titleNotes: "الملاحظات <span class='color-red'>*</span>",
        placeholdeNotes: "الملاحظات",
        ValidationNotes: "الملاحظات مطلوبة",
        titleClose: "تراجع",
        buttonSend: "اضافة إشتراك"
      },
    });
  
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editSubscription = false;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      formData.IsActive = result.IsActive;
      formData.Status = Number(result.Status);
      formData.PlanId = result.PlanId ? result.PlanId.key : null;
      formData.CompanyId = result.CompanyId ? result.CompanyId.key : null;
      formData.DurationInDays = result.DurationInDays;
      formData.StartDate = moment(new Date(result.StartDate)).format("YYYY-MM-DD");
      formData.EndDate = moment(new Date(result.EndDate)).format("YYYY-MM-DD");
      formData.RenewalCount = result.RenewalCount;
      formData.FollowUpEmail = result.FollowUpEmail;
      formData.Notes = result.notes;

      dialogRefAddCurrency.componentInstance.loading = true;
      this.subscriptionsService.createSubscription(formData).subscribe(
        {
          next: data => {

            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;
            dialogRefAddCurrency.close();
            let succressDialog  = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                    title: "تم ارسال طلبك",
                    message: data.message,
                    buttonSend: "طلبات الاشتراكات"
              },
            });
       
            this.getSubscriptions(this.filteration);
            setTimeout(() => {
              succressDialog.close();

            }, 2000);
            succressDialog.componentInstance.submitted = true;
            succressDialog.componentInstance.submitClicked.subscribe(result => {
              succressDialog.close();

            })

          },
          error: err => {
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
  editSubscription(data: any) {
    
    let dialogRefAddCurrency = this.dialog.open(AddSubscriptionComponent, {
      width: "50vw",
      data: {
        title: "تعديل الإشتراك",
        setAsActive: "تعيين كنشط",
        titleNotes: "الملاحظات <span class='color-red'>*</span>",
        placeholdeNotes: "الملاحظات",
        ValidationNotes: "الملاحظات مطلوبة",
        titleClose: "تراجع",
        buttonSend:  "تعديل الإشتراك"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editSubscription = true;
    
    dialogRefAddCurrency.componentInstance.id = data.id;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      formData.id = data.id;
      formData.IsActive = result.IsActive;
      formData.Status = Number(result.Status);
      formData.PlanId = result.PlanId ? result.PlanId.key : null;
      formData.CompanyId = result.CompanyId ? result.CompanyId.key : null;
      formData.DurationInDays = result.DurationInDays;
      formData.StartDate = moment(new Date(result.StartDate)).format("YYYY-MM-DD");
      formData.EndDate = moment(new Date(result.EndDate)).format("YYYY-MM-DD");
      formData.RenewalCount = result.RenewalCount;
      formData.FollowUpEmail = result.FollowUpEmail;
      formData.Notes = result.notes;
      dialogRefAddCurrency.componentInstance.loading = true;
      dialogRefAddCurrency.componentInstance.loading = true;
      this.subscriptionsService.updateSubscription(formData).subscribe(
        {
          next: data => {

            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;
            dialogRefAddCurrency.close();
            let succressDialog  = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                    title: "تم ارسال طلبك",
                    message: data.message,
                    buttonSend: "طلبات الاشتراكات"
              },
            });
       
            this.getSubscriptions(this.filteration);
            setTimeout(() => {
              succressDialog.close();

            }, 2000);
            succressDialog.componentInstance.submitted = true;
            succressDialog.componentInstance.submitClicked.subscribe(result => {
              succressDialog.close();

            })

          },
          error: err => {
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


  dialogSubscriptionFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(SubscriptionInfoComponent, {
      width: "40vw",
      data: {
        title: "ملف الإشتراك"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id

  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getSubscriptions(this.filteration)
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
    this.getSubscriptions(filteration)

  }
  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
