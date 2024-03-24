import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DialogScheduleLogFileComponent } from 'src/app/shared/components/dialog-schedule-log-file/dialog-schedule-log-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { ReportsService } from './services/reports.service';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  private reportsService = inject(ReportsService);
  destroy$: Subject<boolean> = new Subject<boolean>();
  loadingFilteration = false;
  @ViewChild('op') op!: OverlayPanel;
  maxDate = new Date();
  columns: any[] = [
    {
      name: "الرقم الوظيفي",
      field: "employeeNumber",
    },
    {
      name: "إسم الموظف",
      field: "employeeName",
    },
    {
      name: "الحضور الإفتراضي",
      field: "shouldAttendCount"
    },
    {
      name: "الحضور الفعلي",
      field: "actualAttendCount"
    },
    {
      name: "الأجازات",
      field: "vacationsCount"
    },
    {
      name: "الغياب",
      field: "absencesCount"
    },
    {
      name: "وقت العمل",
      field: "workingHoursCount"
    },
    {
      name: "التأخير",
      field: "lateArrivalsCount"
    },
    {
      name:"المغادرة مبكرا",
      field: "earlyDeparturesCount"
    },
    {
      name:"الوقت الإضافي",
      field: "overTimeCount"
    }
  ];
  listEmployees: any[] = [];

  reports: any = [];
  reportsIsExport: any = [];
  isLoading = true;
  dateTaskMultiple = false;

  filteration: any = {
    PageSize: 5,
    PageNumber: 0,
    DateFrom:"10-18-2023",
    DateTo:"12-12-2023",
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
        this.reports = this.reports;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.reports = this.reports;

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
    if (this.mobileQuery.matches) {
      this.opened = true;
    } else {
      this.opened = false;

    }
    this.filterForm = this.fb.group({
      FreeText: [""],
      searchDate:[null, Validators.required],
      EmployeesIds:[]
    });
    this.categories.push({ name: "adasd", key: "adsas" });
    this.RowsPerPage = [
      { name: '2', code: 2 },
      { name: '5', code: 5 }
    ];

    this.getreports(this.filteration);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  getreports(filteration: any) {
    this.reports = [];
    this.isLoading = true;
    this.reportsService.listReports(filteration).subscribe({
      next:data => {

        data.data.forEach((report: any) => {
          this.reports.push({
            id: report.employeeId,
            employeeNumber: report.employeeNumber ? report.employeeNumber : "لا يوجد",
            employeeName: report.employeeName ? report.employeeName : "لا يوجد",
            shouldAttendCount: report.shouldAttendCount ? report.shouldAttendCount : "لا يوجد",
            actualAttendCount: report.actualAttendCount ? report.actualAttendCount : "لا يوجد",
            vacationsCount: report.vacationsCount ? report.vacationsCount : "لا يوجد",
            absencesCount: report.absencesCount ? report.absencesCount : "لا يوجد",
            workingHoursCount: report.workingHoursCount ? report.workingHoursCount : "لا يوجد",
            lateArrivalsCount: report.lateArrivalsCount ? report.lateArrivalsCount : "لا يوجد",
            earlyDeparturesCount: report.earlyDeparturesCount ? report.earlyDeparturesCount : "لا يوجد",
            overTimeCount: report.overTimeCount ? report.overTimeCount : "لا يوجد",
  
  
          })
        });
        this.totalItems = data.totalCount
        this.isLoading = false;
  
      },
      error:err => {
        this.isLoading = false;

      }
    }
      )
  }
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 31, actionCode: data.actionCode })
  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {
    switch (type) {
      case 'employeesIds':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.reportsService.EmployeesDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listEmployees = [];
                res?.data?.forEach((employee: any) => {
                  this.listEmployees.push({ name: employee.name, key: employee.id })
                });
              });
          }

        }
        break;
      default:
        break;
    }
  }
  openFilter() {
    if(!this.loadingFilteration) {
      this.loadingFilteration = true;
      this.reportsService.EmployeesDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe({
        next:data => {
          data?.forEach((employee: any) => {
            this.listEmployees.push({ name: employee.name, key: employee.id });
          });
          this.loadingFilteration = false;
        },
        error:err => {
          this.loadingFilteration = false;
        }
      });
    }
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
    if (this.filterForm.value.searchDate != null) {
      if (this.filterForm.value.searchDate[1] === null) {
        this.dateTaskMultiple = true;
      } else {
        this.dateTaskMultiple = false;
        this.filteration.DateFrom = moment(this.filterForm.value.searchDate[0]).format("MM-DD-YYYY");
        this.filteration.DateTo = moment(this.filterForm.value.searchDate[1]).format("MM-DD-YYYY");
        
      }
    }
    if (this.filterForm.valid && !this.dateTaskMultiple) {
      Object.entries(this.filterForm?.value).forEach(([key, value]: any) => {
        if (typeof value  === 'string') {
          if(value != "") {
            if(key !="searchDate") {
              this.filteration[key] = value.trim();
            }
          }
        } else {
            if(key !="searchDate" && key !="EmployeesIds") {
              this.filteration[key] = value;
            } else if(key ==="EmployeesIds") {
              this.filteration[key] = value.map(item => item.key);

            }
        }
      });
      delete this.filteration.PageNumber;
      this.getreports(this.filteration);
      this.op.hide();

    } else {
      // this.getControl("JustificationTypeId")?.markAsDirty();
      this.getControl("searchDate")?.markAsDirty();
      // this.getControl("time")?.markAsDirty();

      
      // this.getControl("Notes")?.markAsDirty();
    }

   
  }
  getControl(controlName: string) {
    return this.filterForm?.get(controlName);
  }
  exportTableToExcel() {
    let columns = [...this.columns];
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'تقرير ملخص الحضور',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };
    if(!this.isLoading) {
      this.isLoading = true;
      this.reportsIsExport = [];
      let filteration = {...this.filteration, isExport:true};
      this.reportsService.listReports(filteration).subscribe(data => {
        data.data.forEach((report: any) => {
          this.reportsIsExport.push({
            id: report.employeeId,
            employeeNumber: report.employeeNumber ? report.employeeNumber : "لا يوجد",
            employeeName: report.employeeName ? report.employeeName : "لا يوجد",
            shouldAttendCount: report.shouldAttendCount ? report.shouldAttendCount : "لا يوجد",
            actualAttendCount: report.actualAttendCount ? report.actualAttendCount : "لا يوجد",
            vacationsCount: report.vacationsCount ? report.vacationsCount : "لا يوجد",
            absencesCount: report.absencesCount ? report.absencesCount : "لا يوجد",
            workingHoursCount: report.workingHoursCount ? report.workingHoursCount : "لا يوجد",
            lateArrivalsCount: report.lateArrivalsCount ? report.lateArrivalsCount : "لا يوجد",
            earlyDeparturesCount: report.earlyDeparturesCount ? report.earlyDeparturesCount : "لا يوجد",
            overTimeCount: report.overTimeCount ? report.overTimeCount : "لا يوجد",
  
  
          })
        });
        let formatTable = this.reportsIsExport.map(report => {
          return {
            employeeNumber: report.employeeNumber ? report.employeeNumber : "لا يوجد",
            employeeName: report.employeeName ? report.employeeName : "لا يوجد",
            shouldAttendCount: report.shouldAttendCount ? report.shouldAttendCount : "لا يوجد",
            actualAttendCount: report.actualAttendCount ? report.actualAttendCount : "لا يوجد",
            vacationsCount: report.vacationsCount ? report.vacationsCount : "لا يوجد",
            absencesCount: report.absencesCount ? report.absencesCount : "لا يوجد",
            workingHoursCount: report.workingHoursCount ? report.workingHoursCount : "لا يوجد",
            lateArrivalsCount: report.lateArrivalsCount ? report.lateArrivalsCount : "لا يوجد",
            earlyDeparturesCount: report.earlyDeparturesCount ? report.earlyDeparturesCount : "لا يوجد",
            overTimeCount: report.overTimeCount ? report.overTimeCount : "لا يوجد",
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
      let table: any = document.getElementById("tableReportHidden");
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
    this.getreports(this.filteration);
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getreports(this.filteration)
  }

  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getreports(this.filteration)
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
