import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import {FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AddSummonComponent } from 'src/app/shared/components/add-summon/add-summon.component';
import { SummonMissingLogsService } from './services/summon-missing-logs.service';
import { DialogSummonMissingLogsComponent } from 'src/app/shared/components/dialog-summon-missing-logs/dialog-summon-missing-logs.component';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-summon-missing-logs',
  templateUrl: './summon-missing-logs.component.html',
  styleUrls: ['./summon-missing-logs.component.scss']
})
export class SummonMissingLogsComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  private summonMissingLogsService = inject(SummonMissingLogsService);
  columns: any[] = [
    {
      name: "كود الاستدعاء",
      field: "summonCode",
    },
    {
      name: "اسم الموظف",
      field: "employeeName",
    },
    {
      name: "تاريخ ووقت الاستدعاء",
      field: "summonDate"
    },
    {
      name: "عدد الجزاءات",
      field: "sanctionsCount"
    },
    {
      name: "حاله الاستدعاء",
      field: "summonStatusName"
    },
    {
      name: "الإجراء",
      field: "actions"
    }


  ];
  summons: any = [];
  summonsIsExport: any = [];
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
        this.summons = this.summons;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.summons = this.summons;
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
      SummonCode: [""],
      EmployeeNumber:[""],
      SummonDate:[""],
      SummonDoneStatus:["1"]

    });
    this.categories.push({ name: "adasd", key: "adsas" });
    this.RowsPerPage = [
      { name: '2', code: 2 },
      { name: '5', code: 5 }

    ];
    this.getInformation();

    this.getSummons(this.filteration);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  getInformation() {
    this.spinnerCards = true;
    this.summonMissingLogsService.getInformation().subscribe({
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
  getSummons(filteration: any) {
    this.summons = [];
    this.isLoading = true;
    this.summonMissingLogsService.listSummons(filteration).subscribe(data => {
  
      data.data.forEach((summon: any) => {
        this.summons.push({
          id: summon.id,
          summonCode: summon.summonCode,
          employeeName: summon.employeeName,
          
          summonDate: moment(new Date(summon.summonDate)).format("MMMM Do YYYY, h:mm:ss a") ,
          sanctionsCount: summon.sanctionsCount,
          summonStatusName: summon.summonStatusName,

          isActive: summon.isActive
        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;

    })
  }
  addSummon() {
    const dialogRefAddCurrency = this.dialog.open(AddSummonComponent, {
      width: "70vw",
      data: {
        title: "اضافه استدعاء",
        setAsActive: "تعيين كنشط",
        titleDepartmentId: "نوع القسم",
        placeholdeDepartmentId: "نوع القسم",
        ValidationDepartmentId: "نوع القسم مطلوب",
        labelRadioButton: "نوع الاستدعاء",
        firstRadio: "لموظفين",
        secondRadio: "لجروبات",
        thirdRadio: "لاقسام",
        titleEmployeeId: "نوع الموظف",
        placeholdeEmployeeId: "نوع الموظف",
        ValidationEmployeeId: "نوع الموظف مطلوب",
        titleSanaction: "الجزاءات",
        placeholdeSanaction: "الجزاءات",
        ValidationSanaction: "الجزاءات مطلوب",
        titleCalendar: "التاريخ",
        placeholderCalendar: "اختار التاريخ",
        validationCalendar: "التاريخ مطلوب",
        titleGroupId: "نواب الجروب",
        placeholdeGroupId: "نواب الجروب",
        ValidationGroupId: "نواب الجروب مطلوب",
        titleClose: "تراجع",
        buttonSend: "إضافة استدعاء"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editSummon = false;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      formData.isActive = result.isActive;
      if(!result.forAllEmployees) {
        formData.forType = Number(result.forType);
        formData.Employees = result.Employees ? result.Employees.map((list: any) => list.key) : null;
        formData.Groups =  result.Groups ? result.Groups.map((list: any) => list.key)  : null; 
        formData.Departments = result.Departments ? result.Departments.map((list: any) => list.key) : null;
      }
      formData.Sanctions = result.Sanctions.map((list: any) => list.key);
      formData.allowedTime = result.allowedTime;
      formData.TimeType = result.TimeType.key;
      formData.notifyWays = result.notifyWays.map((list: any) => list.key);
      formData.DateAndTime = moment(result.dateAndTime).format("YYYY-MM-DD HH:mm:ss");
      
      dialogRefAddCurrency.componentInstance.loading = true;
      this.summonMissingLogsService.createSummon(formData).subscribe(
        {
          next: data => {
            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الاستدعاءات"
              },
            });
            this.getSummons(this.filteration);
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
  dialogGroupFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogSummonMissingLogsComponent, {
      width: "40vw",
      data: {
        title: "ملف سجل الاستدعاء"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id
  }
  enabledRow(data: any) {

    this.summonMissingLogsService.enabledSummon({ summonId: data.id }).subscribe(
      {
        next: res => {

          this.toast.success(res.message);
          this.getSummons(this.filteration);
        },
        error: err => {

        }
      }
    )
  }
  filter() {
    // Object.entries(this.filterForm?.value).forEach(([key, value]: any) => {
    //   if (typeof value  === 'string') {
    //     if(value != "") {
    //       this.filteration[key] = value.trim();
    //     }
    //   } else {
    //     if(value >=0) {
    //       this.filteration[key] = value;
    //     }
    //   }
    // });
 
    debugger;
    Object.entries(this.filterForm?.value).forEach(([key, value]: any) => {
     if (key === "SummonDate") {
        if (value != "" && value !=  null) {
          this.filteration[key] = moment(value).format("MM-DD-YYYY")
        }
      } else {
        if (typeof value  === 'string') {
          if(value != "" && value !=  null) {
            this.filteration[key] = value.trim();
          }
        } else {
          if(value !=  null) {
            if(value >=0) {
              this.filteration[key] = value;
            }
          }
      
        }
      }
    });
    this.filteration.PageNumber = 0;
    this.getSummons(this.filteration);
  }
  async generateExcel(title,insideTitle,formatRows, columns) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title);
  
    // إضافة العنوان في الصف الأول
    const titleRow = worksheet.addRow([insideTitle]);
    
    // دمج الأعمدة لتوسيط العنوان
    worksheet.mergeCells('A1:E1');
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
    delete columns[5]
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'سجلات الإستدعاءات',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };

    if(!this.isLoading) {
      this.isLoading = true;
      let filteration = {...this.filteration, isExport:true};
  
      this.summonMissingLogsService.listSummons(filteration).subscribe(data => {
        this.summonsIsExport = [];

        data.data.forEach((summon: any) => {
          this.summonsIsExport.push({
            id: summon.id,
            summonCode: summon.summonCode,
            employeeName: summon.employeeName,
            summonDate: moment(new Date(summon.summonDate)).format("MMMM Do YYYY, h:mm:ss a"),
            sanctionsCount: summon.sanctionsCount,

            summonStatusName: summon.summonStatusName,            
            isActive: summon.isActive
          })
        });
        let formatTable = this.summonsIsExport.map(summon => {
          return {
            summonCode: summon.summonCode,

            employeeName: summon.employeeName,
            summonDate: summon.summonDate,
            sanctionsCount: summon.sanctionsCount,
            summonStatusName: summon.summonStatusName,          
          }
        })
        this.isLoading = false;
        let formatRows =formatTable.map(summon => [
          summon.summonCode, 
          summon.employeeName,
          summon.summonDate,
          summon.sanctionsCount,
          summon.summonStatusName,
        ]);
        this.generateExcel('سجلات الإستدعاءات','سجلات الإستدعاءات',formatRows, columns);
    
  
      })
    }  }
  exportTableToPDF() {

    if(!this.isLoading) {
      this.isLoading = true;
      let table: any = document.getElementById("tableSummonsMissingLogsHidden");
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
    this.filterForm.reset();
    this.filterForm.get("SummonDoneStatus")?.setValue("1");

    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getSummons(this.filteration);
  }
  editSummon(data: any) {
    const dialogRefAddCurrency = this.dialog.open(AddSummonComponent, {
      width: "70vw",
      data: {
        title: "تعديل الاستدعاء",
        setAsActive: "تعيين كنشط",
        titleDepartmentId: "نوع القسم",
        placeholdeDepartmentId: "نوع القسم",
        ValidationDepartmentId: "نوع القسم مطلوب",
        labelRadioButton: "نوع الاستدعاء",
        firstRadio: "لموظفين",
        titleFieldDisabled:"الكود",
        secondRadio: "لجروبات",
        thirdRadio: "لاقسام",
        titleEmployeeId: "نوع الموظف",
        placeholdeEmployeeId: "نوع الموظف",
        ValidationEmployeeId: "نوع الموظف مطلوب",
        titleSanaction: "الجزاءات",
        placeholdeSanaction: "الجزاءات",
        ValidationSanaction: "الجزاءات مطلوب",
        titleCalendar: "التاريخ",
        placeholderCalendar: "اختار التاريخ",
        validationCalendar: "التاريخ مطلوب",
        titleGroupId: "نواب الجروب",
        placeholdeGroupId: "نواب الجروب",
        ValidationGroupId: "نواب الجروب مطلوب",
        titleClose: "تراجع",
        buttonSend: "حفظ الاستدعاء"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editSummon = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      formData.id = data.id;
      formData.isActive = result.isActive;
      if(!result.forAllEmployees) {
        formData.forType = Number(result.forType);
        formData.Employees = result.Employees ? result.Employees.map((list: any) => list.key) : null;
        formData.Groups =  result.Groups ? result.Groups.map((list: any) => list.key)  : null; 
        formData.Departments = result.Departments ? result.Departments.map((list: any) => list.key) : null;
      }

      formData.Sanctions = result.Sanctions.map((list: any) => list.key);
      formData.allowedTime = result.allowedTime;
      formData.TimeType = result.TimeType.key;

      formData.notifyWays = result.notifyWays.map((list: any) => list.key);

      formData.DateAndTime = moment(result.dateAndTime).format("YYYY-MM-DD HH:mm:ss");
      
      dialogRefAddCurrency.componentInstance.loading = true;

      
      this.summonMissingLogsService.updateSummon(formData).subscribe(
        {
          next: data => {


            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الاستدعاءات"
              },
            });
            this.getSummons(this.filteration);
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

  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getSummons(this.filteration)
  }


  deleteRow(data: any) {

    const reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
      width: "30vw",
      data: {
        title: "متأكد من تعليق الاستدعاء؟",
        message: "برجاء توضيح السبب إن أمكن ليظهر للاستدعاء عند محاولة تسجيل الدخول",
        titleReasonOfRefuse: "سبب التعليق",
        placeholdeReasonOfRefuse: "برجاء كتابة سبب الرفض ليظهر للاستدعاء",
        titleClose: "تراجع",
        buttonSend: "تعليق الاستدعاء"
      },
    });
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      this.summonMissingLogsService.disabledSummon({ Id: data.id, DisableReason: result.notes }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getSummons(this.filteration);
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
    this.getSummons(this.filteration)
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
