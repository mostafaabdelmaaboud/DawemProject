import { ChangeDetectorRef, Component, Inject, LOCALE_ID, inject } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, map } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RequestTaskComponent } from 'src/app/shared/components/request-task/request-task.component';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { ToastrService } from 'ngx-toastr';
import { TasksService } from './services/tasks.service';
import { DialogTaskFileComponent } from 'src/app/shared/components/dialog-task-file/dialog-task-file.component';
import * as moment from 'moment';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
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
      name: "المهمة",
      field: "task"
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
  tasks: any = [];

  isLoading = true;

  filteration: any = {
    PageSize: 5,
    PageNumber: 0,
    PagingEnabled: true
  };
  list: any[] = [
    { name: "نسيان تسجيل حضور", key: "1" },
    { name: "نسيان تسجيل انصراف", key: "2" },
    { name: "تسجيل حضور خاطئ", key: "3" },
    { name: "تسجيل انصراف خاطئ", key: "4" }

  ];
  services: any[] = [
    { name: 'Cash in', key: 'cashIn' },
    { name: 'Cash out', key: 'cashOut' }
  ];
  page = 0;
  categories: any[] = [
  ];
  private tasksService = inject(TasksService);

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
        this.tasks = this.tasks;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.tasks = this.tasks;

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

    this.getTasks(this.filteration)
  }
  getInformation() {
    this.spinnerCards = true;

    this.tasksService.getInformation().subscribe({
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
  getTasks(filteration: any) {
    this.tasks = [];
    this.isLoading = true;
    this.tasksService.listTasks(filteration).subscribe(data => {
      data.data.forEach((employee: any) => {

        this.tasks.push({
          id: employee.id,
          orderNumber: employee.employee.code ? employee.employee.code : "لا يوجد",
          status: employee.status,
          employeeName: {
            name: employee.employee.name,
            alt: employee.employee.name,
            img: employee.employee.profileImagePath ? employee.employee.profileImagePath : "../../../../assets/img/5034901-200.png"
          },
          task: employee.taskTypeName,
          date: moment(new Date(employee.dateFrom)).format("MM/DD/YYYY"),
          statusName: employee.statusName ? employee.statusName : "لا يوجد"
        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;
    })
  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getTasks(this.filteration)
  }
  editTask(data: any) {
    const dialogRefAddCurrency = this.dialog.open(RequestTaskComponent, {
      width: "50vw",
      data: {
        title: "تعديل مهمة عمل",
        setAsNecessary: "تعيين كضرورية",
        titleDropdownOne: "نوع مهمة عمل <span class='color-red'>*</span>",
        placeholderDropdown: " برجاء اختيار نوع مهمة",
        titleCalendar: "تاريخ مهمة عمل <span class='color-red'>*</span>",
        placeholderCalendar: "تاريخ مهمة عمل",
        dateTaskValidation: "تاريخ مهمة العمل مطلوب",
        labelRadioButton: "صاحب الطلب",
        TaskTypeIdValidation: "نوع مهمة العمل مطلوب",
        firstRadio: "لنفسي",
        secondRadio: "لموظف",
        timeAttendance: "وقت مهمة العمل",
        placeholdertimeAttendance: "وقت مهمة العمل",
        titleWorkTeam: "فريق العمل",
        titleEmployeeId: "الموظف <span class='color-red'>*</span>",
        placeholderEmployeeId: "الموظف",
        EmployeeIdValidation: "الموظف مطلوب",
        placeholderWorkTeam: "فريق العمل",
        uploadFile: "ارفاق ملف",
        chooseLabel: "اختار الملف ليتم رفعه",
        titleNotes: "ملاحظات",
        placeholdeNotes: "برجاء كتابة الملاحظات هنا",
        buttonSend: "حفظ الطلب"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editTask = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    // dialogRefAddCurrency.componentInstance.list = this.categories;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = new FormData();
      if (result.ForEmployee) {
        formData.append("UpdateRequestTaskModelString", JSON.stringify({
          id: data.id,
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          EmployeeId: result.EmployeeId.key,
          TaskTypeId: result.TaskTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM/DD/YYYY"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM/DD/YYYY"),
          TaskEmployeeIds: result.TaskEmployeeIds.map((id: any) => id.key),
          Notes: result.Notes
        }));
      } else {
        formData.append("UpdateRequestTaskModelString", JSON.stringify({
          id: data.id,
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          TaskTypeId: result.TaskTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM/DD/YYYY"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM/DD/YYYY"),
          TaskEmployeeIds: result.TaskEmployeeIds.map((id: any) => id.key),
          Notes: result.Notes
        }));
      }
      result.files.forEach((file: any) => {
        if (file.detailsImage === false) {
          formData.append("Attachments", file.fileUpload, file.fileUpload.name);


        }
      });
      dialogRefAddCurrency.componentInstance.submitted = false;

      this.tasksService.updateTask(formData).subscribe(
        {
          next: data => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات مهمات العمل"

              },
            });
            this.getTasks(this.filteration);

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
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getTasks(this.filteration)
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


      this.tasksService.rejectTask({ id: data.id, rejectReason: result.notes }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getTasks(this.filteration);
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
    this.tasksService.accept({ requestId: data.id }).subscribe(
      {
        next: res => {

          this.getTasks(this.filteration);
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
  dialogTaskFile(data: any) {

    const dialogRefAddCurrency = this.dialog.open(DialogTaskFileComponent, {
      width: "40vw",
      data: {
        title: "ملف المهمة"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id
  }
  requestTask() {
    const dialogRefAddCurrency = this.dialog.open(RequestTaskComponent, {
      width: "50vw",
      data: {
        title: "طلب مهمة عمل",
        setAsNecessary: "تعيين كضرورية",
        titleDropdownOne: "نوع مهمة عمل <span class='color-red'>*</span>",
        placeholderDropdown: " برجاء اختيار نوع مهمة",
        titleCalendar: "تاريخ مهمة عمل <span class='color-red'>*</span>",
        placeholderCalendar: "تاريخ مهمة عمل",
        dateTaskValidation: "تاريخ مهمة العمل مطلوب",
        labelRadioButton: "صاحب الطلب",
        TaskTypeIdValidation: "نوع مهمة العمل مطلوب",
        firstRadio: "لنفسي",
        secondRadio: "لموظف",
        timeAttendance: "وقت مهمة العمل",
        placeholdertimeAttendance: "وقت مهمة العمل",
        titleWorkTeam: "فريق العمل",
        titleEmployeeId: "الموظف <span class='color-red'>*</span>",
        placeholderEmployeeId: "الموظف",
        EmployeeIdValidation: "الموظف مطلوب",
        placeholderWorkTeam: "فريق العمل",
        uploadFile: "ارفاق ملف",
        chooseLabel: "اختار الملف ليتم رفعه",
        titleNotes: "ملاحظات",
        placeholdeNotes: "برجاء كتابة الملاحظات هنا",
        buttonSend: "إرسال الطلب"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editTask = false;
    // dialogRefAddCurrency.componentInstance.list = this.categories;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = new FormData();


      if (result.ForEmployee) {
        formData.append("CreateRequestTaskModelString", JSON.stringify({
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          EmployeeId: result.EmployeeId.key,

          TaskTypeId: result.TaskTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM/DD/YYYY"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM/DD/YYYY"),
          TaskEmployeeIds: result.TaskEmployeeIds.map((id: any) => id.key),
          Notes: result.Notes
        }));

      } else {
        formData.append("CreateRequestTaskModelString", JSON.stringify({
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          TaskTypeId: result.TaskTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM/DD/YYYY"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM/DD/YYYY"),
          TaskEmployeeIds: result.TaskEmployeeIds.map((id: any) => id.key),
          Notes: result.Notes
        }));
      }
      result.files.forEach((file: any) => {
        formData.append("Attachments", file.fileUpload, file.fileUpload.name);
      });
      dialogRefAddCurrency.componentInstance.submitted = false;

      this.tasksService.createTask(formData).subscribe(
        {
          next: data => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات مهمات العمل"

              },
            });
            this.getTasks(this.filteration);

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

      // const succressDialog = this.dialog.open(ToastSuccessComponent, {
      //   width: "30vw",
      //   data: {
      //     title: "تم ارسال طلبك",
      //     message: "طلبك في انتظار الموافقة، ويمكنك متابعة حالة الطلب من صفحة التبريرات",
      //     buttonSend: "طلبات مهمات العمل"
      //   },
      // });
      // setTimeout(() => {
      //   succressDialog.close();

      // }, 2000);
      // succressDialog.componentInstance.submitted = true;
      // succressDialog.componentInstance.submitClicked.subscribe(result => {
      //   succressDialog.close();

      // })
      // dialogRefAddCurrency.componentInstance.submitted = false;
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  changePage(even: number) {
    this.filteration.page = even;
    let filteration = { ...this.filteration, page: even - 1 };
    this.getTasks(filteration)

  }
  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
