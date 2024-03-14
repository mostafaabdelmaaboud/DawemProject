import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { AssignmentRequestComponent } from 'src/app/shared/components/assignment-request/assignment-request.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { DialogAssignementFileComponent } from 'src/app/shared/components/dialog-assignement-file/dialog-assignement-file.component';
import * as moment from 'moment';
import { AssignmentsService } from './services/assignments.service';
import { ToastrService } from 'ngx-toastr';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';

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
  destroy$: Subject<boolean> = new Subject<boolean>();

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
      name: "رقم الوظيفي",
      field: "orderNumber",
    },
    {
      name: "اسم الموظف",
      field: "employeeName",
    },
    {
      name: "نوع التكليف",
      field: "assignmentTypeName"
    },
    {
      name: "لوقت التكليف",
      field: "assignmentTime"
    },
    {
      name: "البداية",
      field: "dateFrom"
    },
    {
      name: "النهاية",
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


  assignments: any = [];
  assignmentsIsExport: any = [];
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
  private assignmentsService = inject(AssignmentsService)

  totalItems: number = 0;
  first: number = 0;
  rows: number = 10;
  RowsPerPage!: any[];
  mobileQuery: MediaQueryList;
  opened = false;
  cards!: any;
  spinnerCards = false;
  defaultRowPerPage = { name: '5', code: 5 };

  private _mobileQueryListener: () => void;
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.assignments = this.assignments;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.assignments = this.assignments;

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
  ngOnInit(): void {
    this.translate.get("assignments").subscribe(data => {
      this.columns = [
        {
          name: data.orderNumber,
          field: "employeeCode",
        },
        {
          name: data.jobNumber,
          field: "orderNumber",
        },
        {
          name: data.employeeName,
          field: "employeeName",
        },
        {
          name: data.assignmentType,
          field: "assignmentTypeName"
        },
        {
          name: data.forTheTimeOfAssignment,
          field: "assignmentTime"
        },
        {
          name: data.theBeginning,
          field: "dateFrom"
        },
        {
          name: data.theEnd,
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
      this.translate.get("assignments").subscribe(data => {
        this.columns = [
          {
            name: data.orderNumber,
            field: "employeeCode",
          },
          {
            name: data.jobNumber,
            field: "orderNumber",
          },
          {
            name: data.employeeName,
            field: "employeeName",
          },
          {
            name: data.assignmentType,
            field: "assignmentTypeName"
          },
          {
            name: data.forTheTimeOfAssignment,
            field: "assignmentTime"
          },
          {
            name: data.theBeginning,
            field: "dateFrom"
          },
          {
            name: data.theEnd,
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
      // this.subscription = this.translate.stream('primeng').subscribe(data => {
      //   this.config.setTranslation(data);
      // });  
    })
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

    this.getAssignments(this.filteration);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 24, actionCode: data.actionCode })
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
    })
    delete this.filteration.PageNumber;

    this.getAssignments(this.filteration);
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
      title: 'طلبات التكليفات',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };

    if(!this.isLoading) {
      this.isLoading = true;
      this.assignmentsIsExport = [];
      let filteration = {...this.filteration, isExport:true};

      this.assignmentsService.listAssignment(filteration).subscribe(data => {
        data?.data?.forEach((assignment: any) => {
          this.assignmentsIsExport.push({
            id: assignment.id,
            status: assignment.status,
            orderNumber: assignment.employee.employeeNumber,
            employeeCode:assignment.code,
            employeeName: {
              name: assignment.employee.name,
              alt: assignment.employee.name,
              img: assignment.employee.profileImagePath ? assignment.employee.profileImagePath : "../../../../assets/img/5034901-200.png"
            },
            assignmentTime:moment(new Date(assignment.dateFrom)).format("hh:mm:ss a"),
  
            assignmentTypeName: assignment.assignmentTypeName,
            statusName: assignment.statusName,
            dateFrom: moment(new Date(assignment.dateFrom)).format("MM/DD/YYYY"),
            dateTo: moment(new Date(assignment.dateTo)).format("MM/DD/YYYY"),
          })
        });
        let formatTable = this.assignmentsIsExport.map(assignment => {
      
          return {
            employeeCode:assignment.employeeCode,
            orderNumber: assignment.orderNumber,
            employeeName: assignment.employeeName.name,
            assignmentTypeName: assignment.assignmentTypeName,
            dateFrom: assignment.dateFrom,
            dateTo: assignment.dateTo,
            statusName: assignment.statusName
    
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
      let table: any = document.getElementById("tableAssignmentHidden");
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
    this.getAssignments(this.filteration);
  }
  getInformation() {
    this.spinnerCards = true;
    this.assignmentsService.getInformation().subscribe({
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
  getAssignments(filteration: any) {
    this.assignments = [];
    this.isLoading = true;

    this.assignmentsService.listAssignment(filteration).subscribe(data => {
      data?.data?.forEach((assignment: any) => {
        this.assignments.push({
          id: assignment.id,
          status: assignment.status,
          orderNumber: assignment.employee.employeeNumber,
          employeeCode:assignment.code,
          employeeName: {
            name: assignment.employee.name,
            alt: assignment.employee.name,
            img: assignment.employee.profileImagePath ? assignment.employee.profileImagePath : "../../../../assets/img/5034901-200.png"
          },
          assignmentTime:moment(new Date(assignment.dateFrom)).format("hh:mm:ss a"),

          assignmentTypeName: assignment.assignmentTypeName,
          statusName: assignment.statusName,
          dateFrom: moment(new Date(assignment.dateFrom)).format("MM/DD/YYYY"),
          dateTo: moment(new Date(assignment.dateTo)).format("MM/DD/YYYY"),
        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;


    })
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {

    this.filteration = { ...this.filteration, PageSize: data.value.code };

    this.getAssignments(this.filteration)
  }
  sendRequest(data: any) {

    this.assignmentsService.accept({ requestId: data.id }).subscribe(
      {
        next: res => {
          this.getAssignments(this.filteration);
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
    let reasonOfRefuseDialog!:MatDialogRef<DialogCloseComponent, any>;
    this.translate.get("justifications").subscribe(translate => {
      reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
        width: "30vw",
        data: {
          title: translate.areYouSureTheRequestWillBeRejected,
          message: translate.pleaseExplainWhyIfPossible,
          titleReasonOfRefuse:translate.theReasonOfRefuse,
          placeholdeReasonOfRefuse: translate.pleaseWriteTheReasonForRejection,
          titleClose:translate.toRetreat,
          buttonSend: translate.rejectionOfTheApplication
        },
      });
    });


    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      reasonOfRefuseDialog.componentInstance.submitted = false;


      this.assignmentsService.rejectAssignment({ id: data.id, rejectReason: result.notes }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getAssignments(this.filteration);
            reasonOfRefuseDialog.close();
          },
          error: err => {
            reasonOfRefuseDialog.componentInstance.submitted = true;

          }
        }
      )
    })
  }
  requestAssignment() {
    let dialogRefAddCurrency!:MatDialogRef<AssignmentRequestComponent, any>;
    this.translate.get("assignments").subscribe(translate => {
     dialogRefAddCurrency = this.dialog.open(AssignmentRequestComponent, {
        width: "50vw",
        data: {
          title: translate.assignmentRequest,
          setAsNecessary: translate.setAsEssential,
          titleAssignmentTypeId: translate.typeOfAssignment+" <span class='color-red'>*</span>",
          placeholderAssignmentTypeId: translate.pleaseSelectTheTypeOfAssignment,
          AssignmentTypeIdValidation: translate.assignmentTypeRequired,
          titleCalendar: translate.assignmentDate+" <span class='color-red'>*</span>",
          placeholderCalendar: translate.assignmentDate,
          titleNotes: translate.notes+" <span class='color-red'>*</span>",
          placeholdeNotes: translate.notes,
          NotesValidation: translate.notesRequired,
          dateTaskValidation: translate.assignmentDateRequired,
          labelRadioButton: translate.applicant,
          firstRadio: translate.forMyself,
          secondRadio: translate.toAnEmployee,
          titleEmployeeId: translate.employee+" <span class='color-red'>*</span>",
          placeholderEmployeeId: translate.employee,
          EmployeeIdValidation: translate.employeeRequired,
          uploadFile: translate.attachAFile,
          chooseLabel: translate.selectTheFileToUpload,
          buttonSend: translate.sendRequest
        },
      });
    });

    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editAssignment = false;

    // dialogRefAddCurrency.componentInstance.list = this.categories;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = new FormData();
      if (result.ForEmployee) {
        formData.append("CreateRequestAssignmentModelString", JSON.stringify({
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          EmployeeId: result.EmployeeId.key,
          AssignmentTypeId: result.AssignmentTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM-DD-YYYY") + " " + moment(new Date(result.time)).format("HH:mm:ss"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM-DD-YYYY") + " " + moment(new Date(result.time)).format("HH:mm:ss"),
          Notes: result.Notes
        }));

      } else {
        formData.append("CreateRequestAssignmentModelString", JSON.stringify({
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          AssignmentTypeId: result.AssignmentTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM-DD-YYYY") + " " + moment(new Date(result.time)).format("HH:mm:ss"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM-DD-YYYY") + " " + moment(new Date(result.time)).format("HH:mm:ss"),
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
      this.assignmentsService.createAssignment(formData).subscribe(
        {
          next: (data: any) => {


            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;

            dialogRefAddCurrency.close();
            let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
            this.translate.get("assignments").subscribe(translate => {
              succressDialog = this.dialog.open(ToastSuccessComponent, {
                width: "30vw",
                data: {
                  title: translate.yourRequestHasBeenSent,
                  message: data.message,
                  buttonSend: translate.assignmentRequests
  
                },
              });
            });
  
            this.getAssignments(this.filteration);

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
  editAssignment(data: any) {
    let dialogRefAddCurrency!:MatDialogRef<AssignmentRequestComponent, any>;
    this.translate.get("assignments").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(AssignmentRequestComponent, {
        width: "50vw",
        data: {
          title: translate.amendmentAssignment,
          setAsNecessary: translate.setAsEssential,
          titleAssignmentTypeId: translate.typeOfAssignment+" <span class='color-red'>*</span>",
          placeholderAssignmentTypeId: translate.pleaseSelectTheTypeOfAssignment,
          AssignmentTypeIdValidation: translate.assignmentTypeRequired,
          titleCalendar: translate.assignmentDate+" <span class='color-red'>*</span>",
          placeholderCalendar: translate.assignmentDate,
          titleNotes: translate.notes+" <span class='color-red'>*</span>",
          placeholdeNotes: translate.notes,
          NotesValidation: translate.notesRequired,
          dateTaskValidation: translate.assignmentDateRequired,
          labelRadioButton: translate.applicant,
          firstRadio: translate.forMyself,
          secondRadio: translate.toAnEmployee,
          titleEmployeeId: translate.employee+" <span class='color-red'>*</span>",
          placeholderEmployeeId: translate.employee,
          EmployeeIdValidation: translate.employeeRequired,
          uploadFile: translate.attachAFile,
          chooseLabel: translate.selectTheFileToUpload,
          buttonSend: translate.sendRequest
        },
      });
    });

    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editAssignment = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = new FormData();
      if (result.ForEmployee) {
        formData.append("UpdateRequestAssignmentModelString", JSON.stringify({
          id: data.id,
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          EmployeeId: result.EmployeeId.key,
          AssignmentTypeId: result.AssignmentTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM-DD-YYYY") + " " + moment(new Date(result.time)).format("HH:mm:ss"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM-DD-YYYY") + " " + moment(new Date(result.time)).format("HH:mm:ss"),
          Notes: result.Notes
        }));

      } else {
        formData.append("UpdateRequestAssignmentModelString", JSON.stringify({
          id: data.id,
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          AssignmentTypeId: result.AssignmentTypeId.key,
          DateFrom: moment(new Date(result.dateTask[0])).format("MM-DD-YYYY") + " " + moment(new Date(result.time)).format("HH:mm:ss"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM-DD-YYYY") + " " + moment(new Date(result.time)).format("HH:mm:ss"),
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

      this.assignmentsService.updateAssignment(formData).subscribe(
        {
          next: (data: any) => {
            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;
            dialogRefAddCurrency.close();
            let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
            this.translate.get("assignments").subscribe(translate => {
              succressDialog = this.dialog.open(ToastSuccessComponent, {
                width: "30vw",
                data: {
                  title: translate.yourRequestHasBeenSent,
                  message: data.message,
                  buttonSend: translate.assignmentRequests
  
                },
              });
            });
            this.getAssignments(this.filteration);

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

  dialogAssignmentFile(data: any) {
    let dialogRefAddCurrency!:MatDialogRef<DialogAssignementFileComponent, any>;
    this.translate.get("assignments").subscribe(translate => {
       dialogRefAddCurrency = this.dialog.open(DialogAssignementFileComponent, {
        width: "60vw",
        data: {
          title: translate.assignmentFile
        },
      });
    });
  
    dialogRefAddCurrency.componentInstance.id = data.id

  }


  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getAssignments(this.filteration)
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
