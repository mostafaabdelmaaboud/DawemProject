import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { DeleteShiftComponent } from 'src/app/shared/components/delete-shift/delete-shift.component';
import { AddTableComponent } from 'src/app/shared/components/add-table/add-table.component';
import { SchedulesService } from './services/schedules.service';
import { ToastrService } from 'ngx-toastr';
import { DialogScheduleFileComponent } from 'src/app/shared/components/dialog-schedule-file/dialog-schedule-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  private schedulesService = inject(SchedulesService);
  destroy$: Subject<boolean> = new Subject<boolean>();


  columns: any[] = [
    {
      name: "رقم الجدول",
      field: "tableNumber",
    },
    {
      name: "اسم الجدول",
      field: "tableName",
    },
    {
      name: "موظفين الجدول",
      field: "tableStaff"
    },
    {
      name: "الإجراء",
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
    this.translate.get("tables").subscribe(data => {
      this.columns = [
        {
          name: data.tableNumber,
          field: "tableNumber",
        },
        {
          name: data.tableName,
          field: "tableName",
        },
        {
          name: data.tableStaff,
          field: "tableStaff"
        },
        {
          name: data.action,
          field: "actions"
        }
      ];
    })
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(dataParent => {
      this.translate.get("tables").subscribe(data => {
        this.columns = [
          {
            name: data.tableNumber,
            field: "tableNumber",
          },
          {
            name: data.tableName,
            field: "tableName",
          },
          {
            name: data.tableStaff,
            field: "tableStaff"
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

    this.getSchedules(this.filteration);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

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
    this.getSchedules(this.filteration);
  }
  async generateExcel(title,insideTitle,formatRows, columns) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title);
  
    // إضافة العنوان في الصف الأول
    const titleRow = worksheet.addRow([insideTitle]);
    
    // دمج الأعمدة لتوسيط العنوان
    worksheet.mergeCells('A1:C1');
      titleRow.getCell(1).font = { 
      name: 'Arial', 
      size: 16, 
      bold: true, 
      color: { argb: 'FF0000FF' } // اللون الأزرق
    };
    titleRow.getCell(1).alignment = { horizontal: 'center' };
    let columnsFormat =columns.map(column =>column.name);
    worksheet.columns = columns.fill({width:30});
 
    // إضافة الهيدر (Header)
    const headerRow = worksheet.addRow(columnsFormat);
  
    // تنسيق الهيدر
    headerRow.font = { bold: true }; // جعل النص سميك (Bold)
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCCCCC' }, // خلفية رمادية
      };
      cell.border = { // إضافة حدود للخلية
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  
    // إضافة الجسم (Body)
    const data = formatRows;
    data.forEach(row => {
      const rowValues = worksheet.addRow(row);
      rowValues.eachCell((cell) => {
        cell.alignment = { horizontal: 'right' }; // محاذاة النص لليمين
      });
    });
    // حفظ الملف
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${title}.xlsx`);
  }
  exportTableToExcel() {
    let columns = [...this.columns];
    delete columns[3]
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'الجدولة',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };

    if(!this.isLoading) {
      this.isLoading = true;
      let filteration = {...this.filteration, isExport:true};

      this.schedulesService.listSchedules(filteration).subscribe(data => {
        this.schedulesIsExport = [];

        data.data.forEach((employee: any) => {
          this.schedulesIsExport.push({
            id: employee.id,
            tableNumber: employee.code,
            tableName: employee.name,
            tableStaff: employee.employeesNumber ? employee.employeesNumber : "لا يوجد"
  
          })
        });
        let formatTable = this.schedulesIsExport.map(schedule => {
          return {
            tableNumber: schedule.tableNumber,
            tableName: schedule.tableName,
            tableStaff: schedule.tableStaff
          }
        })
        this.isLoading = false;
        let formatRows =formatTable.map(schedule => [
          schedule.tableNumber,
          schedule.tableName, 
          schedule.tableStaff 
        ]);
        this.generateExcel('الجدولة','الجدولة',formatRows, columns);

  
      })
    }  }
  exportTableToPDF() {
    if(!this.isLoading) {
      this.isLoading = true;
      let table: any = document.getElementById("tabletablesHidden");
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
    this.getSchedules(this.filteration);
  }
  getInformation() {
    this.spinnerCards = true;
    this.schedulesService.getInformation().subscribe({
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
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: Number(this.id), actionCode: data.actionCode })
  }
  getSchedules(filteration: any) {
    this.schedules = [];
    this.isLoading = true;
    this.schedulesService.listSchedules(filteration).subscribe(data => {
      data.data.forEach((employee: any) => {
        this.schedules.push({
          id: employee.id,
          tableNumber: employee.code,
          tableName: employee.name,
          tableStaff: employee.employeesNumber ? employee.employeesNumber : "لا يوجد"

        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;

    })
  }
  addTable() {
    let dialogRefAddCurrency!:MatDialogRef<AddTableComponent, any>;
    this.translate.get("tables").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(AddTableComponent, {
        width: "50vw",
        data: {
          title: translate.addATable,
          titleTableName: translate.tableName+" <span class='color-red'>*</span>",
          placeholdetableName: translate.tableName,
          ValidationTableName: translate.tableNameRequired,
          titleClose: translate.toRetreat,
          buttonSend: translate.addTable
        },
      });
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editSchedule = false;
    // dialogRefAddCurrency.componentInstance.list = this.categories;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      formData.name = result.tableName;
      formData.isActive = true;
      formData.scheduleDays = [];
      result?.weekDays?.forEach((day: any) => {
        if (day.weekDayValue.key != undefined) {
          formData.scheduleDays.push({ WeekDay: day.weekDay, ShiftId: day.weekDayValue.key })
        } else {
          formData.scheduleDays.push({ WeekDay: day.weekDay, ShiftId: null })
        }
      });
      dialogRefAddCurrency.componentInstance.submitted = false;
      dialogRefAddCurrency.componentInstance.loading = true;

      this.schedulesService.createSchedule(formData).subscribe(
        {
          next: data => {
            if (data?.state === 2) {
              dialogRefAddCurrency.componentInstance.submitted = true;
              dialogRefAddCurrency.componentInstance.loading = false;
              this.toast.error(data?.message);
            } else {
              dialogRefAddCurrency.componentInstance.submitted = true;
              dialogRefAddCurrency.componentInstance.loading = false;

              dialogRefAddCurrency.close();
              let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
              this.translate.get("tables").subscribe(translate => {
                succressDialog = this.dialog.open(ToastSuccessComponent, {
                  width: "30vw",
                  data: {
                    title: translate.yourRequestHasBeenSent,
                    message: data.message,
                    buttonSend: translate.scheduling
                  },
                });
              });
       
              this.getSchedules(this.filteration);
              setTimeout(() => {
                succressDialog.close();

              }, 2000);

              succressDialog.componentInstance.submitted = true;
              succressDialog.componentInstance.submitClicked.subscribe(result => {
                succressDialog.close();

              })
            }



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
  editTable(data: any) {
    let dialogRefAddCurrency!:MatDialogRef<AddTableComponent, any>;
    this.translate.get("tables").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(AddTableComponent, {
        width: "50vw",
        data: {
          title: translate.editTable,
          titleTableName: translate.tableName+" <span class='color-red'>*</span>",
          placeholdetableName: translate.tableName,
          ValidationTableName: translate.tableNameRequired,
          code: "#001093",
          titleClose: translate.toRetreat,
          buttonSend: translate.saveTable
        },
      });
    });
 
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editSchedule = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    // dialogRefAddCurrency.componentInstance.list = this.categories;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      
      let formData: any = {};
      formData.name = result.tableName;
      formData.isActive = true;
      formData.scheduleDays = [];
      debugger;
      result?.weekDays?.forEach((day: any) => {
        if (day?.weekDayValue?.key != undefined) {
          formData.scheduleDays.push({ WeekDay: day?.weekDay, id:day?.id, ShiftId: day?.weekDayValue?.key })
        } else {
          formData.scheduleDays.push({ WeekDay: day?.weekDay,id:day?.id, ShiftId: null })
        }
      });
      formData.id = data?.id;
      dialogRefAddCurrency.componentInstance.submitted = false;
      dialogRefAddCurrency.componentInstance.loading = true;
      debugger;

      this.schedulesService.updateSchedule(formData).subscribe(
        {
          next: data => {
            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;
            dialogRefAddCurrency.close();
            let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
            this.translate.get("tables").subscribe(translate => {
              succressDialog = this.dialog.open(ToastSuccessComponent, {
                width: "30vw",
                data: {
                  title: translate.yourRequestHasBeenSent,
                  message: data.message,
                  buttonSend: translate.scheduling
                },
              });
            });
            this.getSchedules(this.filteration);
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
  dialogScheduleFile(data: any) {
    let dialogRefAddCurrency!:MatDialogRef<DialogScheduleFileComponent, any>;
    this.translate.get("tables").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(DialogScheduleFileComponent, {
        width: "40vw",
        data: {
          title: translate.tableFile
        },
      });
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


  deleteRow(data: any) {

    let reasonOfRefuseDialog!:MatDialogRef<DeleteShiftComponent, any>;
    this.translate.get("tables").subscribe(translate => {
      reasonOfRefuseDialog = this.dialog.open(DeleteShiftComponent, {
        width: "30vw",
        data: {
          title: translate.areYouSureToDeleteTheTable,
          message: translate.thereIsNoGoingBackOnThisMatter,
          titleClose: translate.toRetreat,
          buttonSend: translate.delete
        },
      });
    });
  
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      this.schedulesService.deleteSchedule({ ScheduleId: data.id }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getSchedules(this.filteration);
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
    this.getSchedules(filteration)

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
