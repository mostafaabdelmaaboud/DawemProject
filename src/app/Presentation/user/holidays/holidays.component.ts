import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteShiftComponent } from 'src/app/shared/components/delete-shift/delete-shift.component';
import { AddAholidayComponent } from 'src/app/shared/components/add-aholiday/add-aholiday.component';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { DialogHolidayFileComponent } from 'src/app/shared/components/dialog-holiday-file/dialog-holiday-file.component';
import { HolidaysService } from './services/holidays.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss']
})
export class HolidaysComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  defaultRowPerPage = { name: '5', code: 5 };
  destroy$: Subject<boolean> = new Subject<boolean>();

  columns: any[] = [
    {
      name: "الكود",
      field: "code",
    },
    {
      name: "الاسم",
      field: "name",
    },
    {
      name: "نوع العطلة",
      field: "dateType"
    },
    {
      name: "تاريخ البداية",
      field: "startDate"
    },
    {
      name: "تاريخ النهاية",
      field: "endDate"
    },
    {
      name: "الإجراء",
      field: "actions"
    }
  ];
  holidays: any = [];
  holidaysIsExport: any = [];
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
  private holidaysService = inject(HolidaysService);
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

  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private toast: ToastrService, public translate: TranslateService, private fb: FormBuilder,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.holidays = this.holidays;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.holidays = this.holidays;

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
    this.translate.get("holidays").subscribe(data => {
      this.columns = [
        {
          name: data.code,
          field: "code",
        },
        {
          name: data.theName,
          field: "name",
        },
        {
          name: data.holidayType,
          field: "dateType"
        },
        {
          name: data.startDate,
          field: "startDate"
        },
        {
          name: data.expiryDate,
          field: "endDate"
        },
        {
          name: data.action,
          field: "actions"
        }
      ];
    })
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(dataParent => {
      this.translate.get("holidays").subscribe(data => {
        this.columns = [
          {
            name: data.code,
            field: "code",
          },
          {
            name: data.theName,
            field: "name",
          },
          {
            name: data.holidayType,
            field: "dateType"
          },
          {
            name: data.startDate,
            field: "startDate"
          },
          {
            name: data.expiryDate,
            field: "endDate"
          },
          {
            name: data.action,
            field: "actions"
          }
        ];
      })
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

    this.getHolidays(this.filteration)

  }
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 15, actionCode: data.actionCode })
  }
  getInformation() {
    this.spinnerCards = true;
    this.holidaysService.getInformation().subscribe({
      next: data => {
        ;
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
  getHolidays(filteration: any) {
    this.holidays = [];
    this.isLoading = true;
    this.holidaysService.listHolidays(filteration).subscribe(data => {
      data.data.forEach((holiday: any) => {
        this.holidays.push({
          id: holiday.id,
          code: holiday.code,
          name: holiday.name,
          isActive: holiday.isActive,
          dateType: holiday.dateType,
          startDate: holiday.startDate,
          endDate: holiday.endDate,
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

    this.getHolidays(this.filteration)
  }
  addholiday() {
    let dialogRefAddCurrency!:MatDialogRef<AddAholidayComponent, any>;
    this.translate.get("holidays").subscribe(translate => {
     dialogRefAddCurrency = this.dialog.open(AddAholidayComponent, {
        width: "50vw",
        data: {
          title: translate.addHoliday,
          titleHolidayName: translate.holidayName +" <span class='color-red'>*</span>",
          placeholdeHolidayName: translate.holidayName,
          labelRadioButtonFirst: translate.holidayByCalendar,
          firstRadio: translate.hijri,
          secondRadio: translate.gregorian,
          setAsActive: translate.setAsActive,
          validationtitleHolidayName: translate.holidayNameIsRequired,
          validationCalendarFirst: translate.startDateRequired,
          validationCalendarSecond: translate.endDateRequired,
          validationtitleNotes: translate.notesRequired,
          titleCalendarFirst: translate.startDate+" <span class='color-red'>*</span>",
          placeholderCalendarFirst: translate.chooseStartDate,
          titleCalendarSecond: translate.expiryDate+" <span class='color-red'>*</span>",
          placeholderCalendarSecond: translate.chooseEndDate,
          titleNotes: translate.comments+" <span class='color-red'>*</span>",
          placeholdeNotes: translate.pleaseWriteNotesHere,
          buttonSend: translate.addVacation,
          titleClose: translate.toRetreat
        },
      });
    });
    
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editHoliday = false;


    // dialogRefAddCurrency.componentInstance.list = this.categories;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      ;
      formData.name = result.name;
      formData.isActive = result.isActive;
      formData.dateType = Number(result.dateType);
      formData.startDate = moment(result.startDate).format("YYYY-MM-DD");
      formData.endDate = moment(result.endDate).format("YYYY-MM-DD");
      formData.notes = result.notes;
      formData.isSpecifiedByYear = Array.isArray(result.isSpecifiedByYear) ? result.isSpecifiedByYear[0] : result.isSpecifiedByYear;

      dialogRefAddCurrency.componentInstance.submitted = false;
      dialogRefAddCurrency.componentInstance.loading = true;

      ;
      this.holidaysService.createHoliday(formData).subscribe(
        {
          next: (data: any) => {


            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;

            dialogRefAddCurrency.close();
            let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
            this.translate.get("holidays").subscribe(translate => {
              succressDialog = this.dialog.open(ToastSuccessComponent, {
                width: "30vw",
                data: {
                  title: translate.yourRequestHasBeenSent,
                  message: data.message,
                  buttonSend: translate.holidayRequests
  
                },
              });
            });
    
            this.getHolidays(this.filteration);

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
  editHoliday(data: any) {
    let dialogRefAddCurrency!:MatDialogRef<AddAholidayComponent, any>;
    this.translate.get("holidays").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(AddAholidayComponent, {
        width: "50vw",
        data: {
          title: translate.modifyHoliday,
          titleHolidayName: translate.holidayName +" <span class='color-red'>*</span>",
          placeholdeHolidayName: translate.holidayName,
          labelRadioButtonFirst: translate.holidayByCalendar,
          firstRadio: translate.hijri,
          secondRadio: translate.gregorian,
          setAsActive: translate.setAsActive,
          validationtitleHolidayName: translate.holidayNameIsRequired,
          validationCalendarFirst: translate.startDateRequired,
          validationCalendarSecond: translate.endDateRequired,
          validationtitleNotes: translate.notesRequired,
          titleCalendarFirst: translate.startDate+" <span class='color-red'>*</span>",
          placeholderCalendarFirst: translate.chooseStartDate,
          titleCalendarSecond: translate.expiryDate+" <span class='color-red'>*</span>",
          placeholderCalendarSecond: translate.chooseEndDate,
          titleNotes: translate.comments+" <span class='color-red'>*</span>",
          placeholdeNotes: translate.pleaseWriteNotesHere,
          buttonSend: translate.saveTheHoliday,
          titleClose: translate.toRetreat
        },
      });
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editHoliday = true;
    dialogRefAddCurrency.componentInstance.id = data.id;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      formData.id = data.id;
      formData.name = result.name;
      formData.isActive = result.isActive;
      formData.dateType = Number(result.dateType);
      formData.startDate = moment(result.startDate).format("YYYY-MM-DD");
      formData.endDate = moment(result.endDate).format("YYYY-MM-DD");
      formData.notes = result.notes;
      formData.isSpecifiedByYear = Array.isArray(result.isSpecifiedByYear) ? result.isSpecifiedByYear[0] : result.isSpecifiedByYear;
      dialogRefAddCurrency.componentInstance.submitted = false;
      dialogRefAddCurrency.componentInstance.loading = true;
      this.holidaysService.updateHoliday(formData).subscribe(
        {
          next: (data: any) => {
            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;
            dialogRefAddCurrency.close();
            let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
            this.translate.get("holidays").subscribe(translate => {
              succressDialog = this.dialog.open(ToastSuccessComponent, {
                width: "30vw",
                data: {
                  title: translate.yourRequestHasBeenSent,
                  message: data.message,
                  buttonSend: translate.holidayRequests
                },
              });
            });
            this.getHolidays(this.filteration);

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
  filter() {
    let filteration = { ...this.filteration }
    Object.entries(this.filterForm?.value).forEach(([key, value]: any) => {
      if (typeof value  === 'string') {
        if(value != "") {
          filteration[key] = value.trim();
        }
      } else {
        if(value >=0) {
          filteration[key] = value;

        }

      }
    })
    this.getHolidays(filteration);
  }
  exportTableToExcel() {
    let columns = [...this.columns];
    delete columns[5]
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'العطلات الرسمية',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };

    if(!this.isLoading) {
      this.isLoading = true;
      this.holidaysIsExport = [];
      let filteration = {...this.filteration, isExport:true};

      this.holidaysService.listHolidays(filteration).subscribe(data => {
        data.data.forEach((holiday: any) => {
          this.holidaysIsExport.push({
            id: holiday.id,
            code: holiday.code,
            name: holiday.name,
            isActive: holiday.isActive,
            dateType: holiday.dateType,
            startDate: holiday.startDate,
            endDate: holiday.endDate,
          })
        });
        let formatTable = this.holidaysIsExport.map(holiday => {
      
          return {
            code: holiday.code,
            name: holiday.name,
            dateType: holiday.dateType,
            startDate: holiday.startDate,
            endDate: holiday.endDate
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
      let table: any = document.getElementById("tableHolidaysHidden");
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
    this.getHolidays(this.filteration);
  }

  enabledRow(data: any) {

    this.holidaysService.enabledHoliday({ HolidayId: data.id }).subscribe(
      {
        next: res => {

          this.toast.success(res.message);
          this.getHolidays(this.filteration);
        },
        error: err => {

        }
      }
    )
  }
  reasonOfRefuse(data: any) {
    let reasonOfRefuseDialog!:MatDialogRef<DialogCloseComponent, any>;
    this.translate.get("holidays").subscribe(translate => {
      reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
        width: "40vw",
        data: {
          title: translate.areYouSureYoureOnHoldForVacation,
          message: translate.pleaseExplainTheReasonIfPossible,
          titleReasonOfRefuse: translate.reasonForComment,
          placeholdeReasonOfRefuse: translate.pleaseWriteTheReasonForRejection,
          titleClose: translate.toRetreat,
          buttonSend: translate.accountSuspension
        },
      });
    });

    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      this.holidaysService.disableHoliday({ id: data.id, disableReason: result.notes }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getHolidays(this.filteration);
            reasonOfRefuseDialog.close();
          },
          error: err => {
            reasonOfRefuseDialog.componentInstance.submitted = true;

          }
        }
      )

    })
  }
  dialogHolidayFile(data: any) {
    let dialogRefAddCurrency!:MatDialogRef<DialogHolidayFileComponent, any>;
    this.translate.get("holidays").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(DialogHolidayFileComponent, {
        width: "40vw",
        data: {
          title: translate.vacationFile
        },
      });
    });
    dialogRefAddCurrency.componentInstance.id = data.id
  }

  deleteRow() {
    let reasonOfRefuseDialog!:MatDialogRef<DeleteShiftComponent, any>;
    this.translate.get("holidays").subscribe(translate => {
      reasonOfRefuseDialog = this.dialog.open(DeleteShiftComponent, {
        width: "30vw",
        data: {
          title: translate.areYouSureToDeleteTheVacation,
          message: translate.thereIsNoGoingBackOnThisMatter,
          titleClose: translate.toRetreat,
          buttonSend: translate.delete
        },
      });
    });

    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.close();

    })
  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getHolidays(this.filteration)
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
