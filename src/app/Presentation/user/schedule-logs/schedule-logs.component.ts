import { ChangeDetectorRef, Component, Inject, LOCALE_ID, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';

import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DialogScheduleFileComponent } from 'src/app/shared/components/dialog-schedule-file/dialog-schedule-file.component';
import { ScheduleLogsService } from './services/schedule-logs.service';
import { DialogScheduleLogFileComponent } from 'src/app/shared/components/dialog-schedule-log-file/dialog-schedule-log-file.component';

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


  columns: any[] = [
    {
      name: "اسم الدوم",
      field: "scheduleName",
    },
    {
      name: "النوع الطبق عليه",
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

  private _mobileQueryListener: () => void;
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService) {
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

  dialogScheduleFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogScheduleLogFileComponent, {
      width: "90vw",
      data: {
        title: "ملف الجدول"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id
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
}
