import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { DialogDeleteComponent } from 'src/app/shared/components/dialog-delete/dialog-delete.component';
import { PermissionTypeService } from './services/permission-type.service';
import { RequestPermissionTypeComponent } from 'src/app/shared/components/request-permission-type/request-permission-type.component';
import { DialogPermissionTypeFileComponent } from 'src/app/shared/components/dialog-permission-type-file/dialog-permission-type-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-permission-type',
  templateUrl: './permission-type.component.html',
  styleUrls: ['./permission-type.component.scss']
})
export class PermissionTypeComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  defaultRowPerPage = { name: '5', code: 5 };

  columns: any[] = [
    {
      name: "رقم الاستئذان",
      field: "code",
    },
    {
      name: "الأسم",
      field: "name",
    },
    {
      name: "حاله الاستئذان",
      field: "isActive"
    },
    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  permissions: any = [];
  permissionssIsExport: any = [];
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
  private permissionTypeService = inject(PermissionTypeService);
  list: any[] = [
    { name: "نسيان تسجيل حضور", key: "1" },
    { name: "نسيان تسجيل انصراف", key: "2" },
    { name: "تسجيل حضور خاطئ", key: "3" },
    { name: "تسجيل انصراف خاطئ", key: "4" }

  ];
  destroy$: Subject<boolean> = new Subject<boolean>();

  trans!:any;

  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.permissions = this.permissions;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.permissions = this.permissions;

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
    const translations = this.translate.translations[this.translate.currentLang || 'ar'];
    if(!this.trans) {
      this.trans = translations
    }
    this.translateColumn();

    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(dataParent => {
      this.trans = dataParent.translations;
      this.translateColumn();

    });
    this.getInformation();

    this.getPermissions(this.filteration);
  }
  translateColumn() {

    this.columns = [
      {
        name:this.trans.typesOfPermissions.permissionNumber,
        field: "code",
      },
      {
        name: this.trans.signup.name,
        field: "name",
      },
      {
        name: this.trans.typesOfPermissions.statusOfPermission,
        field: "isActive"
      },
      {
        name: this.trans.assignments.action,
        field: "actions"
      }
  
    ];

  }
  getInformation() {
    this.spinnerCards = true;
    this.permissionTypeService.getInformation().subscribe({
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
    this.getPermissions(this.filteration);
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
      title: this.trans.typesOfPermissions.typesOfPermissions,
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };

    if(!this.isLoading) {
      this.isLoading = true;
      let filteration = {...this.filteration, isExport:true};
     
      this.permissionTypeService.listPermission(filteration).subscribe(
        {
          next: data => {
            this.permissionssIsExport = [];

            data.data.forEach((vacation: any) => {
              this.permissionssIsExport.push({
                id: vacation.id,
                code: vacation.code,
                name: vacation.name,
                isActive: vacation.isActive
  
              })
            });
            let formatTable = this.permissionssIsExport.map(permission => {
      
              return {
                code: permission.code,
                name: permission.name,
                isActive: permission.isActive ? this.trans.employees.active : this.trans.employees.Inactive
              }
            })
            this.isLoading = false;
            let formatRows =formatTable.map(assignment => [assignment.code,assignment.name, assignment.isActive ]);
            this.generateExcel(this.trans.typesOfPermissions.typesOfPermissions,this.trans.typesOfPermissions.typesOfPermissions,formatRows, columns);

            // new ngxCsv(formatTable, "sheet", options);
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
      let table: any = document.getElementById("tablePermissionTypeHidden");
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
    this.getPermissions(this.filteration);
  }
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: Number(this.id), actionCode: data.actionCode })
  }
  getPermissions(filteration: any) {
    this.permissions = [];
    this.isLoading = true;
    this.permissionTypeService.listPermission(filteration).subscribe(
      {
        next: data => {

          data.data.forEach((vacation: any) => {
            this.permissions.push({
              id: vacation.id,
              code: vacation.code,
              name: vacation.name,
              isActive: vacation.isActive

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
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getPermissions(this.filteration)
  }
  reasonOfRefuse(data: any) {
    const reasonOfRefuseDialog = this.dialog.open(DialogDeleteComponent, {
      width: "30vw",
      data: {
        title: this.trans.typesOfPermissions.areYouSureYouWantToDeleteThePermissionType,
        titleClose: this.trans.employees.toRetreat,
        buttonSend: this.trans.users.delete
      },
    });

    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      this.permissionTypeService.deletePermission({ permissionTypeId: data.id }).subscribe({
        next: res => {
          this.toast.success(res.message);
          reasonOfRefuseDialog.componentInstance.submitted = true;
          reasonOfRefuseDialog.close();
          this.getPermissions(this.filteration);
        },
        error: err => {
          reasonOfRefuseDialog.componentInstance.submitted = true;

        }
      })



    })
  }
  requestPermission() {
    const dialogRefAddCurrency = this.dialog.open(RequestPermissionTypeComponent, {
      width: "50vw",
      data: {
        title: this.trans.permissions.typeOfPermission,
        setAsNecessary: this.trans.permissions.setAsEssential,
        titleVacationTypeId: this.trans.assignments.typeOfPermission + " <span class='color-red'>*</span>",
        titleName:this.trans.signup.name + " <span class='color-red'>*</span>",
        placeholdeName: this.trans.typesOfPermissions.pleaseEnterName,
        validationtitleName: this.trans.signup.nameIsRequired,
        buttonSend:this.trans.justifications.sendRequest
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editPermission = false;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {

      let formData: any = {};
      formData.name = result.name;
      formData.isActive = result.IsNecessary;

      dialogRefAddCurrency.componentInstance.submitted = false;

      this.permissionTypeService.createPermission(formData).subscribe(
        {
          next: (data: any) => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: this.trans.zones.yourRequestHasBeenSent,
                message: data.message,
                buttonSend: this.trans.typesOfPermissions.typesOfPermissions

              },
            });
            this.getPermissions(this.filteration);

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

          }
        }
      )
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  editPermission(data: any) {
    const dialogRefAddCurrency = this.dialog.open(RequestPermissionTypeComponent, {
      width: "50vw",
      data: {
        title: this.trans.typesOfPermissions.editAPermission,
        setAsNecessary: this.trans.permissions.setAsEssential,
        titleVacationTypeId: this.trans.assignments.typeOfPermission + " <span class='color-red'>*</span>",
        titleName:this.trans.signup.name + " <span class='color-red'>*</span>",
        placeholdeName: this.trans.typesOfPermissions.pleaseEnterName,
        validationtitleName: this.trans.signup.nameIsRequired,
        buttonSend:this.trans.justifications.sendRequest
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editPermission = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      formData.id = data.id;
      formData.name = result.name;
      formData.isActive = result.IsNecessary;

      dialogRefAddCurrency.componentInstance.submitted = false;

      this.permissionTypeService.updatePermission(formData).subscribe(
        {
          next: (data: any) => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();


            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: this.trans.zones.yourRequestHasBeenSent,
                message: data.message,
                buttonSend: this.trans.typesOfPermissions.typesOfPermissions

              },
            });
            this.getPermissions(this.filteration);

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

          }
        }
      )
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }


  dialogPermissionFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogPermissionTypeFileComponent, {
      width: "40vw",
      data: {
        title: this.trans.typesOfPermissions.permissionFile
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id

  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getPermissions(this.filteration)
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
    this.getPermissions(filteration)

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
