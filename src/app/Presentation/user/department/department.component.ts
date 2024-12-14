import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DepartmentService } from './services/department.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DialogDepartmentFileComponent } from 'src/app/shared/components/dialog-department-file/dialog-department-file.component';
import { DialogCloseRadioButtonsComponent } from 'src/app/shared/components/dialog-close-radio-buttons/dialog-close-radio-buttons.component';
import { DialogUploadFileComponent } from 'src/app/shared/components/uploadFiles/dialog-upload-file/dialog-upload-file.component';
import { HttpEventType } from '@angular/common/http';
import { DialogUploadFileProgressBarComponent } from 'src/app/shared/components/uploadFiles/dialog-upload-file-progress-bar/dialog-upload-file-progress-bar.component';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  list: any[] = [
    { name: "نسيان تسجيل حضور", key: "1" },
    { name: "نسيان تسجيل انصراف", key: "2" },
    { name: "تسجيل حضور خاطئ", key: "3" },
    { name: "تسجيل انصراف خاطئ", key: "4" }
  ];
  columns: any[] = [
    {
      name: "كود الحضور",
      field: "orderNumber",
    },
    {
      name: "اسم الموظف",
      field: "name",
    },
    {
      name: "التاريخ",
      field: "date"
    },
    {
      name: "وقت الحضور",
      field: "audience"
    },
    {
      name: "وقت الخروج",
      field: "dismissing"
    },
    {
      name: "الحالة",
      field: "status"
    },
    {
      name: "ساعات العمل",
      field: "timeGap"
    },
    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  department: any = [];
  departmentIsExport: any = [];
  private dialog = inject(MatDialog);

  isLoading = true;
  isUploading: boolean = false;
  isCanceling: boolean = false;
  isDialogProgressBarOpen = false;
  dialogRefUploadFiles!: any;
  dialogRefUploadFilesProgressBar!: any;
  barWith: number = 0;
  uploadSub: Subject<boolean> = new Subject();
  loading = false;
  filteration: any = {
    PageSize: 5,
    PageNumber: 0,
    Month: 11,
    Year: 2023,
    PagingEnabled: true
  };

  services: any[] = [
    { name: 'Cash in', key: 'cashIn' },
    { name: 'Cash out', key: 'cashOut' }
  ];
  page = 0;
  categories: any[] = [
  ];
  defaultRowPerPage = { name: '5', code: 5 };

  private departmentService = inject(DepartmentService);
  destroy$: Subject<boolean> = new Subject<boolean>();

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
  isAdmin = true;

  private _mobileQueryListener: () => void;
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');
    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.department = this.department;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.department = this.department;
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
    if (this.mobileQuery.matches) {
      this.opened = true;
    } else {
      this.opened = false;

    }
    let permission = JSON.parse(localStorage.getItem('permissions') as string)
    this.isAdmin = permission?.isAdmin;
    this.filterForm = this.fb.group({
      FreeText: [""],
      code: [""],

    });
    this.categories.push({ name: "adasd", key: "adsas" });
    this.RowsPerPage = [
      { name: '2', code: 2 },
      { name: '5', code: 5 }
    ];
    this.translate.get("department").subscribe(data => {
      this.columns =  [
        {
          name: data.employeeNumber,
          field: "orderNumber",
        },
        {
          name:  data.employeeName,
          field: "name",
        },
        {
          name: data.theDate,
          field: "date"
        },
        {
          name: data.timeAttendance,
          field: "audience"
        },
        {
          name: data.timeToGoOut,
          field: "dismissing"
        },
        {
          name:  data.theCondition,
          field: "status"
        },
        {
          name: "ساعات العمل",
          field: "timeGap"
        },
        {
          name: data.action,
          field: "actions"
        }
      ];
    })
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(dataParent => {
      this.translate.get("department").subscribe(data => {
        this.columns =  [
          {
            name: data.employeeNumber,
            field: "orderNumber",
          },
          {
            name:  data.employeeName,
            field: "name",
          },
          {
            name: data.theDate,
            field: "date"
          },
          {
            name: data.timeAttendance,
            field: "audience"
          },
          {
            name: data.timeToGoOut,
            field: "dismissing"
          },
          {
            name:  data.theCondition,
            field: "status"
          },
          {
            name: "ساعات العمل",
            field: "timeGap"
          },
          {
            name: data.action,
            field: "actions"
          }
        ];
      })
      // this.subscription = this.translate.stream('primeng').subscribe(data => {
      //   this.config.setTranslation(data);
      // });  
    })
    this.getInformation();

    this.getDepartment(this.filteration)
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  showComponent(data: any) {
    return this.permissionsUserService.checkPermission({ type: "component", screenCode: data.screenCode })
  }
  getPermissions(): any {
    const permissionsString = localStorage.getItem('permissions') as string;

    try {
      // حاول تحويل القيمة إلى كائن JSON
      return JSON.parse(permissionsString);
    } catch (error) {
      // إذا كان هناك أي خطأ، فقط أرجع القيمة النصية
      return permissionsString;
    }
  }
  componentName(data: any): string {
    let findIndexPermission = (this.getPermissions()?.availablePermissions as any[]).findIndex(permission => permission.screenCode === data.screenCode);
    return this.getPermissions()?.availablePermissions[findIndexPermission]?.screenName

  }
  async generateExcel(title,insideTitle,formatRows, columns) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title);
  
    // إضافة العنوان في الصف الأول
    const titleRow = worksheet.addRow([insideTitle]);
    
    // دمج الأعمدة لتوسيط العنوان
    worksheet.mergeCells('A1:G1');
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
    delete columns[7]
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'الحضور والانصراف',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };
 

    
    if(!this.isLoading) {
      this.isLoading = true;
      let filteration = {...this.filteration, isExport:true};
      this.departmentService.listAttendance(filteration).subscribe(data => {
        this.departmentIsExport = [];

        data.data.employeeAttendances.forEach((attendacne: any) => {
          this.departmentIsExport.push({
            id: attendacne.id,
            orderNumber: attendacne.id,
            name: attendacne.employeeName,
            date: moment(new Date(attendacne.date)).format("MM/DD/YYYY"),
            audience: attendacne.checkInDateTime.replaceAll(' ', '') ? attendacne.checkInDateTime : "لا يوجد",
            dismissing: attendacne.checkOutDateTime.replaceAll(' ', '') ? attendacne.checkOutDateTime : "لا يوجد",
            status: attendacne.status,
            timeGap: attendacne.workingHours
          })
        });
  
  

        let formatTable = this.departmentIsExport.map(department => {
          return {
            orderNumber: department.orderNumber,
            name: department.name,
            date: department.date,
            audience: department.audience,
            dismissing: department.dismissing,
            status: department.status,
            timeGap: department.timeGap
    
          }
        })
        this.isLoading = false;
        let formatRows =formatTable.map(department => [
          department.orderNumber,
          department.name, 
          department.date,
          department.audience,
          department.dismissing,
          department.status,
          department.timeGap
        ]);
        this.generateExcel('الحضور والانصراف','الحضور والانصراف',formatRows, columns);

      })
  
    }
  }
  exportTableToPDF() {

    if(!this.isLoading) {
      this.isLoading = true;
      let table: any = document.getElementById("tableEmploymentHidden");
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

    this.getDepartment(this.filteration);
  }
  resetFilteration() {
    this.filterForm.get("FreeText")?.setValue("");
    this.filterForm.get("code")?.setValue("");

    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getDepartment(this.filteration);
  }
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: Number(this.id), actionCode: data.actionCode })
  }
  getInformation() {
    this.spinnerCards = true;
    this.departmentService.getInformation().subscribe({
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
  dialogEmployeeFile(data: any) {
    let dialogRefAddCurrency!:MatDialogRef<DialogDepartmentFileComponent, any>;
    this.translate.get("department").subscribe(data => {
      dialogRefAddCurrency = this.dialog.open(DialogDepartmentFileComponent, {
        width: "40vw",
        data: {
          title: data.attendanceAndDepartureFile
        },
      });
    })

    dialogRefAddCurrency.componentInstance.id = data.id

  }
  getDepartment(filteration: any) {
    this.department = [];
    this.isLoading = true;
    this.departmentService.listAttendance(filteration).subscribe(data => {
      data.data.employeeAttendances.forEach((attendacne: any) => {
        this.department.push({
          id: attendacne.id,
          orderNumber: attendacne.id,
          name: attendacne.employeeName,
          date: moment(new Date(attendacne.date)).format("MM/DD/YYYY"),
          audience: attendacne.checkInDateTime.replaceAll(' ', '') ? attendacne.checkInDateTime : "لا يوجد",
          dismissing: attendacne.checkOutDateTime.replaceAll(' ', '') ? attendacne.checkOutDateTime : "لا يوجد",
          status: attendacne.status,
          timeGap: attendacne.workingHours
        })
      });


      this.totalItems = data.data.totalCount
      this.isLoading = false;
    })
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {

    this.filteration = { ...this.filteration, PageSize: data.value.code };

    this.getDepartment(this.filteration)
  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getDepartment(this.filteration)
  }
  CreateImportDataFromExcel() {
    // this.employeesService.importDataFromExcel()
    this.dialogRefUploadFiles = this.dialog.open(DialogUploadFileComponent, {
      width: "50vw",
      data: {
        title: "رفع الملف",
        uploadFile: "ارفاق الملف",
        chooseLabel: "اختار الملف ليتم رفعه",
        buttonSend:"رفع",
        titleClose:"اغلاق"
      },
    });

    this.dialogRefUploadFiles.componentInstance.submitted = true;
    // dialogRefAddCurrency.componentInstance.list = this.categories;
    this.dialogRefUploadFiles.componentInstance.submitClicked.subscribe(result => {
      let formData = new FormData();
      moment.locale("en"); 
      result.files.forEach((file: any) => {
        formData.append("file", file.fileUpload, file.fileUpload.name);
      });
      this.dialogRefUploadFiles.componentInstance.submitted = false;

      this.departmentService.importDataFromExcel(formData).pipe(takeUntil(this.uploadSub)).subscribe(
        {
          next: data => {
            if (data.type === HttpEventType.Sent) {
              this.dialogRefUploadFilesProgressBar = this.dialog.open(DialogUploadFileProgressBarComponent, {
                id: 'uploadProgressBar',
                width: "40vw",
                data: {
                  title: "upload files",
                  message: "Files are Uploading...",
                  buttonSend: "remove",
                  buttonClose: "Cancel",
                  actionsspaceBetween: true
                },
              });
            }
            if (data.type === HttpEventType.UploadProgress) {
              this.isUploading = true;

              this.barWith = Math.round(100 / (data.total || 0) * data.loaded);
              if (!this.isDialogProgressBarOpen) {
                this.isDialogProgressBarOpen = true;
         
              }
              this.dialogRefUploadFilesProgressBar.componentInstance.barWithText = "يتم تحميل المف..." + this.barWith + "%";
              this.dialogRefUploadFilesProgressBar.componentInstance.barWidth = this.barWith;
            } else if (data.type === HttpEventType.Response) {
              this.dialogRefUploadFilesProgressBar.componentInstance.barWithText = "تم تحميل الملف بنجاح";
              this.isUploading = false;
              this.isDialogProgressBarOpen = false;
              this.dialogRefUploadFiles.componentInstance.submitted = true;
                  this.dialogRefUploadFilesProgressBar.close();
                  this.toast.success("Successfully upload!", '', {
                    timeOut: 5000,
                    onActivateTick: true
                  });
                  this.getDepartment(this.filteration);

                  this.dialogRefUploadFiles.close();

              
            }
          },
          error: err => {
            if(err.status === 400) {
              let valuesError = Object.values(err?.error);
              this.dialogRefUploadFiles.componentInstance.errorFile = valuesError;
            }
            this.dialogRefUploadFiles.componentInstance.submitted = true;
            this.dialogRefUploadFilesProgressBar.close();

          }
        }
      )


    });
    this.dialogRefUploadFiles.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  exportDraft() {
    this.loading = true;
    this.departmentService.exportDraft().subscribe( {
      next:data => {
        // let fileName = data.headers.get('content-disposition')?.split(';')[1].split('=')[1];
        // let blob:Blob = data.body as Blob;
        // let a = document.createElement('a');
        // a.download = fileName;
        // a.href = window.URL.createObjectURL(blob);
        // a.click();
        saveAs(data.body, 'EmployeeAttendanceEmptyDraft.xlsx')
        this.loading = false;


      },
      error:err => {
        this.loading = false;

        this.toast.error(err.message);

      }
    }
      );
  }
  deleteRow(data: any) {
    const reasonOfRefuseDialog = this.dialog.open(DialogCloseRadioButtonsComponent, {
      width: "50vw",
      data: {
        title: "متأكد من حذف الحضور والانصراف؟",
        message: "برجاء توضيح السبب إن أمكن ليظهر للموظف كتنبيه في التطبيق",
        titleReasonOfRefuse: "طريقة الحذف",
        placeholdeReasonOfRefuse: "برجاء كتابة سبب الحذف ان امكن",
        titleClose: "تراجع",
        buttonSend: "حذف"
      },
    });
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      
      this.departmentService.deleteAttendance({ Id: data.id, Type:Number(result.type) }).subscribe(
        {
          next: res => {
            

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getDepartment(this.filteration);
            reasonOfRefuseDialog.close();
          },
          error: err => {
            reasonOfRefuseDialog.componentInstance.submitted = true;

          }
        }
      )

    })
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
  ngOnDestroy() {
    this.destroy$.next(true);
    this.subscription.unsubscribe();
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
