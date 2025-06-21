import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { OvertimeRequestService } from './servies/overtime-request.service';
import { RequestForOvertimeComponent } from 'src/app/shared/request-for-overtime/request-for-overtime.component';
import { DialogOvertimeRequestFileComponent } from 'src/app/shared/dialog-overtime-request-file/dialog-overtime-request-file.component';

@Component({
  selector: 'app-overtime-request',
  templateUrl: './overtime-request.component.html',
  styleUrls: ['./overtime-request.component.scss']
})
export class OvertimeRequestComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  list: any[] = [
    { name: "نسيان تسجيل حضور", key: "1" },
    { name: "نسيان تسجيل انصراف", key: "2" },
    { name: "تسجيل حضور خاطئ", key: "3" },
    { name: "تسجيل انصراف خاطئ", key: "4" }

  ];
  
  columns: any[] = [
    {
      name: "رقم الطلب",
      field: "orderNumber",
    },
    {
      name: "الرقم الوظيفي",
      field: "employeeCode",
    },
    {
      name: "اسم الموظف",
      field: "employeeName",
    },
    {
      name: "نوع الوقت الإضافي",
      field: "overtimeTypeName"
    },
    {
      name: "تاريخ الوقت الإضافي",
      field: "overtimeDate"
    },
    {
      name: "حاله الطلب",
      field: "statusName"
    },
    {
      name: "تاريخ ووقت البدايه",
      field: "dateFrom"
    },
    {
      name: "تاريخ ووقت النهايه",
      field: "dateTo"
    },
    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  overtime: any = [];
  overtimeIsExport: any = [];

  private overtimeRequestService = inject(OvertimeRequestService);
  defaultRowPerPage = { name: '5', code: 5 };

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
  destroy$: Subject<boolean> = new Subject<boolean>();

  private _mobileQueryListener: () => void;
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.overtime = this.overtime;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.overtime = this.overtime;

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
    // this.filterForm = this.fb.group({
    //   date: [],
    //   type: this.fb.group({

    //   }),
    //   currencyCode: this.fb.group({
    //   }),
    //   minimum: [null, this.minimumValidator("maxmimum")
    //   ],
    //   maxmimum: [null, this.maximumValidator("minimum")]
    // });
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


    this.getJustifications(this.filteration)
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

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
    delete columns[8];
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'طلبات الوقت الإضافي',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };

    if(!this.isLoading) {
      this.isLoading = true;
      let filteration = {...this.filteration, isExport:true};

      this.overtimeRequestService.listOvertimeRequest(filteration).subscribe(data => {
        this.overtimeIsExport = [];

        data.data.forEach((employee: any) => {
          this.overtimeIsExport.push({
            id: employee.id,
            orderNumber: employee.code,
            employeeName: {
              name: employee.employee.name,
              alt: employee.employee.name,
              img: employee.employee.profileImagePath ? employee.employee.profileImagePath : "../../../../assets/img/5034901-200.png"
            },
            statusName:employee.statusName,
            employeeCode:employee.employee.employeeNumber,
            typeOfJustification: employee.justificationTypeName,
            overtimeDate: moment(new Date(employee.overtimeDate)).format("MM-DD-YYYY"),
            status:employee.status,
            dateFrom: moment(new Date(employee.dateFrom)).format("MM-DD-YYYY h:mm a"),
            dateTo: moment(new Date(employee.dateTo)).format("MM-DD-YYYY h:mm a")

          })
        });

        let formatTable = this.overtimeIsExport.map(justification => {
          
          return {
            orderNumber: justification.orderNumber,
            employeeName: justification.employeeName.name,
            typeOfJustification: justification.typeOfJustification,
            overtimeDate: justification.overtimeDate,
            statusName:justification.statusName,
            employeeCode:justification.employeeCode,
            dateFrom: justification.dateFrom,
            dateTo: justification.dateTo
          }
        })
        this.isLoading = false;
        let formatRows =formatTable.map(ustification => [
          ustification.orderNumber,
          ustification.employeeCode, 
          ustification.employeeName, 
          ustification.typeOfJustification,
          ustification.overtimeDate,
          ustification.statusName, 
          ustification.dateFrom, 
          ustification.dateTo, 
        ]);
         this.generateExcel('طلبات الوقت الإضافي','طلبات الوقت الإضافي',formatRows, columns);

      })
    }
  }
  exportTableToPDF() {

  
    if(!this.isLoading) {
      this.isLoading = true;
      let table: any = document.getElementById("tableJustificationHidden");
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
  dialogJustificationFile(data: any) {
    let dialogRefAddCurrency = this.dialog.open(DialogOvertimeRequestFileComponent, {
      width: "60vw",
      data: {
        title: "ملف الوقت الإضافي"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id
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
    this.getJustifications(this.filteration);
  }
  resetFilteration() {
    this.filterForm.get("FreeText")?.setValue("");
    this.filterForm.get("code")?.setValue("");

    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getJustifications(this.filteration);
  }
  getInformation() {
    this.spinnerCards = true;

    this.overtimeRequestService.getInformation().subscribe({
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

  getJustifications(filteration: any) {
    this.overtime = [];
    this.isLoading = true;
    this.overtimeRequestService.listOvertimeRequest(filteration).subscribe(data => {
      data.data.forEach((employee: any) => {
        
        this.overtime.push({
          id: employee.id,
          orderNumber: employee.code,
          employeeName: {
            name: employee.employee.name,
            alt: employee.employee.name,
            img: employee.employee.profileImagePath ? employee.employee.profileImagePath : "../../../../assets/img/5034901-200.png"
          },
          statusName:employee.statusName,
          employeeCode:employee.employee.employeeNumber,
          overtimeTypeName: employee.overtimeTypeName,
          overtimeDate: moment(new Date(employee.overtimeDate)).format("MM-DD-YYYY"),
          status:employee.status,
          dateFrom: moment(new Date(employee.dateFrom)).format("MM-DD-YYYY h:mm a"),
          dateTo: moment(new Date(employee.dateTo)).format("MM-DD-YYYY h:mm a")
        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;
    })
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: Number(this.id), actionCode: data.actionCode })
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getJustifications(this.filteration)
  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getJustifications(this.filteration)
  }

  requestJustification() {
    let dialogRefAddCurrency!:MatDialogRef<RequestForOvertimeComponent, any>;
    this.translate.get("justifications").subscribe(translate => {
       dialogRefAddCurrency = this.dialog.open(RequestForOvertimeComponent, {
        width: "50vw",
        data: {
          title: "طلب الوقت الإضافي",
          setAsNecessary: translate.setAsEssential,
          titlePermissionTypeId: "نوع الوقت الإضافي <span class='color-red'>*</span>",
          placeholderPermissionTypeId: "نوع الوقت الإضافي",
          PermissionTypeIdValidation: "نوع الوقت الإضافي مطلوب",
          titleCalendar: "تاريخ الوقت الإضافي <span class='color-red'>*</span>",
          placeholderCalendar: "تاريخ الوقت الإضافي",
          titleNotes: translate.notes+" <span class='color-red'>*</span>",
          placeholdeNotes: translate.notes,
          NotesValidation: translate.notesRequired,
          dateTaskValidation: "تاريخ الوقت الإضافي مطلوب",
          labelRadioButton: translate.applicant,
          firstRadio: translate.forMyself,
          secondRadio: translate.toAnEmployee,
          titleEmployeeId: translate.employee+" <span class='color-red'>*</span>",
          placeholderEmployeeId: translate.employee,
          EmployeeIdValidation: translate.employeeIsRequired,
          uploadFile: translate.attachAFile,
          chooseLabel: translate.selectTheFileToUpload,
          buttonSend: translate.sendRequest
        },
      });
    })

    dialogRefAddCurrency.componentInstance.submitted = true;

    dialogRefAddCurrency.componentInstance.editPermission = false;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = new FormData();
      

      if (result.ForEmployee) {
        
        formData.append("CreateRequestOvertimeModelString", JSON.stringify({
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          EmployeeId: result.EmployeeId.key,
          OvertimeTypeId: result.PermissionTypeId.key,
          OvertimeDate:moment(new Date(result.dateTask[0])).format("MM/DD/YYYY"),
          DateFrom: moment(new Date(result.dateTask[0])).format("MM/DD/YYYY") + " " + moment(new Date(result.timeStart)).format("HH:mm"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM/DD/YYYY") + " " + moment(new Date(result.timeEnd)).format("HH:mm"),
          Notes:result?.Notes
        }));

      } else {
        

        formData.append("CreateRequestOvertimeModelString", JSON.stringify({
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          OvertimeTypeId: result.PermissionTypeId.key,
          OvertimeDate:moment(new Date(result.dateTask[0])).format("MM/DD/YYYY"),
          DateFrom: moment(new Date(result.dateTask[0])).format("MM/DD/YYYY") + " " + moment(new Date(result.timeStart)).format("HH:mm"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM/DD/YYYY") + " " + moment(new Date(result.timeEnd)).format("HH:mm"),
          Notes:result?.Notes

        }));
      }
     
      
      result.files.forEach((file: any) => {
        if (file.detailsImage === false) {
          formData.append("Attachments", file.fileUpload, file.fileUpload.name);
        } else {
          formData.append("ProfileImageName", file.fileUpload.name);
        }
      });
      dialogRefAddCurrency.componentInstance.submitted = false;
      dialogRefAddCurrency.componentInstance.loading = true;
      

      this.overtimeRequestService.createOvertime(formData).subscribe(
        {
          next: (data: any) => {


            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;

            dialogRefAddCurrency.close();

            let succressDialog:any;

            this.translate.get("justifications").subscribe(translate => {
              succressDialog = this.dialog.open(ToastSuccessComponent, {
                width: "30vw",
                data: {
                  title: translate.yourRequestHasBeenSent,
                  message: data.message,
                  buttonSend:"طلبات الوقت الإضافي"
                },
              });
            })
            this.getJustifications(this.filteration);

            setTimeout(() => {
              succressDialog.close();

            }, 2000);
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
  editJustification(data: any) {
    let dialogRefAddCurrency!:MatDialogRef<RequestForOvertimeComponent, any>;
    this.translate.get("justifications").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(RequestForOvertimeComponent, {
        width: "50vw",
        data: {
          title: "تعديل الوقت الإضافي",
          setAsNecessary: translate.setAsEssential,
          titlePermissionTypeId: "نوع الوقت الإضافي <span class='color-red'>*</span>",
          placeholderPermissionTypeId: "نوع الوقت الإضافي",
          PermissionTypeIdValidation: "نوع الوقت الإضافي مطلوب",
          titleCalendar: "تاريخ الوقت الإضافي <span class='color-red'>*</span>",
          placeholderCalendar: "تاريخ الوقت الإضافي",
          titleNotes: translate.notes+" <span class='color-red'>*</span>",
          placeholdeNotes: translate.notes,
          NotesValidation: translate.notesRequired,
          dateTaskValidation: "تاريخ الوقت الإضافي مطلوب",
          labelRadioButton: translate.applicant,
          firstRadio: translate.forMyself,
          secondRadio: translate.toAnEmployee,
          titleEmployeeId: translate.employee+" <span class='color-red'>*</span>",
          placeholderEmployeeId: translate.employee,
          EmployeeIdValidation: translate.employeeIsRequired,
          uploadFile: translate.attachAFile,
          chooseLabel: translate.selectTheFileToUpload,
          buttonSend: translate.sendRequest
        },
      });
    })
 
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editPermission = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = new FormData();
      if (result.ForEmployee) {

        formData.append("UpdateRequestOvertimeModelString", JSON.stringify({
          id: data.id,
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          EmployeeId: result.EmployeeId.key,
          OvertimeTypeId: result.PermissionTypeId.key,
          OvertimeDate:moment(new Date(result.dateTask[0])).format("MM/DD/YYYY"),
          DateFrom: moment(new Date(result.dateTask[0])).format("MM/DD/YYYY") + " " + moment(new Date(result.timeStart)).format("HH:mm"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM/DD/YYYY") + " " + moment(new Date(result.timeEnd)).format("HH:mm"),
          Notes:result?.Notes

        }));

      } else {
        formData.append("UpdateRequestOvertimeModelString", JSON.stringify({
          id: data.id,
          IsNecessary: result.IsNecessary,
          ForEmployee: result.ForEmployee,
          OvertimeTypeId: result.PermissionTypeId.key,
          OvertimeDate:moment(new Date(result.dateTask[0])).format("MM/DD/YYYY"),
          DateFrom: moment(new Date(result.dateTask[0])).format("MM/DD/YYYY") + " " + moment(new Date(result.timeStart)).format("HH:mm"),
          DateTo: moment(new Date(result.dateTask[1])).format("MM/DD/YYYY") + " " + moment(new Date(result.timeEnd)).format("HH:mm"),
          Notes:result?.Notes

        }));
      }
      result.files.forEach((file: any) => {
        if (file.detailsImage === false) {
          formData.append("Attachments", file.fileUpload, file.fileUpload.name);
        } else {
          formData.append("ProfileImageName", file.fileUpload.name);
        }
      });
      dialogRefAddCurrency.componentInstance.submitted = false;
      dialogRefAddCurrency.componentInstance.loading = true;

      this.overtimeRequestService.updateOvertime(formData).subscribe(
        {
          next: (data: any) => {
            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;
            dialogRefAddCurrency.close();
            let succressDialog:any;

            this.translate.get("justifications").subscribe(translate => {
              succressDialog = this.dialog.open(ToastSuccessComponent, {
                width: "30vw",
                data: {
                  title: translate.yourRequestHasBeenSent,
                  message: data.message,
                  buttonSend: "طلبات الوقت الإضافي"
                },
              });
            })
     
            this.getJustifications(this.filteration);

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
  reasonOfRefuse(data: any) {
    let reasonOfRefuseDialog!:MatDialogRef<DialogCloseComponent, any>;
    this.translate.get("justifications").subscribe(translate => {
      reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
        width: "30vw",
        data: {
          title: translate.areYouSureTheRequestWillBeRejected,
          message: translate.pleaseExplainWhyIfPossible,
          titleReasonOfRefuse: translate.theReasonOfRefuse,
          placeholdeReasonOfRefuse: translate.pleaseWriteTheReasonForRejection,
          titleClose: translate.toRetreat,
          buttonSend: translate.rejectionOfTheApplication
        },
      });
    })
 

    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;

      this.overtimeRequestService.rejectJustification({ refuseReason: result.notes, id: data.id }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getJustifications(this.filteration);
            reasonOfRefuseDialog.close();
          },
          error: err => {
            reasonOfRefuseDialog.componentInstance.submitted = true;

          }
        }
      )


    })
  }
  sendRequest(data: any) {
    this.overtimeRequestService.accept({ requestId: data.id }).subscribe(
      {
        next: res => {
          this.getJustifications(this.filteration);
          let succressDialog:any;

          this.translate.get("justifications").subscribe(translate => {
            succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: translate.TheRequestHasBeenAccepted,
                message: res.message,
                buttonSend: translate.close
              },
            });
          })
     
          setTimeout(() => {
            succressDialog.close();

          }, 2000);
          succressDialog.componentInstance.submitClicked.subscribe(result => {
            succressDialog.close();

          })
        },
        error: err => {

        }
      }
    )

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
