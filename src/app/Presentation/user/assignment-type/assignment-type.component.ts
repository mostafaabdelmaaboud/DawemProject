import { ChangeDetectorRef, Component,  inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { DialogDeleteComponent } from 'src/app/shared/components/dialog-delete/dialog-delete.component';
import { AssignmentTypeService } from './services/assignment-type.service';
import { RequestAssignmentTypeComponent } from 'src/app/shared/components/request-assignment-type/request-assignment-type.component';
import { DialogAssignmentTypeFileComponent } from 'src/app/shared/components/dialog-assignment-type-file/dialog-assignment-type-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-assignment-type',
  templateUrl: './assignment-type.component.html',
  styleUrls: ['./assignment-type.component.scss']
})
export class AssignmentTypeComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);

  columns: any[] = [
    {
      name: "رقم التكليف",
      field: "code",
    },
    {
      name: "الأسم",
      field: "name",
    },
    {
      name: "حاله التكليف",
      field: "isActive"
    },
    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  assignments: any = [];
  assignmentsIsExport: any = [];
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
  destroy$: Subject<boolean> = new Subject<boolean>();

  totalItems: number = 0;
  first: number = 0;
  rows: number = 10;
  RowsPerPage!: any[];
  mobileQuery: MediaQueryList;
  opened = false;
  cards!: any;
  spinnerCards = false;
  private _mobileQueryListener: () => void;
  private assignmentTypeService = inject(AssignmentTypeService);
  list: any[] = [
    { name: "نسيان تسجيل حضور", key: "1" },
    { name: "نسيان تسجيل انصراف", key: "2" },
    { name: "تسجيل حضور خاطئ", key: "3" },
    { name: "تسجيل انصراف خاطئ", key: "4" }

  ];

  trans!:any;

  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.assignments = this.assignments;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.assignments = this.assignments;

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

    this.getAssignments(this.filteration);
  }
  translateColumn() {

    this.columns = [
      {
        name: this.trans.assignments.assignmentNumber,
        field: "code",
      },
      {
        name: this.trans.signup.name,
        field: "name",
      },
      {
        name: this.trans.assignments.assignmentStatus,
        field: "isActive"
      },
      {
        name: this.trans.assignments.action,
        field: "actions"
      }
  
    ];

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

    this.getAssignments(this.filteration);
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
      title: this.trans.sideNav.typesOfAssignments,
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };
    if(!this.isLoading) {
      this.isLoading = true;
      let filteration = {...this.filteration, isExport:true};
      this.assignmentTypeService.listAssignments(filteration).subscribe(
        {
          next: data => {
            this.assignmentsIsExport = [];

            data.data.forEach((vacation: any) => {
              this.assignmentsIsExport.push({
                id: vacation.id,
                code: vacation.code,
                name: vacation.name,
                isActive: vacation.isActive
              })
            });
            let formatTable = this.assignmentsIsExport.map(assignment => {
              return {
                code: assignment.code,
                name: assignment.name,
                isActive: assignment.isActive ? this.trans.employees.active : this.trans.employees.Inactive
              }
            })
            this.isLoading = false;
            let formatRows =formatTable.map(assignment => [assignment.code,assignment.name, assignment.isActive ]);
            this.generateExcel(this.trans.sideNav.typesOfAssignments,this.trans.sideNav.typesOfAssignments,formatRows, columns);
            // new ngxCsv(formatTable, 'أنواع التكليفات', options);
          },
          error: err => {
            this.isLoading = false;
  
          }
        }
      ) 
    }  
  
  }
  exportTableToPDF() {

    if(!this.isLoading) {
      this.isLoading = true;
      let table: any = document.getElementById("tableAssignmentTypeHidden");
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
    this.getAssignments(this.filteration);
  }
  getInformation() {
    this.spinnerCards = true;
    this.assignmentTypeService.getInformation().subscribe({
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
  getAssignments(filteration: any) {
    this.assignments = [];
    this.isLoading = true;
    this.assignmentTypeService.listAssignments(filteration).subscribe(
      {
        next: data => {

          data.data.forEach((vacation: any) => {
            this.assignments.push({
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
    this.getAssignments(this.filteration)
  }
  reasonOfRefuse(data: any) {
      let reasonOfRefuseDialog = this.dialog.open(DialogDeleteComponent, {
        width: "30vw",
        data: {
          title: this.trans.assignments.areYouSureYouWantToDeleteTheAssignmentType,
          titleClose: this.trans.schedualPlan.toRetreat,
          buttonSend: this.trans.vacationBalance.delete
        },
      });
      reasonOfRefuseDialog.componentInstance.submitted = true;
      reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
        reasonOfRefuseDialog.componentInstance.submitted = false;
        this.assignmentTypeService.deleteAssignment({ assignmentTypeId: data.id }).subscribe({
          next: res => {
            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            reasonOfRefuseDialog.close();
            this.getAssignments(this.filteration);
          },
          error: err => {
            reasonOfRefuseDialog.componentInstance.submitted = true;
  
          }
        })
  
  
  
      })

  }
  requestAssignment() {
 

      
      let dialogRefAddCurrency = this.dialog.open(RequestAssignmentTypeComponent, {
        width: "50vw",
        data: {
          title: this.trans.assignments.assignmentType,
          setAsNecessary: this.trans.assignments.setAsEssential,
          titleVacationTypeId: this.trans.assignments.assignmentType +" <span class='color-red'>*</span>",
          titleName: this.trans.signup.name +" <span class='color-red'>*</span>",
          placeholdeName: this.trans.signup.enterTheName,
          validationtitleName: this.trans.signup.nameIsRequired,
          buttonSend: this.trans.justifications.sendRequest
        },
      });
      dialogRefAddCurrency.componentInstance.submitted = true;
      dialogRefAddCurrency.componentInstance.editAssignment = false;
      dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {

        let formData: any = {};
        formData.name = result.name;
        formData.isActive = result.IsNecessary;
  
        dialogRefAddCurrency.componentInstance.submitted = false;
  
        this.assignmentTypeService.createAssignment(formData).subscribe(
          {
            next: (data: any) => {
  
  
              dialogRefAddCurrency.componentInstance.submitted = true;
  
              dialogRefAddCurrency.close();
  
                
              let succressDialog = this.dialog.open(ToastSuccessComponent, {
                  width: "30vw",
                  data: {
                    title: this.trans.justifications.yourRequestHasBeenSent,
                    message: data.message,
                    buttonSend: this.trans.assignments.typesOfAssignments
    
                  },
                });
                succressDialog.componentInstance.submitted = true;


              this.getAssignments(this.filteration);
  
              setTimeout(() => {
                succressDialog.close();
  
              }, 2000);
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
  editAssignment(data: any) {
      
      let dialogRefAddCurrency = this.dialog.open(RequestAssignmentTypeComponent, {
        width: "50vw",
        data: {
          title: this.trans.assignments.assignmentModification,
          setAsNecessary: this.trans.assignments.setAsEssential,
          titleVacationTypeId: this.trans.assignments.assignmentType +" <span class='color-red'>*</span>",
          titleName: this.trans.signup.name +" <span class='color-red'>*</span>",
          placeholdeName: this.trans.signup.enterTheName,
          validationtitleName: this.trans.signup.nameIsRequired,
          buttonSend: this.trans.justifications.sendRequest
        },
      });
      dialogRefAddCurrency.componentInstance.submitted = true;
      dialogRefAddCurrency.componentInstance.editAssignment = true;
      dialogRefAddCurrency.componentInstance.id = data.id;
      dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
        let formData: any = {};
        formData.id = data.id;
        formData.name = result.name;
        formData.isActive = result.IsNecessary;
  
        dialogRefAddCurrency.componentInstance.submitted = false;
  
        this.assignmentTypeService.updateAssignment(formData).subscribe(
          {
            next: (data: any) => {
  
  
              dialogRefAddCurrency.componentInstance.submitted = true;
  
              dialogRefAddCurrency.close();
  
                
                let succressDialog = this.dialog.open(ToastSuccessComponent, {
                  width: "30vw",
                  data: {
                    title: this.trans.justifications.yourRequestHasBeenSent,
                    message: data.message,
                    buttonSend: this.trans.assignments.typesOfAssignments
    
                  },
                });
                succressDialog.componentInstance.submitted = true;

              this.getAssignments(this.filteration);
  
              setTimeout(() => {
                succressDialog.close();
  
              }, 2000);
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


  dialogAssignmentFile(data: any) {

      
      let dialogRefAddCurrency =  this.dialog.open(DialogAssignmentTypeFileComponent, {
        width: "40vw",
        data: {
          title: this.trans.assignments.assignmentFile
        },
      });
      dialogRefAddCurrency.componentInstance.id = data.id


  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getAssignments(this.filteration)
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
    this.getAssignments(filteration)

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
