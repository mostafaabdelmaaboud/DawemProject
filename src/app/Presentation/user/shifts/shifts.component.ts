import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { AddShiftComponent } from 'src/app/shared/components/add-shift/add-shift.component';
import { DeleteShiftComponent } from 'src/app/shared/components/delete-shift/delete-shift.component';
import { ShiftsService } from './services/shifts.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DialogShiftFileComponent } from 'src/app/shared/components/dialog-shift-file/dialog-shift-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss']
})
export class ShiftsComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  private shiftsService = inject(ShiftsService);
  destroy$: Subject<boolean> = new Subject<boolean>();

  defaultRowPerPage = { name: '5', code: 5 };

  columns: any[] = [
    {
      name: "رقم الوردية",
      field: "shiftNumber",
    },
    {
      name: "اسم الوردية",
      field: "shiftName",
    },
    {
      name: "وقت الدخول",
      field: "entryTime"
    },
    {
      name: "وقت الخروج",
      field: "timeToGoOut"
    },
    {
      name: "الدقائق المسموحة",
      field: "allowedMinutes"
    },
    {
      name: "موظفين الوردية",
      field: "shiftStaff"
    },
    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  shifts: any = [];
  shiftsIsExport: any = [];
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
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.shifts = this.shifts;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.shifts = this.shifts;

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
    this.translate.get("shifts").subscribe(data => {
      this.columns = [
        {
          name: data.shiftNumber,
          field: "shiftNumber",
        },
        {
          name: data.theNameOfTheRose,
          field: "shiftName",
        },
        {
          name: data.checkInTime,
          field: "entryTime"
        },
        {
          name: data.timeToGoOut,
          field: "timeToGoOut"
        },
        {
          name: data.allowedMinutes,
          field: "allowedMinutes"
        },
        {
          name: data.shiftStaff,
          field: "shiftStaff"
        },
        {
          name: data.actions,
          field: "actions"
        }
      ];
    })
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(dataParent => {
      this.translate.get("shifts").subscribe(data => {
        this.columns = [
          {
            name: data.shiftNumber,
            field: "shiftNumber",
          },
          {
            name: data.theNameOfTheRose,
            field: "shiftName",
          },
          {
            name: data.checkInTime,
            field: "entryTime"
          },
          {
            name: data.timeToGoOut,
            field: "timeToGoOut"
          },
          {
            name: data.allowedMinutes,
            field: "allowedMinutes"
          },
          {
            name: data.shiftStaff,
            field: "shiftStaff"
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


    this.getShifts(this.filteration)
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  filter() {
    // let filteration = { ...this.filteration }
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
    this.getShifts(this.filteration);
  }
  exportTableToExcel() {
    let columns = [...this.columns];
    delete columns[6]
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'الورديات',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };

    if(!this.isLoading) {
      this.isLoading = true;
      this.shiftsIsExport = [];
      let filteration = {...this.filteration, isExport:true};

      this.shiftsService.listShifts(filteration).subscribe(
        {
          next: data => {
  
            data?.data?.forEach((employee: any) => {
  
              this.shiftsIsExport.push({
                id: employee.id,
                shiftNumber: employee.code,
                shiftName: employee.name ? employee.name : "لا يوجد",
                entryTime: employee.checkInTime ? employee.checkInTime : "لا يوجد",
                timeToGoOut: employee.checkOutTime ? employee.checkOutTime : "لا يوجد",
                allowedMinutes: employee.allowedMinutes ? employee.allowedMinutes : "لا يوجد",
                shiftStaff: employee.timePeriod ? employee.timePeriod : "0",
  
              })
            });
            let formatTable = this.shiftsIsExport.map(shift => {
              return {
                shiftNumber: shift.shiftNumber,
                shiftName: shift.shiftName,
                entryTime: shift.entryTime,
                timeToGoOut: shift.timeToGoOut,
                allowedMinutes: shift.allowedMinutes,
                shiftStaff: shift.shiftStaff
              }
            })
            this.isLoading = false;
            new ngxCsv(formatTable, "sheet", options);
  
          },
          error: err => {
            this.isLoading = false;
  
          }
        }
      )
    }  }
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
    this.filterForm.get("code")?.setValue("");

    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getShifts(this.filteration);
  }
  getInformation() {
    this.spinnerCards = true;
    this.shiftsService.getInformation().subscribe({
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
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 32, actionCode: data.actionCode })
  }
  getShifts(filteration: any) {
    this.shifts = [];
    this.isLoading = true;
    this.shiftsService.listShifts(filteration).subscribe(
      {
        next: data => {

          data?.data?.forEach((employee: any) => {

            this.shifts.push({
              id: employee.id,
              shiftNumber: employee.code,
              shiftName: employee.name ? employee.name : "لا يوجد",
              entryTime: employee.checkInTime ? employee.checkInTime : "لا يوجد",
              timeToGoOut: employee.checkOutTime ? employee.checkOutTime : "لا يوجد",
              allowedMinutes: employee.allowedMinutes ? employee.allowedMinutes : "لا يوجد",
              shiftStaff: employee.timePeriod ? employee.timePeriod : "0",

            })
          });
          this.totalItems = data?.totalCount
          this.isLoading = false;

        },
        error: err => {
          this.isLoading = false;

        }
      }
    )
  }
  dialogShiftFile(data: any) {
    let dialogRefAddCurrency!:MatDialogRef<DialogShiftFileComponent, any>;
    this.translate.get("shifts").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(DialogShiftFileComponent, {
        width: "40vw",
        data: {
          title: translate.theRosaryFile
        },
      });
    })
 
    dialogRefAddCurrency.componentInstance.id = data.id
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {

    this.filteration = { ...this.filteration, PageSize: data.value.code };

    this.getShifts(this.filteration)
  }
  addShift() {
    let dialogRefAddCurrency!:MatDialogRef<AddShiftComponent, any>;
    this.translate.get("shifts").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(AddShiftComponent, {
        width: "50vw",
        data: {
          title: translate.pinkAddition,
          titleShift: translate.rosaryName +" <span class='color-red'>*</span>",
          placeholdeShift: translate.rosaryName,
          validationtitleShift: translate.theNameOfTheShiftIsRequired,
          titlePermanentType: translate.permanenceType+" <span class='color-red'>*</span>",
          placeholderPermanentType: translate.chooseTheTypeOfWork,
          validationtitlePermanentType: translate.workTypeRequired,
          entryTime: translate.entryTime+" <span class='color-red'>*</span>",
          validationEntryTime: translate.entryTimeRequired,
          firstRadio: translate.morning,
          secondRadio: translate.evening,
          validationToGoOut: translate.checkoutTimeRequired,
          placeholderEntryTime: translate.checkInTime,
          titletimeToGoOut: translate.timeToGoOut+" <span class='color-red'>*</span>",
          validationtitleExtraMinutes: translate.theAllowedMinutesAreRequired,
          placeholdertimeToGoOut: translate.timeToGoOut,
          extraMinutes: translate.allowedMinutes+" <span class='color-red'>*</span>",
          placeholdeExtraMinutes: translate.numberOfMinutesAllowed,
          titleClose: translate.toRetreat,
          buttonSend: translate.pinkAdd
        },
      });
    });

    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editShift = false;

    // dialogRefAddCurrency.componentInstance.list = this.categories;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {

      let formData = result;
      formData.checkInTime = moment(result.checkInTime).format("HH:mm:ss");
      formData.checkOutTime = moment(result.checkOutTime).format("HH:mm:ss")
      formData.timePeriod = Number(formData.timePeriod);
      formData.isActive = true;

      this.shiftsService.createShift(formData).subscribe(
        {
          next: data => {

            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();
            let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
            this.translate.get("shifts").subscribe(translate => {
              succressDialog = this.dialog.open(ToastSuccessComponent, {
                width: "30vw",
                data: {
                  title: translate.yourRequestHasBeenSent,
                  message: data.message,
                  buttonSend: translate.shifts
                },
              });
            });
      
            this.getShifts(this.filteration);

            setTimeout(() => {
              succressDialog.close();

            }, 2000);

            succressDialog.componentInstance.submitted = true;
            succressDialog.componentInstance.submitClicked.subscribe(result => {


              succressDialog.close();

            })

          },
          error: err => {
            dialogRefAddCurrency.close();

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
  editShift(data: any) {
    let dialogRefAddCurrency!:MatDialogRef<AddShiftComponent, any>;
    this.translate.get("shifts").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(AddShiftComponent, {
        width: "50vw",
        data: {
          title: translate.modifyTheShift,
          titleShift: translate.rosaryName +" <span class='color-red'>*</span>",
          placeholdeShift: translate.rosaryName,
          validationtitleShift: translate.theNameOfTheShiftIsRequired,
          titlePermanentType: translate.permanenceType+" <span class='color-red'>*</span>",
          placeholderPermanentType: translate.chooseTheTypeOfWork,
          validationtitlePermanentType: translate.workTypeRequired,
          entryTime: translate.entryTime+" <span class='color-red'>*</span>",
          validationEntryTime: translate.entryTimeRequired,
          firstRadio: translate.morning,
          secondRadio: translate.evening,
          validationToGoOut: translate.checkoutTimeRequired,
          placeholderEntryTime: translate.checkInTime,
          titletimeToGoOut: translate.timeToGoOut+" <span class='color-red'>*</span>",
          validationtitleExtraMinutes: translate.theAllowedMinutesAreRequired,
          placeholdertimeToGoOut: translate.timeToGoOut,
          extraMinutes: translate.allowedMinutes+" <span class='color-red'>*</span>",
          placeholdeExtraMinutes: translate.numberOfMinutesAllowed,
          code: "#001093",
          titleClose: translate.toRetreat,
          buttonSend: translate.saveTheRosary
        },
      });
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.id = data.id;
    dialogRefAddCurrency.componentInstance.editShift = true;
    // dialogRefAddCurrency.componentInstance.list = this.categories;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = result;
      formData.checkInTime = moment(result.checkInTime).format("HH:mm:ss");
      formData.checkOutTime = moment(result.checkOutTime).format("HH:mm:ss")
      formData.timePeriod = Number(formData.timePeriod);
      formData.isActive = true;
      formData.id = data.id;
      this.shiftsService.updateShift(formData).subscribe(
        {
          next: data => {
            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.close();
            let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
            this.translate.get("shifts").subscribe(translate => {
              succressDialog = this.dialog.open(ToastSuccessComponent, {
                width: "30vw",
                data: {
                  title: translate.yourRequestHasBeenSent,
                  message: data.message,
                  buttonSend: translate.shifts
                },
              });
            });
            this.getShifts(this.filteration);
            setTimeout(() => {
              succressDialog.close();
            }, 2000);
            succressDialog.componentInstance.submitted = true;
            succressDialog.componentInstance.submitClicked.subscribe(result => {
              succressDialog.close();
            })
          },
          error: err => {
            dialogRefAddCurrency.close();
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
  deleteRow(data: any) {
    let reasonOfRefuseDialog!:MatDialogRef<DeleteShiftComponent, any>;
    this.translate.get("shifts").subscribe(translate => {
      reasonOfRefuseDialog = this.dialog.open(DeleteShiftComponent, {
        width: "30vw",
        data: {
          title: translate.areYouSureYouDeletedTheShift,
          message: translate.thereIsNoGoingBackOnThisMatter,
          titleClose: translate.toRetreat,
          buttonSend: translate.delete
        },
      });
    })

    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      this.shiftsService.deleteShift({ ShiftWorkingTimeId: data.id }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getShifts(this.filteration);
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
    this.getShifts(this.filteration)
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
