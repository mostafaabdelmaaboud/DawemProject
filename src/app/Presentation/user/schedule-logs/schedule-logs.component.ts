import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ScheduleLogsService } from './services/schedule-logs.service';
import { DialogScheduleLogFileComponent } from 'src/app/shared/components/dialog-schedule-log-file/dialog-schedule-log-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-schedule-logs',
  templateUrl: './schedule-logs.component.html',
  styleUrls: ['./schedule-logs.component.scss']
})
export class ScheduleLogsComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  private scheduleLogsService = inject(ScheduleLogsService);
  destroy$: Subject<boolean> = new Subject<boolean>();


  columns: any[] = [
    {
      name: "اسم الدوام",
      field: "scheduleName",
    },
    {
      name: "النوع المطبق عليه",
      field: "schedulePlanTypeName",
    },
    {
      name: "تاريخ التطبيق",
      field: "applyDate"
    },
    {
      name: "عدد الموظفين المطبق عليهم",
      field: "employeesNumberAppliedOn"
    },
    {
      name: "الاجراءات",
      field: "actions"
    }

  ];
  schedules: any = [];
  schedulesIsExport: any = [];
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
  defaultRowPerPage = { name: '5', code: 5 };

  private _mobileQueryListener: () => void;
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.schedules = this.schedules;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.schedules = this.schedules;

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
      FreeText: [""]

    });
    this.categories.push({ name: "adasd", key: "adsas" });
    this.RowsPerPage = [
      { name: '2', code: 2 },
      { name: '5', code: 5 }
    ];
    this.translate.get("scheduleLogs").subscribe(data => {
      this.columns = [
        {
          name: data.domName,
          field: "scheduleName",
        },
        {
          name: data.theTypeAppliedToIt,
          field: "schedulePlanTypeName",
        },
        {
          name: data.applicationHistory,
          field: "applyDate"
        },
        {
          name: data.numberOfEmployeesApplicableToThem,
          field: "employeesNumberAppliedOn"
        },
        {
          name: data.actions,
          field: "actions"
        }
    
      ];
    })
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(dataParent => {
      this.translate.get("scheduleLogs").subscribe(data => {
        this.columns = [
          {
            name: data.domName,
            field: "scheduleName",
          },
          {
            name: data.theTypeAppliedToIt,
            field: "schedulePlanTypeName",
          },
          {
            name: data.applicationHistory,
            field: "applyDate"
          },
          {
            name: data.numberOfEmployeesApplicableToThem,
            field: "employeesNumberAppliedOn"
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
    this.getSchedules(this.filteration);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  getSchedules(filteration: any) {
    this.schedules = [];
    this.isLoading = true;
    this.scheduleLogsService.listSchedules(filteration).subscribe(data => {

      data.data.forEach((schedule: any) => {
        this.schedules.push({
          id: schedule.id,
          scheduleName: schedule.scheduleName ? schedule.scheduleName : "لا يوجد",
          schedulePlanTypeName: schedule.schedulePlanTypeName ? schedule.schedulePlanTypeName : "لا يوجد",
          applyDate: schedule.applyDate ? moment(new Date(schedule.applyDate)).format("MM/DD/YYYY") : "لا يوجد",
          employeesNumberAppliedOn: schedule.employeesNumberAppliedOn ? schedule.employeesNumberAppliedOn : "لا يوجد",


        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;

    })
  }
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: Number(this.id), actionCode: data.actionCode })
  }
  dialogScheduleFile(data: any) {
    let dialogRefAddCurrency!:MatDialogRef<DialogScheduleLogFileComponent, any>;
    this.translate.get("vacationBalance").subscribe(translate => {
     dialogRefAddCurrency = this.dialog.open(DialogScheduleLogFileComponent, {
        width: "90vw",
        data: {
          title: translate.tableFile
        },
      });
    })
   
    dialogRefAddCurrency.componentInstance.id = data.id
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
    this.getSchedules(this.filteration);
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
      title: 'سجلات خطط الجدولة',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };
    if(!this.isLoading) {
      this.isLoading = true;
      let filteration = {...this.filteration, isExport:true};
      this.scheduleLogsService.listSchedules(filteration).subscribe(data => {
        this.schedulesIsExport = [];

        data.data.forEach((schedule: any) => {
          this.schedulesIsExport.push({
            id: schedule.id,
            scheduleName: schedule.scheduleName ? schedule.scheduleName : "لا يوجد",
            schedulePlanTypeName: schedule.schedulePlanTypeName ? schedule.schedulePlanTypeName : "لا يوجد",
            applyDate: schedule.applyDate ? moment(new Date(schedule.applyDate)).format("MM/DD/YYYY") : "لا يوجد",
            employeesNumberAppliedOn: schedule.employeesNumberAppliedOn ? schedule.employeesNumberAppliedOn : "لا يوجد",
          })
        });
        let formatTable = this.schedulesIsExport.map(schedule => {
          return {
            scheduleName: schedule.scheduleName,
            schedulePlanTypeName: schedule.schedulePlanTypeName,
            applyDate: schedule.applyDate,
            employeesNumberAppliedOn: schedule.employeesNumberAppliedOn
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
      let table: any = document.getElementById("tableshiftHidden");
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

    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getSchedules(this.filteration);
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getSchedules(this.filteration)
  }

  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getSchedules(this.filteration)
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
