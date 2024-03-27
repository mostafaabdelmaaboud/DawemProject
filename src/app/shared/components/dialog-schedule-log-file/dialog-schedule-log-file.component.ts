import { SharedModule } from 'src/app/shared/shared.module';
import { ChangeDetectorRef, Component, Inject, Input, LOCALE_ID, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { AssignmentRequestComponent } from 'src/app/shared/components/assignment-request/assignment-request.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';

import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DialogScheduleFileComponent } from 'src/app/shared/components/dialog-schedule-file/dialog-schedule-file.component';
import { CommonModule } from '@angular/common';
import { ScheduleLogsService } from 'src/app/Presentation/user/schedule-logs/services/schedule-logs.service';

@Component({
  selector: 'app-dialog-schedule-log-file',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule,
    
    SharedModule],
  templateUrl: './dialog-schedule-log-file.component.html',
  styleUrls: ['./dialog-schedule-log-file.component.scss']
})
export class DialogScheduleLogFileComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  @Input() id!: any;

  private scheduleLogsService = inject(ScheduleLogsService);


  columns: any[] = [
    {
      name: "إسم الموظف",
      field: "employeeName",
    },
    {
      name: "الدوام القديم",
      field: "oldScheduleName",
    },
    {
      name: "الدوام الجديد",
      field: "newScheduleName"
    },

  ];
  schedules: any = [];

  isLoading = true;
  defaultRowPerPage = { name: '5', code: 5 };

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
  rows: number = 5;
  RowsPerPage!: any[];
  mobileQuery: MediaQueryList;
  opened = false;
  info!: any;
  loading = false;

  private _mobileQueryListener: () => void;
  constructor(
    public dialogRef: MatDialogRef<DialogScheduleLogFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog | null,
    private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, 
    public translate: TranslateService, 
    private fb: FormBuilder, private toast: ToastrService) {
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
      { name: '2', code: 2 },
      { name: '5', code: 5 }

    ];

    if (this.id) {

      this.scheduleLogsService.scheduleGetInfo({ schedulePlanLogId: this.id }).subscribe(
        {
          next: data => {

            this.info = data;
            this.info.applyDate = moment(new Date(data.applyDate)).format("DD/MM/YYYY");
            this.info.scheduleDateFrom = moment(new Date(data.scheduleDateFrom)).format("DD/MM/YYYY");
            this.filteration.SchedulePlanLogId = this.id;
            this.getSchedules(this.filteration);


            this.loading = false;


          }, error: err => {
            this.loading = false;


          }
        }
      )

    }
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.translate.get("scheduleLogs").subscribe(data => {
      this.columns = [
        {
          name: data.employeeName,
          field: "employeeName",
        },
        {
          name: data.oldTime,
          field: "oldScheduleName",
        },
        {
          name: data.newShift,
          field: "newScheduleName"
        },
    
      ];
    })
  }
  close(): void {
    this.dialogRef.close(false);
  }
  getSchedules(filteration: any) {
    this.schedules = [];
    this.isLoading = true;
    this.scheduleLogsService.scheduleLogEmployees(filteration).subscribe(
      {
        next: data => {

          data.employees.forEach((schedule: any) => {
            this.schedules.push({
              id: schedule.id,
              employeeName: schedule.employeeName ? schedule.employeeName : "لا يوجد",
              oldScheduleName: schedule.oldScheduleName ? schedule.oldScheduleName : "لا يوجد",
              newScheduleName: schedule.newScheduleName ? schedule.newScheduleName : "لا يوجد",
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

  dialogScheduleFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogScheduleFileComponent, {
      width: "40vw",
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
