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
import { VacationTypeService } from './services/vacation-type.service';
import { DialogDeleteComponent } from 'src/app/shared/components/dialog-delete/dialog-delete.component';
import { RequestVacationTypeComponent } from 'src/app/shared/components/request-vacation-type/request-vacation-type.component';
import { DialogVacationTypeFileComponent } from 'src/app/shared/components/dialog-vacation-type-file/dialog-vacation-type-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
@Component({
  selector: 'app-vacation-type',
  templateUrl: './vacation-type.component.html',
  styleUrls: ['./vacation-type.component.scss']
})
export class VacationTypeComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);

  columns: any[] = [
    {
      name: "رقم الاجازة",
      field: "code",
    },
    {
      name: "الأسم",
      field: "name",
    },
    {
      name: "نوع الاجازة",
      field: "typeName",
    },

    {
      name: "حاله الطلب",
      field: "isActive"
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
  cards!: any;
  spinnerCards = false;
  private _mobileQueryListener: () => void;
  private vacationTypeService = inject(VacationTypeService);
  list: any[] = [
    { name: "نسيان تسجيل حضور", key: "1" },
    { name: "نسيان تسجيل انصراف", key: "2" },
    { name: "تسجيل حضور خاطئ", key: "3" },
    { name: "تسجيل انصراف خاطئ", key: "4" }

  ];
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
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

    this.getVacations(this.filteration);
  }
  getInformation() {
    this.spinnerCards = true;
    this.vacationTypeService.getInformation().subscribe({
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
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 36, actionCode: data.actionCode })
  }
  getVacations(filteration: any) {
    this.vacations = [];
    this.isLoading = true;
    this.vacationTypeService.listVacations(filteration).subscribe(
      {
        next: data => {
          data.data.forEach((vacation: any) => {
            this.vacations.push({
              id: vacation.id,
              code: vacation.code,
              name: vacation.name,
              typeName: vacation.typeName,
              isActive: vacation.isActive

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
  reasonOfRefuse(data: any) {
    const reasonOfRefuseDialog = this.dialog.open(DialogDeleteComponent, {
      width: "30vw",
      data: {
        title: "هل متأكد من حذف الطلب؟",
        message: "برجاء توضيح السبب إن أمكن",

        titleClose: "تراجع",
        buttonSend: "حذف"
      },
    });

    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      this.vacationTypeService.deleteVacation({ VacationTypeId: data.id }).subscribe({
        next: res => {
          this.toast.success(res.message);
          reasonOfRefuseDialog.componentInstance.submitted = true;
          reasonOfRefuseDialog.close();
          this.getVacations(this.filteration);
        },
        error: err => {
          reasonOfRefuseDialog.componentInstance.submitted = true;

        }
      })



    })
  }
  requestVacation() {
    const dialogRefAddCurrency = this.dialog.open(RequestVacationTypeComponent, {
      width: "50vw",
      data: {
        title: "طلب اجازة",
        setAsNecessary: "تعيين كضرورية",
        titleVacationTypeId: "نوع الاجازة <span class='color-red'>*</span>",
        titleName: "الأسم<span class='color-red'>*</span>",
        placeholdeName: "برجاء ادخال الأسم",
        validationtitleName: "الأسم مطلوب",
        buttonSend: "إرسال الطلب"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editVacation = false;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      formData.name = result.name;
      formData.isActive = result.IsNecessary;
      formData.DefaultType = result.type.key;

      dialogRefAddCurrency.componentInstance.submitted = false;

      this.vacationTypeService.createVacation(formData).subscribe(
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
    const dialogRefAddCurrency = this.dialog.open(RequestVacationTypeComponent, {
      width: "50vw",
      data: {
        title: "طلب اجازة",
        setAsNecessary: "تعيين كضرورية",
        titleVacationTypeId: "نوع الاجازة <span class='color-red'>*</span>",
        titleName: "الأسم<span class='color-red'>*</span>",
        placeholdeName: "برجاء ادخال الأسم",
        validationtitleName: "الأسم مطلوب",
        buttonSend: "إرسال الطلب"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editVacation = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      formData.id = data.id;
      formData.name = result.name;
      formData.isActive = result.IsNecessary;
      formData.DefaultType = result.type.key;

      dialogRefAddCurrency.componentInstance.submitted = false;

      this.vacationTypeService.updateVacation(formData).subscribe(
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


  dialogVacationFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogVacationTypeFileComponent, {
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
