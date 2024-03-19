import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SchedualPlanService } from './services/schedual-plan.service';
import { AddSchedualPlanComponent } from 'src/app/shared/components/add-schedual-plan/add-schedual-plan.component';
import { DialogSchedulePlanFileComponent } from 'src/app/shared/components/dialog-schedule-plan-file/dialog-schedule-plan-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';

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
  destroy$: Subject<boolean> = new Subject<boolean>();


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
  schedualPlanIsExport: any = [];
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
  defaultRowPerPage = { name: '5', code: 5 };

  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
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
      this.date = new Date();

    });
  }
  ngOnInit(): void {
    this.translate.get("schedualPlan").subscribe(data => {
      this.columns = [
        {
          name: data.scheduleNumber,
          field: "code",
        },
        {
          name: data.scheduleName,
          field: "scheduleName",
        },
        {
          name: data.scheduleType,
          field: "schedulePlanTypeName"
        },
        {
          name: data.theDate,
          field: "dateFrom"
        },
    
        {
          name: data.actions,
          field: "actions"
        }
    
      ];
    })
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(dataParent => {
      this.translate.get("schedualPlan").subscribe(data => {
        this.columns = [
          {
            name: data.scheduleNumber,
            field: "code",
          },
          {
            name: data.scheduleName,
            field: "scheduleName",
          },
          {
            name: data.scheduleType,
            field: "schedulePlanTypeName"
          },
          {
            name: data.theDate,
            field: "dateFrom"
          },
      
          {
            name: data.actions,
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
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 30, actionCode: data.actionCode })
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
    let dialogRefAddCurrency!:MatDialogRef<AddSchedualPlanComponent, any>;
    this.translate.get("schedualPlan").subscribe(translate => {
       dialogRefAddCurrency = this.dialog.open(AddSchedualPlanComponent, {
        width: "70vw",
        data: {
          title: translate.addASchedule,
          setAsActive: translate.setAsActive,
          titleDepartmentId: translate.SectionType,
          placeholdeDepartmentId: translate.departmentName,
          ValidationDepartmentId:translate.partitionTypeRequired,
          titleFieldDisabled:translate.code,
          labelRadioButton: translate.scheduleType,
          firstRadio: translate.toAnEmployee,
          secondRadio: translate.forAGroup,
          thirdRadio: translate.toSwear,
          titleEmployeeId: translate.employeeName,
          placeholdeEmployeeId:  translate.employeeName,
          ValidationEmployeeId: translate.employeeNameRequired,
          titleScheduleId: translate.workSchedule,
          placeholdeScheduleId: translate.workSchedule,
          ValidationScheduleId: translate.WorkScheduleRequired,
          titleCalendar: translate.theDate,
          placeholderCalendar: translate.chooseDate,
          validationCalendar: translate.DateRequired,
          titleGroupId: translate.GroupRepresentatives,
          placeholdeGroupId: translate.groupName,
          ValidationGroupId: translate.groupNameRequired,
          titleNotes: translate.notes+" <span class='color-red'>*</span>",
          placeholdeNotes: translate.notes,
          ValidationNotes: translate.notesRequired,
          titleClose:translate.toRetreat,
          buttonSend: translate.addSchedule
        },
      });
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

    
            let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
            this.translate.get("schedualPlan").subscribe(translate => {
              succressDialog = this.dialog.open(ToastSuccessComponent, {
               width: "30vw",
               data: {
                 title: translate.yourRequestHasBeenSent,
                 message: data.message,
                 buttonSend: translate.schedulingRequests
               },
             });
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
  editSchedualPlane(data: any) {
    let dialogRefAddCurrency!:MatDialogRef<AddSchedualPlanComponent, any>;
    this.translate.get("schedualPlan").subscribe(translate => {
     dialogRefAddCurrency = this.dialog.open(AddSchedualPlanComponent, {
        width: "70vw",
        data: {
          title: translate.modifyScheduling,
          setAsActive: translate.setAsActive,
          titleDepartmentId: translate.SectionType,
          placeholdeDepartmentId: translate.departmentName,
          ValidationDepartmentId:translate.partitionTypeRequired,
          titleFieldDisabled:translate.code,
          labelRadioButton: translate.scheduleType,
          firstRadio: translate.toAnEmployee,
          secondRadio: translate.forAGroup,
          thirdRadio: translate.toSwear,
          titleEmployeeId: translate.employeeName,
          placeholdeEmployeeId:  translate.employeeName,
          ValidationEmployeeId: translate.employeeNameRequired,
          titleScheduleId: translate.workSchedule,
          placeholdeScheduleId: translate.workSchedule,
          ValidationScheduleId: translate.WorkScheduleRequired,
          titleCalendar: translate.theDate,
          placeholderCalendar: translate.chooseDate,
          validationCalendar: translate.DateRequired,
          titleGroupId: translate.GroupRepresentatives,
          placeholdeGroupId: translate.groupName,
          ValidationGroupId: translate.groupNameRequired,
          titleNotes: translate.notes+" <span class='color-red'>*</span>",
          placeholdeNotes: translate.notes,
          ValidationNotes: translate.notesRequired,
          titleClose:translate.toRetreat,
          buttonSend:translate.modifyScheduling
        },
      });
    });
   
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editSchedualPlan = true;

    dialogRefAddCurrency.componentInstance.id = data.id;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};

      formData.id = data.id;

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

            let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
            this.translate.get("schedualPlan").subscribe(translate => {
              succressDialog = this.dialog.open(ToastSuccessComponent, {
               width: "30vw",
               data: {
                 title: translate.yourRequestHasBeenSent,
                 message: data.message,
                 buttonSend: translate.schedulingRequests
               },
             });
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
    let dialogRefAddCurrency!:MatDialogRef<DialogSchedulePlanFileComponent, any>;
    this.translate.get("schedualPlan").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(DialogSchedulePlanFileComponent, {
        width: "40vw",
        data: {
          title: translate.scheduleFile
        },
      });
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
    delete this.filteration.PageNumber;
    this.getGroups(this.filteration);
  }
  exportTableToExcel() {
    let columns = [...this.columns];
    delete columns[4]
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'خطط الجدولة',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };

    if(!this.isLoading) {
      this.isLoading = true;
      this.schedualPlanIsExport = [];
      let filteration = {...this.filteration, isExport:true};
   
      this.schedualPlanService.listSchedualPlan(filteration).subscribe(data => {

        data.data.forEach((schedualPlan: any) => {
  
  
          this.schedualPlanIsExport.push({
            id: schedualPlan.id,
            code: schedualPlan.code,
            scheduleName: schedualPlan.scheduleName,
            schedulePlanTypeName: schedualPlan.schedulePlanTypeName,
            dateFrom: moment(new Date(schedualPlan.dateFrom)).format("MM/DD/YYYY"),
  
            isActive: schedualPlan.isActive
          })
        });
        let formatTable = this.schedualPlanIsExport.map(schedualPlan => {
      
          return {
            code: schedualPlan.code,
            scheduleName: schedualPlan.scheduleName,
            schedulePlanTypeName: schedualPlan.schedulePlanTypeName,
            dateFrom: schedualPlan.dateFrom
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
      let table: any = document.getElementById("tableSchedualPlanHidden");
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
    this.getGroups(this.filteration);
  }
 
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getGroups(this.filteration)
  }


  deleteRow(data: any) {
    let reasonOfRefuseDialog!:MatDialogRef<DialogCloseComponent, any>;
    this.translate.get("schedualPlan").subscribe(translate => {
     reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
        width: "30vw",
        data: {
          title: translate.areYouSureToHangTheGroup,
          message: translate.pleaseExplainTheReason,
          titleReasonOfRefuse: translate.reasonForComment,
          placeholdeReasonOfRefuse: translate.pleaseWriteTheReasonForRejection,
          titleClose: translate.toRetreat,
          buttonSend: translate.groupComment
        },
      });
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
  ngOnDestroy() {
    this.destroy$.next(true);
    this.subscription.unsubscribe();
  }
}
