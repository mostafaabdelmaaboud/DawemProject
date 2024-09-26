import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import {FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PermissionLogService } from './services/permission-log.service';
import { DialogPermissionLogFileComponent } from 'src/app/shared/components/dialog-permission-log-file/dialog-permission-log-file.component';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-permission-log',
  templateUrl: './permission-log.component.html',
  styleUrls: ['./permission-log.component.scss']
})
export class PermissionLogComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  private permissionLogService = inject(PermissionLogService);
  columns: any[] = [

    {
      name: "اسم المستخدم",
      field: "userName",
    },
    {
      name: "اسم الشاشة",
      field: "screenName"
    },
    {
      name: "اسم الاجراء",
      field: "actionName"
    },
    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  permissionLog: any = [];
  permissionLogIsExport: any = [];
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
  listUsers: any[] = [];
  listScreenCode: any[] = [];
  listActionCode: any[] = [];

  
  spinnerCards = false;
  private _mobileQueryListener: () => void;
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');
    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.permissionLog = this.permissionLog;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.permissionLog = this.permissionLog;
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
      UserId: [""],
      ScreenCode:[""],
      ActionCode:[""]

    });
    this.categories.push({ name: "adasd", key: "adsas" });
    this.RowsPerPage = [
      { name: '2', code: 2 },
      { name: '5', code: 5 }

    ];
    this.getListUsers();
    this.getScreenCode();
    this.getActionCode();

    
    this.getPermissionLog(this.filteration);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: Number(this.id), actionCode: data.actionCode })
  }
  getPermissionLog(filteration: any) {
    this.permissionLog = [];
    this.isLoading = true;
    this.permissionLogService.listPermissionLog(filteration).subscribe(data => {

      data.data.forEach((summon: any) => {
        this.permissionLog.push({
          id: summon.id,
          userName: summon.userName,
          screenName: summon.screenName,
          actionName: summon.actionName
        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;

    })
  }

  dialogGroupFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogPermissionLogFileComponent, {
      width: "40vw",
      data: {
        title: "ملف سجلات الصلاحيات"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id
  }
  getListUsers() {
    this.permissionLogService.usersForDropdown({PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe(data => {
      data?.data?.forEach((user: any) => {
        this.listUsers.push({ name: user.name, key: user.id })
      });
    })
  }

  getScreenCode() {
    this.permissionLogService.screenCodeForDropdown({PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe(data => {
      data?.data?.forEach((user: any) => {
        this.listScreenCode.push({ name: user.name, key: user.id })
      });
    })
  }
  getActionCode() {
    this.permissionLogService.actionCodeForDropdown({PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe(data => {
      data?.data?.actions?.forEach((user: any) => {
        this.listActionCode.push({ name: user.name, key: user.id })
      });
    })
  }
  lastSearchQuery = "";
  searchDropdown(data: any, type: string) {
    switch (type) {
      case 'UserId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.permissionLogService.usersForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listUsers = [];
                this.lastSearchQuery = "";

                res?.data?.screens?.forEach((user: any) => {
                  this.listUsers.push({ name: user.name, key: user.id })
                });
              });
          }
        }
        break;
      case 'ScreenCode':
        if (data || data === "") {

          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.permissionLogService.screenCodeForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe(res => {
                this.listScreenCode = [];
                this.lastSearchQuery = "";

                res?.data?.forEach((screen: any) => {
                  this.listScreenCode.push({ name: screen.name, key: screen.id })
                });

              });
          }
        }
        break;
      case 'ActionCode':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.permissionLogService.actionCodeForDropdown({PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe(res => {
                this.listActionCode = [];
                this.lastSearchQuery = "";

                res?.data?.actions?.forEach((actionCode: any) => {
                  this.listActionCode.push({ name: actionCode.name, key: actionCode.id })
                });
              });
          }
        }
        break;
      // case 'ScheduleId':
      //   if (data || data === "") {
      //     if (data !== this.lastSearchQuery || data === "") {
      //       this.lastSearchQuery = data;
      //       this.employeesService.getScheduleForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
      //         debounceTime(300),
      //         distinctUntilChanged()).subscribe(res => {
      //           this.listSchedules = [];
      //           this.lastSearchQuery = "";

      //           res?.data?.forEach((jobTitle: any) => {
      //             this.listSchedules.push({ name: jobTitle.name, key: jobTitle.id })
      //           });
      //         });
      //     }
      //   }
      //   break;
      default:
        break;
    }
  }

  filter() {
  
    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    Object.entries(this.filterForm?.value).forEach(([key, value]: any) => {
     if (key === "UserId") {
        if (value != "") {
          this.filteration[key] = value.key
        }
      } else if(key === "ScreenCode") {
        if (value != "") {
          this.filteration["ScreenId"] = value.key
        }
      } else if(key === "ActionCode") {
        if (value != "") {
          this.filteration[key] = value.key
        }
      } else {
        if (typeof value  === 'string') {
          if(value != "") {
            this.filteration[key] = value.trim();
          }
        } else {
          if(value >=0) {
            this.filteration[key] = value;
          }
        }
      }
    });
    this.filteration.PageNumber = 0;
    this.getPermissionLog(this.filteration);
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
      title: 'سجلات الصلاحيات',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };

    if(!this.isLoading) {
      this.isLoading = true;
      let filteration = {...this.filteration, isExport:true};
  
      this.permissionLogService.listPermissionLog(filteration).subscribe(data => {
        this.permissionLogIsExport = [];

        data.data.forEach((permission: any) => {
          this.permissionLogIsExport.push({
            id: permission.id,
            userName: permission.userName,
          screenName: permission.screenName,
          actionName: permission.actionName
          })
        });
      
        let formatTable = this.permissionLogIsExport.map(permission => {
          return {
            userName: permission.userName,
            screenName: permission.screenName,
            actionName: permission.actionName
          }
        })
        this.isLoading = false;
        let formatRows =formatTable.map(permission => [
          permission.userName,
          permission.screenName, 
          permission.actionName
        ]);
        this.generateExcel('سجلات الصلاحيات','سجلات الصلاحيات',formatRows, columns);
    
  
      })
    }  }
  exportTableToPDF() {

    if(!this.isLoading) {
      this.isLoading = true;
      let table: any = document.getElementById("tablePermissionLogHidden");
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

    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getPermissionLog(this.filteration);
  }


  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getPermissionLog(this.filteration)
  }


  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getPermissionLog(this.filteration)
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
