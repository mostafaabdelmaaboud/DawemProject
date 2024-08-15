import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SummonsService } from './services/summons.service';
import { AddSummonComponent } from 'src/app/shared/components/add-summon/add-summon.component';
import { DialogSummonFileComponent } from 'src/app/shared/components/dialog-summon-file/dialog-summon-file.component';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-summons',
  templateUrl: './summons.component.html',
  styleUrls: ['./summons.component.scss']
})
export class SummonsComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  private summonsService = inject(SummonsService);
  columns: any[] = [
    {
      name: "كود الإستدعاء",
      field: "code",
    },
    {
      name: "حالة الإستدعاء",
      field: "summonStatusName",
    },
    {
      name: "نوع الاستدعاء",
      field: "forTypeName",
    },
    {
      name:"عدد الموظفين المستهدفين",
      field: "numberOfTargetedEmployees",
    },
    {
      name: "تاريخ ووقت الاستدعاء",
      field: "LocalDateAndTime"
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
      code: [""],

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
    this.summonsService.getInformation().subscribe({
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
    this.summonsService.listSummons(filteration).subscribe(data => {
      data.data.forEach((summon: any) => {
        this.summons.push({
          id: summon.id,
          code: summon.code,
          forTypeName: summon.forTypeName,
          summonStatusName: summon.summonStatusName,
          summonStatus: summon.summonStatus,

          numberOfTargetedEmployees: summon.numberOfTargetedEmployees,
          LocalDateAndTime: moment(new Date(summon.localDateAndTime)).format("MMMM Do YYYY, h:mm:ss a"),
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
        titleDepartmentId: "اسم القسم",
        placeholdeDepartmentId: "اسم القسم",
        ValidationDepartmentId: "اسم القسم مطلوب",
        labelRadioButton: "نوع الاستدعاء",
        firstRadio: "لموظفين",
        secondRadio: "لجروبات",
        thirdRadio: "لاقسام",
        titleEmployeeId: "اسم الموظف",
        placeholdeEmployeeId: "اسم الموظف",
        ValidationEmployeeId: "اسم الموظف مطلوب",
        titleSanaction: "الجزاءات",
        placeholdeSanaction: "الجزاءات",
        ValidationSanaction: "الجزاءات مطلوب",
        titleCalendar: "التاريخ",
        placeholderCalendar: "اختار التاريخ",
        validationCalendar: "التاريخ مطلوب",
        titleGroupId: "اسم الجروب",
        placeholdeGroupId: "اسم الجروب",
        ValidationGroupId: "اسم الجروب مطلوب",
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
        formData.forAllEmployees = null;

      } else {
        formData.forAllEmployees = result.forAllEmployees;

      }
      formData.Sanctions = result.Sanctions.map((list: any) => list.key);
      formData.allowedTime = result.allowedTime;
      formData.TimeType = result.TimeType.key;
      formData.notifyWays = result.notifyWays.map((list: any) => list.key);
      formData.LocalDateAndTime = moment(result.LocalDateAndTime).format("YYYY-MM-DD HH:mm:ss");
      dialogRefAddCurrency.componentInstance.loading = true;
      this.summonsService.createSummon(formData).subscribe(
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
    const dialogRefAddCurrency = this.dialog.open(DialogSummonFileComponent, {
      width: "40vw",
      data: {
        title: "ملف الاستدعاء"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id
  }
  enabledRow(data: any) {

    this.summonsService.enabledSummon({ summonId: data.id }).subscribe(
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
    this.getSummons(this.filteration);
  }
  async generateExcel(title,insideTitle,formatRows, columns) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title);
  
    // إضافة العنوان في الصف الأول
    const titleRow = worksheet.addRow([insideTitle]);
    
    // دمج الأعمدة لتوسيط العنوان
    worksheet.mergeCells('A1:F1');
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
      title: 'الاستدعاءات',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };

    if(!this.isLoading) {
      this.isLoading = true;
      let filteration = {...this.filteration, isExport:true};
      this.summonsService.listSummons(filteration).subscribe(data => {
        this.summonsIsExport = [];

        data.data.forEach((summon: any) => {
          this.summonsIsExport.push({
            id: summon.id,
            code: summon.code,
            forTypeName: summon.forTypeName,
            summonStatusName: summon.summonStatusName,
            numberOfTargetedEmployees: summon.numberOfTargetedEmployees,
            LocalDateAndTime: moment(new Date(summon.localDateAndTime)).format("MMMM Do YYYY, h:mm:ss a"),
  
            isActive: summon.isActive
          })
        });
        let formatTable = this.summonsIsExport.map(summon => {
          return {
            code: summon.code,
            forTypeName: summon.forTypeName,
            summonStatusName: summon.summonStatusName,
            numberOfTargetedEmployees: summon.numberOfTargetedEmployees,
            LocalDateAndTime: summon.LocalDateAndTime
          }
        })
        this.isLoading = false;
        let formatRows =formatTable.map(summon => [
          summon.code,
          summon.forTypeName, 
          summon.summonStatusName, 
          summon.numberOfTargetedEmployees, 
          summon.LocalDateAndTime, 

        ]);
        this.generateExcel('الاستدعاءات','الاستدعاءات',formatRows, columns);

  
      })
    }  }
  exportTableToPDF() {

    if(!this.isLoading) {
      this.isLoading = true;
      let table: any = document.getElementById("tableSummonsHidden");
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
    this.getSummons(this.filteration);
  }
  editSummon(data: any) {
    const dialogRefAddCurrency = this.dialog.open(AddSummonComponent, {
      width: "70vw",
      data: {
        title: "تعديل الاستدعاء",
        setAsActive: "تعيين كنشط",
        titleDepartmentId: "نوع القسم",
        placeholdeDepartmentId: "اسم القسم",
        ValidationDepartmentId: "اسم القسم مطلوب",
        labelRadioButton: "نوع الاستدعاء",
        firstRadio: "لموظفين",
        titleFieldDisabled:"الكود",
        secondRadio: "لجروبات",
        thirdRadio: "لاقسام",
        titleEmployeeId: "نوع الموظف",
        placeholdeEmployeeId: "اسم الموظف",
        ValidationEmployeeId: "اسم الموظف مطلوب",
        titleSanaction: "الجزاءات",
        placeholdeSanaction: "الجزاءات",
        ValidationSanaction: "الجزاءات مطلوب",
        titleCalendar: "التاريخ",
        placeholderCalendar: "اختار التاريخ",
        validationCalendar: "التاريخ مطلوب",
        titleGroupId: "نواب الجروب",
        placeholdeGroupId: "اسم الجروب",
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

      formData.LocalDateAndTime = moment(result.LocalDateAndTime).format("YYYY-MM-DD HH:mm:ss");
      
      dialogRefAddCurrency.componentInstance.loading = true;

      
      this.summonsService.updateSummon(formData).subscribe(
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
      this.summonsService.disabledSummon({ Id: data.id, DisableReason: result.notes }).subscribe(
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
