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
import { SchedualPlanService } from './services/schedual-plan.service';
import { AddSchedualPlanComponent } from 'src/app/shared/components/add-schedual-plan/add-schedual-plan.component';
import { DialogSchedulePlanFileComponent } from 'src/app/shared/components/dialog-schedule-plan-file/dialog-schedule-plan-file.component';

@Component({
  selector: 'app-schedual-plan',
  templateUrl: './schedual-plan.component.html',
  styleUrls: ['./schedual-plan.component.scss']
})
export class SchedualPlanComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  private schedualPlanService = inject(SchedualPlanService);


  columns: any[] = [
    {
      name: "رقم الجدولة",
      field: "code",
    },
    {
      name: "اسم الجدولة",
      field: "scheduleName",
    },
    {
      name: "نوع الجدولة",
      field: "schedulePlanTypeName"
    },
    {
      name: "التاريخ",
      field: "dateFrom"
    },

    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  schedualPlan: any = [];

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
        this.schedualPlan = this.schedualPlan;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.schedualPlan = this.schedualPlan;

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

    this.getGroups(this.filteration);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  getInformation() {
    this.spinnerCards = true;
    this.schedualPlanService.getInformation().subscribe({
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
  getGroups(filteration: any) {
    this.schedualPlan = [];
    this.isLoading = true;

    this.schedualPlanService.listSchedualPlan(filteration).subscribe(data => {

      data.data.forEach((schedualPlan: any) => {


        this.schedualPlan.push({
          id: schedualPlan.id,
          code: schedualPlan.code,
          scheduleName: schedualPlan.scheduleName,
          schedulePlanTypeName: schedualPlan.schedulePlanTypeName,
          dateFrom: moment(new Date(schedualPlan.dateFrom)).format("MM/DD/YYYY"),

          isActive: schedualPlan.isActive
        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;

    })
  }
  addSchedualPlane() {
    const dialogRefAddCurrency = this.dialog.open(AddSchedualPlanComponent, {
      width: "70vw",
      data: {
        title: "اضافه جدولة",
        setAsActive: "تعيين كنشط",

        titleDepartmentId: "نوع القسم",
        placeholdeDepartmentId: "نوع القسم",
        ValidationDepartmentId: "نوع القسم مطلوب",


        labelRadioButton: "نوع الجدولة",
        firstRadio: "لموظف",
        secondRadio: "لجروب",
        thirdRadio: "لقسم",

        titleEmployeeId: "نوع الموظف",
        placeholdeEmployeeId: "نوع الموظف",
        ValidationEmployeeId: "نوع الموظف مطلوب",


        titleScheduleId: "جدول الدوام",
        placeholdeScheduleId: "جدول الدوام",
        ValidationScheduleId: "جدول الدوام مطلوب",

        titleCalendar: "التاريخ",
        placeholderCalendar: "اختار التاريخ",
        validationCalendar: "التاريخ مطلوب",

        titleGroupId: "نواب الجروب",
        placeholdeGroupId: "نواب الجروب",
        ValidationGroupId: "نواب الجروب مطلوب",

        titleNotes: "الملاحظات <span class='color-red'>*</span>",
        placeholdeNotes: "الملاحظات",
        ValidationNotes: "الملاحظات مطلةب",

        titleClose: "تراجع",
        buttonSend: "إضافة جدولة"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editSchedualPlan = false;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};

      formData.isActive = result.isActive;

      formData.SchedulePlanType = Number(result.SchedulePlanType);
      formData.EmployeeId = result.EmployeeId ? result.EmployeeId.key : null;
      formData.GroupId = result.GroupId ? result.GroupId.key : null;
      formData.DepartmentId = result.DepartmentId ? result.DepartmentId.key : null;
      formData.ScheduleId = result.ScheduleId.key;
      formData.DateFrom = moment(new Date(result.DateFrom)).format("DD/MM/YYYY");
      formData.notes = result.notes;




      this.schedualPlanService.createSchedualPlan(formData).subscribe(
        {
          next: data => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الجدولة"
              },
            });
            this.getGroups(this.filteration);
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

          }
        }
      )
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  dialogGroupFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogSchedulePlanFileComponent, {
      width: "40vw",
      data: {
        title: "ملف الجدولة"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id
  }
  enabledRow(data: any) {

    this.schedualPlanService.enabledSchedualPlan({ groupId: data.id }).subscribe(
      {
        next: res => {

          this.toast.success(res.message);
          this.getGroups(this.filteration);
        },
        error: err => {

        }
      }
    )
  }
  editSchedualPlane(data: any) {
    const dialogRefAddCurrency = this.dialog.open(AddSchedualPlanComponent, {
      width: "70vw",
      data: {
        title: "تعديل الجدولة",
        setAsActive: "تعيين كنشط",

        titleDepartmentId: "نوع القسم",
        placeholdeDepartmentId: "نوع القسم",
        ValidationDepartmentId: "نوع القسم مطلوب",


        labelRadioButton: "نوع الجدولة",
        firstRadio: "لموظف",
        secondRadio: "لجروب",
        thirdRadio: "لقسم",

        titleEmployeeId: "نوع الموظف",
        placeholdeEmployeeId: "نوع الموظف",
        ValidationEmployeeId: "نوع الموظف مطلوب",


        titleScheduleId: "جدول الدوام",
        placeholdeScheduleId: "جدول الدوام",
        ValidationScheduleId: "جدول الدوام مطلوب",

        titleCalendar: "التاريخ",
        placeholderCalendar: "اختار التاريخ",
        validationCalendar: "التاريخ مطلوب",

        titleGroupId: "نواب الجروب",
        placeholdeGroupId: "نواب الجروب",
        ValidationGroupId: "نواب الجروب مطلوب",

        titleNotes: "الملاحظات <span class='color-red'>*</span>",
        placeholdeNotes: "الملاحظات",
        ValidationNotes: "الملاحظات مطلةب",

        titleClose: "تراجع",
        buttonSend: "تعديل الجدولة"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editSchedualPlan = true;

    dialogRefAddCurrency.componentInstance.id = data.id;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};

      formData.id = data.row;

      formData.isActive = result.isActive;

      formData.SchedulePlanType = Number(result.SchedulePlanType);
      formData.EmployeeId = result.EmployeeId ? result.EmployeeId.key : null;
      formData.GroupId = result.GroupId ? result.GroupId.key : null;
      formData.DepartmentId = result.DepartmentId ? result.DepartmentId.key : null;
      formData.ScheduleId = result.ScheduleId.key;
      formData.DateFrom = moment(new Date(result.DateFrom)).format("DD/MM/YYYY");
      formData.notes = result.notes;




      this.schedualPlanService.updateSchedualPlan(formData).subscribe(
        {
          next: data => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الجدولة"
              },
            });
            this.getGroups(this.filteration);
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
    this.getGroups(this.filteration)
  }


  deleteRow(data: any) {

    const reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
      width: "30vw",
      data: {
        title: "متأكد من تعليق المجموعة؟",
        message: "برجاء توضيح السبب إن أمكن ليظهر للمجموعة عند محاولة تسجيل الدخول",
        titleReasonOfRefuse: "سبب التعليق",
        placeholdeReasonOfRefuse: "برجاء كتابة سبب الرفض ليظهر للمجموعة",
        titleClose: "تراجع",
        buttonSend: "تعليق المجموعة"
      },
    });
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      this.schedualPlanService.disabledSchedualPlan({ Id: data.id, DisableReason: result.notes }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getGroups(this.filteration);
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
    this.getGroups(this.filteration)
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
