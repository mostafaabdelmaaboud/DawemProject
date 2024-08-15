import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RequestTaskComponent } from 'src/app/shared/components/request-task/request-task.component';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { ToastrService } from 'ngx-toastr';
import { TasksService } from './services/tasks.service';
import { DialogTaskFileComponent } from 'src/app/shared/components/dialog-task-file/dialog-task-file.component';
import * as moment from 'moment';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { ActivatedRoute } from '@angular/router';

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
  destroy$: Subject<boolean> = new Subject<boolean>();
  columns: any[] = [
    {
      name: "رقم الطلب",
      field: "orderNumber",
    },
    {
      name: "الرقم الوظيفى",
      field: "employeeCode",
    },
    {
      name: "اسم الموظف",
      field: "employeeName",
    },
    {
      name: "نوع المهمه",
      field: "task"
    },
 
    {
      name: "تاريخ البداية",
      field: "dateFrom"
    },
    {
      name: "تاريخ النهاية",
      field: "dateTo"
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
  tasksIsExport: any = [];
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
  defaultRowPerPage = { name: '5', code: 5 };

  spinnerCards = false;
  private _mobileQueryListener: () => void;
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
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

    this.getTasks(this.filteration);
    this.translate.get("tasks").subscribe(data => {
      this.columns = [
        {
          name: data.orderNumber,
          field: "orderNumber",
        },
        {
          name: data.jobNumber,
          field: "employeeCode",
        },
        {
          name: data.employeeName,
          field: "employeeName",
        },
        {
          name: data.theMission,
          field: "task"
        },
    
        {
          name: data.startDate,
          field: "dateFrom"
        },
        {
          name: data.expiryDate,
          field: "dateTo"
        },
        {
          name: data.orderStatus,
          field: "statusName"
        },
        {
          name: data.action,
          field: "actions"
        }
      ];
    })
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(dataParent => {
      this.translate.get("tasks").subscribe(data => {
        this.columns = [
          {
            name: data.orderNumber,
            field: "orderNumber",
          },
          {
            name: data.jobNumber,
            field: "employeeCode",
          },
          {
            name: data.employeeName,
            field: "employeeName",
          },
          {
            name: data.theMission,
            field: "task"
          },
        
          {
            name: data.startDate,
            field: "dateFrom"
          },
          {
            name: data.expiryDate,
            field: "dateTo"
          },
          {
            name: data.orderStatus,
            field: "statusName"
          },
          {
            name: data.action,
            field: "actions"
          }
        ];
      })
 
    })
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
    this.getTasks(this.filteration);
  }
  exportTableToExcel() {
    let columns = [...this.columns];
    delete columns[8]
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'طلبات المهمات',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };
    if(!this.isLoading) {
      this.isLoading = true;
      let filteration = {...this.filteration, isExport:true};
      this.tasksService.listTasks(filteration).subscribe(data => {
        this.tasksIsExport = [];

        data.data.forEach((employee: any) => {
          this.tasksIsExport.push({
            id: employee.id,
            orderNumber: employee.code ? employee.code : "لا يوجد",
            status: employee.status,
            employeeCode:employee.employee.employeeNumber,
            employeeName: {
              name: employee.employee.name,
              alt: employee.employee.name,
              img: employee.employee.profileImagePath ? employee.employee.profileImagePath : "../../../../assets/img/5034901-200.png"
            },
            task: employee.taskTypeName,
            dateFrom:  moment(new Date(employee.dateFrom)).format("MM-DD-YYYY h:mm a"),

            // moment(new Date(employee.dateFrom)).format("MM/DD/YYYY"),
            dateTo: moment(new Date(employee.dateTo)).format("MM-DD-YYYY h:mm a"),
            statusName: employee.statusName ? employee.statusName : "لا يوجد"
          })
        });
        let formatTable = this.tasksIsExport.map(task => {
          return {
            orderNumber: task.orderNumber,
            employeeCode:task.employeeCode,
            employeeName: task.employeeName.name,
            task: task.task,
            dateFrom: task.dateFrom,
            dateTo: task.dateTo,
            statusName: task.statusName,
          }
        })
        this.isLoading = false;
        new ngxCsv(formatTable, "sheet", options);
      })
    }
  }
  exportTableToPDF() {  
    if(!this.isLoading) {
      this.isLoading = true;
      let table: any = document.getElementById("tableTasksHidden");
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
    this.getTasks(this.filteration);
  }
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: Number(this.id), actionCode: data.actionCode })
  }
  getTasks(filteration: any) {
    this.tasks = [];
    this.isLoading = true;
    this.tasksService.listTasks(filteration).subscribe(data => {
      data.data.forEach((employee: any) => {

        this.tasks.push({
          id: employee.id,
          orderNumber: employee.code ? employee.code : "لا يوجد",
          status: employee.status,
          employeeCode:employee.employee.employeeNumber,
          employeeName: {
            name: employee.employee.name,
            alt: employee.employee.name,
            img: employee.employee.profileImagePath ? employee.employee.profileImagePath : "../../../../assets/img/5034901-200.png"
          },
          task: employee.taskTypeName,
          dateFrom:  moment(new Date(employee.dateFrom)).format("MM-DD-YYYY h:mm a"),
          dateTo: moment(new Date(employee.dateTo)).format("MM-DD-YYYY h:mm a"),

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
    let dialogRefAddCurrency!:MatDialogRef<RequestTaskComponent, any>;
    this.translate.get("tasks").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(RequestTaskComponent, {
        width: "50vw",
        data: {
          title: translate.modifyAWorkTask,
          setAsNecessary: translate.setAsEssential,
          titleDropdownOne: translate.businessTaskType+" <span class='color-red'>*</span>",
          placeholderDropdown: translate.pleaseSelectATaskType,
          titleCalendar: translate.historyOfAWorkAssignment+" <span class='color-red'>*</span>",
          placeholderCalendar: translate.historyOfAWorkAssignment,
          dateTaskValidation: translate.workAssignmentDateRequired,
          labelRadioButton: translate.applicant,
          TaskTypeIdValidation: translate.workTaskTypeRequired,
          firstRadio: translate.forMyself,
          secondRadio: translate.toAnEmployee,
          timeAttendance: translate.timeForWorkAssignment,
          placeholdertimeAttendance: translate.timeForWorkAssignment,
          titleWorkTeam: translate.workTeam+" <span class='color-red'>*</span>",
          titleEmployeeId: translate.employee+" <span class='color-red'>*</span>",
          placeholderEmployeeId: translate.employee,
          EmployeeIdValidation: translate.employeeRequired,
          placeholderWorkTeam: translate.workTeam,
          uploadFile: translate.attachAFile,
          chooseLabel: translate.selectTheFileToUpload,
          titleNotes: translate.comments,
          placeholdeNotes: translate.pleaseWriteNotesHere,
          buttonSend: "موافق",
        },
      });
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
          DateFrom: moment(new Date(result.dateTask[0])).format("MM-DD-YYYY") + " " + moment(new Date(result.timeStart)).format("HH:mm:ss"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM-DD-YYYY") + " " + moment(new Date(result.timeEnd)).format("HH:mm:ss"),
          TaskEmployeeIds: result.TaskEmployeeIds.map((id: any) => id.key),
          Notes: result.Notes
        }));
      } else {
        formData.append("UpdateRequestTaskModelString", JSON.stringify({
          id: data.id,
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          TaskTypeId: result.TaskTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM-DD-YYYY") + " " + moment(new Date(result.timeStart)).format("HH:mm:ss"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM-DD-YYYY") + " " + moment(new Date(result.timeEnd)).format("HH:mm:ss"),
          TaskEmployeeIds: result.TaskEmployeeIds.map((id: any) => id.key),
          Notes: result.Notes
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

      this.tasksService.updateTask(formData).subscribe(
        {
          next: data => {
            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;
            dialogRefAddCurrency.close();
            let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
            this.translate.get("tasks").subscribe(translate => {
              succressDialog = this.dialog.open(ToastSuccessComponent, {
                width: "30vw",
                data: {
                  title: translate.yourRequestHasBeenSent,
                  message: data.message,
                  buttonSend: translate.workRequests
                },
              });
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
  requestTask() {
    let dialogRefAddCurrency!:MatDialogRef<RequestTaskComponent, any>;
    this.translate.get("tasks").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(RequestTaskComponent, {
        width: "50vw",
        data: {
          title: translate.requestAWorkAssignment,
          setAsNecessary: translate.setAsEssential,
          titleDropdownOne: translate.businessTaskType+" <span class='color-red'>*</span>",
          placeholderDropdown: translate.pleaseSelectATaskType,
          titleCalendar: translate.historyOfAWorkAssignment+" <span class='color-red'>*</span>",
          placeholderCalendar: translate.historyOfAWorkAssignment,
          dateTaskValidation: translate.workAssignmentDateRequired,
          labelRadioButton: translate.applicant,
          TaskTypeIdValidation: translate.workTaskTypeRequired,
          firstRadio: translate.forMyself,
          secondRadio: translate.toAnEmployee,
          timeAttendance: translate.timeForWorkAssignment,
          placeholdertimeAttendance: translate.timeForWorkAssignment,
          titleWorkTeam: translate.workTeam+" <span class='color-red'>*</span>",
          titleEmployeeId: translate.employee+" <span class='color-red'>*</span>",
          placeholderEmployeeId: translate.employee,
          EmployeeIdValidation: translate.employeeRequired,
          placeholderWorkTeam: translate.workTeam,
          uploadFile: translate.attachAFile,
          chooseLabel: translate.selectTheFileToUpload,
          titleNotes: translate.comments,
          placeholdeNotes: translate.pleaseWriteNotesHere,
          buttonSend: translate.sendRequest
        },
      });
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
          DateFrom: moment(new Date(result.dateTask[0])).format("MM-DD-YYYY") + " " + moment(new Date(result.timeStart)).format("HH:mm:ss"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM-DD-YYYY") + " " + moment(new Date(result.timeEnd)).format("HH:mm:ss"),
          TaskEmployeeIds: result.TaskEmployeeIds.map((id: any) => id.key),
          Notes: result.Notes
        }));

      } else {
        formData.append("CreateRequestTaskModelString", JSON.stringify({
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          TaskTypeId: result.TaskTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM-DD-YYYY") + " " + moment(new Date(result.timeStart)).format("HH:mm:ss"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM-DD-YYYY") + " " + moment(new Date(result.timeEnd)).format("HH:mm:ss"),
          TaskEmployeeIds: result.TaskEmployeeIds.map((id: any) => id.key),
          Notes: result.Notes
        }));
      }
      result.files.forEach((file: any) => {
        formData.append("Attachments", file.fileUpload, file.fileUpload.name);
      });
      dialogRefAddCurrency.componentInstance.submitted = false;
      dialogRefAddCurrency.componentInstance.loading = true;

      this.tasksService.createTask(formData).subscribe(
        {
          next: data => {


            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;

            dialogRefAddCurrency.close();
            let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
            this.translate.get("tasks").subscribe(translate => {
              succressDialog = this.dialog.open(ToastSuccessComponent, {
                width: "30vw",
                data: {
                  title: translate.yourRequestHasBeenSent,
                  message: data.message,
                  buttonSend: translate.workRequests
                },
              });
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
            dialogRefAddCurrency.componentInstance.loading = false;

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
    let reasonOfRefuseDialog!:MatDialogRef<DialogCloseComponent, any>;
    this.translate.get("justifications").subscribe(translate => {
      reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
        width: "30vw",
        data: {
          title: translate.areYouSureTheRequestWillBeRejected,
          message: translate.pleaseExplainWhyIfPossible,
          titleReasonOfRefuse: translate.theReasonOfRefuse,
          placeholdeReasonOfRefuse: translate.pleaseWriteTheReasonForRejection,
          titleClose: translate.toRetreat,
          buttonSend: translate.rejectionOfTheApplication
        },
      });
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
    let dialogRefAddCurrency!:MatDialogRef<DialogTaskFileComponent, any>;
    this.translate.get("tasks").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(DialogTaskFileComponent, {
        width: "40vw",
        data: {
          title: translate.taskFile
        },
      });
    });
  
    dialogRefAddCurrency.componentInstance.id = data.id
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
  ngOnDestroy() {
    this.destroy$.next(true);
    this.subscription.unsubscribe();
  }
}
