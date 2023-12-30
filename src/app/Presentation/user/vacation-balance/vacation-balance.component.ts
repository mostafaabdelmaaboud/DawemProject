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
import { AddGroupComponent } from 'src/app/shared/components/add-group/add-group.component';
import { EditGroupComponent } from 'src/app/shared/components/edit-group/edit-group.component';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DialogGroupFileComponent } from 'src/app/shared/components/dialog-group-file/dialog-group-file.component';
import { AddSchedualPlanComponent } from 'src/app/shared/components/add-schedual-plan/add-schedual-plan.component';
import { DialogSchedulePlanFileComponent } from 'src/app/shared/components/dialog-schedule-plan-file/dialog-schedule-plan-file.component';
import { VacationBalanceService } from './services/vacation-balance.service';
import { AddVacationBalanceComponent } from 'src/app/shared/components/add-vacation-balance/add-vacation-balance.component';
import { DialogVacationBalanceFileComponent } from 'src/app/shared/components/dialog-vacation-balance-file/dialog-vacation-balance-file.component';
import { DialogDeleteComponent } from 'src/app/shared/components/dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-vacation-balance',
  templateUrl: './vacation-balance.component.html',
  styleUrls: ['./vacation-balance.component.scss']
})
export class VacationBalanceComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  private vacationBalanceService = inject(VacationBalanceService);


  columns: any[] = [
    {
      name: "رقم الاجازة",
      field: "code",
    },
    {
      name: "اسم الموظف",
      field: "employeeName",
    },
    {
      name: "نوع الاجازة",
      field: "vacationTypeName"
    },
    {
      name: "الرصيد",
      field: "balance"
    },
    {
      name: "الرصيد المتبقي",
      field: "remainingBalance"
    },
    {
      name: "التاريخ",
      field: "year"
    },
    {
      name: "الإجراء",
      field: "actions"
    }

  ];







  Vacations: any = [];

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
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.Vacations = this.Vacations;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.Vacations = this.Vacations;

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
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  getInformation() {
    this.spinnerCards = true;
    this.vacationBalanceService.getInformation().subscribe({
      next: data => {
        debugger;
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
  getVacations(filteration: any) {
    this.Vacations = [];
    this.isLoading = true;

    this.vacationBalanceService.listVacations(filteration).subscribe(data => {
      debugger;
      data.data.forEach((vacation: any) => {
        debugger;
        this.Vacations.push({
          id: vacation.id,
          code: vacation.code,
          employeeName: vacation.employeeName,
          vacationTypeName: vacation.vacationTypeName,
          balance: vacation.balance,
          remainingBalance: vacation.remainingBalance,
          year: vacation.year,
          isActive: vacation.isActive
        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;

    })
  }
  addVacation() {
    const dialogRefAddCurrency = this.dialog.open(AddVacationBalanceComponent, {
      width: "70vw",
      data: {
        title: "اضافه رصيد اجازة",
        setAsActive: "تعيين كنشط",

        titleDepartmentId: "نوع القسم",
        placeholdeDepartmentId: "نوع القسم",
        ValidationDepartmentId: "نوع القسم مطلوب",


        labelRadioButton: "نوع الاجازة",
        firstRadio: "لموظف",
        secondRadio: "لجروب",
        thirdRadio: "لقسم",

        titleEmployeeId: "نوع الموظف",
        placeholdeEmployeeId: "نوع الموظف",
        ValidationEmployeeId: "نوع الموظف مطلوب",


        titleVacationType: "نوع الاجازة",
        placeholdeVacationType: "نوع الاجازة",
        ValidationVacationType: "نوع الاجازة مطلوب",

        titleCalendar: "التاريخ",
        placeholderCalendar: "اختار التاريخ",
        validationCalendar: "التاريخ مطلوب",

        titleGroupId: "نواب الجروب",
        placeholdeGroupId: "نواب الجروب",
        ValidationGroupId: "نواب الجروب مطلوب",

        titleBalance: "رصيد الاجازات",
        placeholderBalance: "برجاء اختيار رصيد الاجازات",
        validationBalance: "رصيد الاجازات مطلوب",

        titleNotes: "الملاحظات <span class='color-red'>*</span>",
        placeholdeNotes: "الملاحظات",
        ValidationNotes: "الملاحظات مطلةب",

        titleClose: "تراجع",
        buttonSend: "إضافة رصيد اجازة"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editVacation = false;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      debugger;
      formData.isActive = result.isActive;

      formData.ForType = Number(result.ForType);
      formData.EmployeeId = result.EmployeeId ? result.EmployeeId.key : null;
      formData.GroupId = result.GroupId ? result.GroupId.key : null;
      formData.DepartmentId = result.DepartmentId ? result.DepartmentId.key : null;

      formData.Balance = result.Balance;

      formData.VacationType = result.VacationType.key;

      formData.Year = moment(new Date(result.Year)).format("yy");
      formData.notes = result.notes;
      debugger;
      dialogRefAddCurrency.componentInstance.loading = true;
      this.vacationBalanceService.createVacation(formData).subscribe(
        {
          next: data => {


            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات رصيد الاجازات"
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
  dialogVacationFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogVacationBalanceFileComponent, {
      width: "40vw",
      data: {
        title: "ملف رصيد الاجازة"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id
  }
  reasonOfRefuse(data: any) {
    const reasonOfRefuseDialog = this.dialog.open(DialogDeleteComponent, {
      width: "30vw",
      data: {
        title: "هل متأكد من حذف رصيد الاجازة؟",
        message: "برجاء توضيح السبب إن أمكن",

        titleClose: "تراجع",
        buttonSend: "حذف"
      },
    });

    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      this.vacationBalanceService.deleteVacation({ vacationBalanceId: data.id }).subscribe({
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
  editVacation(data: any) {
    const dialogRefAddCurrency = this.dialog.open(AddVacationBalanceComponent, {
      width: "70vw",
      data: {
        title: "تعديل رصيد اجازة",
        setAsActive: "تعيين كنشط",

        titleDepartmentId: "نوع القسم",
        placeholdeDepartmentId: "نوع القسم",
        ValidationDepartmentId: "نوع القسم مطلوب",


        labelRadioButton: "نوع الاجازة",
        firstRadio: "لموظف",
        secondRadio: "لجروب",
        thirdRadio: "لقسم",

        titleEmployeeId: "نوع الموظف",
        placeholdeEmployeeId: "نوع الموظف",
        ValidationEmployeeId: "نوع الموظف مطلوب",


        titleVacationType: "نوع الاجازة",
        placeholdeVacationType: "نوع الاجازة",
        ValidationVacationType: "نوع الاجازة مطلوب",

        titleCalendar: "التاريخ",
        placeholderCalendar: "اختار التاريخ",
        validationCalendar: "التاريخ مطلوب",

        titleGroupId: "نواب الجروب",
        placeholdeGroupId: "نواب الجروب",
        ValidationGroupId: "نواب الجروب مطلوب",

        titleBalance: "رصيد الاجازات",
        placeholderBalance: "برجاء اختيار رصيد الاجازات",
        validationBalance: "رصيد الاجازات مطلوب",

        titleNotes: "الملاحظات <span class='color-red'>*</span>",
        placeholdeNotes: "الملاحظات",
        ValidationNotes: "الملاحظات مطلةب",

        titleClose: "تراجع",
        buttonSend: "حفظ رصيد اجازة"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editVacation = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      debugger;
      formData.isActive = result.isActive;
      formData.id = data.id;

      formData.ForType = Number(result.ForType);
      formData.EmployeeId = result.EmployeeId ? result.EmployeeId.key : null;
      formData.GroupId = result.GroupId ? result.GroupId.key : null;
      formData.DepartmentId = result.DepartmentId ? result.DepartmentId.key : null;

      formData.Balance = result.Balance;

      formData.VacationType = result.VacationType.key;

      formData.Year = moment(new Date(result.Year)).format("yy");
      formData.notes = result.notes;
      debugger;
      dialogRefAddCurrency.componentInstance.loading = true;
      this.vacationBalanceService.updateVacation(formData).subscribe(
        {
          next: data => {


            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات رصيد الاجازات"
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

  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getVacations(this.filteration)
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

  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
