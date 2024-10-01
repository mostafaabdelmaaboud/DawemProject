import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PaginationInstance } from 'ngx-pagination';
import { Subscription } from 'rxjs';
import { DefaultLookupsService } from '../services/default-lookups.service';
import { PrimeNGConfig } from 'primeng/api';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import { ActivatedRoute } from '@angular/router';
import { ngxCsv } from 'ngx-csv';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { DialogDeleteComponent } from 'src/app/shared/components/dialog-delete/dialog-delete.component';
import { AddLookupComponent } from '../dialogs/add-lookup/add-lookup.component';
import { LookupFileComponent } from '../dialogs/lookup-file/lookup-file.component';

@Component({
  selector: 'app-departments-default',
  templateUrl: './departments-default.component.html',
  styleUrls: ['./departments-default.component.scss']
})
export class DepartmentsDefaultComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);

  columns: any[] = [
    {
      name: "كود القسم الأفتراضي",
      field: "code",
    },
    {
      name: "اسم القسم الأفتراضي",
      field: "name",
    },
    {
      name: "الحالة",
      field: "isActive"
    },
    {
      name: "الاجراءات",
      field: "actions"
    }

  ];
  lookups: any = [];
  lookupsIsExport: any = [];
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
  private defaultLookupsService = inject(DefaultLookupsService);
  list: any[] = [
    { name: "نسيان تسجيل حضور", key: "1" },
    { name: "نسيان تسجيل انصراف", key: "2" },
    { name: "تسجيل حضور خاطئ", key: "3" },
    { name: "تسجيل انصراف خاطئ", key: "4" }
  ];
  defaultRowPerPage = { name: '5', code: 5 };

  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');
    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.lookups = this.lookups;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.lookups = this.lookups;
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

    this.getLookups(this.filteration);
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
    this.getLookups(this.filteration);
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
      title: 'المسميات الوظيفية',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };

    if(!this.isLoading) {
      this.isLoading = true;
      let filteration = {...this.filteration, isExport:true};
   
      this.defaultLookupsService.getDepartments(filteration).subscribe(
        {
          next: data => {
            this.lookupsIsExport = [];

            data.data.forEach((plan: any) => {
              this.lookupsIsExport.push({
                id: plan.id,
                code: plan.code,
                name: plan.name,
        
                isActive: plan.isActive
  
              })
            });
            let formatTable = this.lookupsIsExport.map(plan => {
      
              return {
                code: plan.code,
                name: plan.name,
                isActive: plan.isActive ? 'نشط' : 'غير نشط'
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
    }
  }
  exportTableToPDF() {
    if(!this.isLoading) {
      this.isLoading = true;
      let table: any = document.getElementById("plansHidden");
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
    this.getLookups(this.filteration);
  }

  getLookups(filteration: any) {
    this.lookups = [];
    this.isLoading = true;
    this.defaultLookupsService.getDepartments(filteration).subscribe(
      {
        next: data => {
          data.data.forEach((lookup: any) => {
            
            this.lookups.push({
              id: lookup.id,
              code: lookup.code,
              name: lookup.name,
              isActive: lookup.isActive

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
  showActions(data: any) {
    if(localStorage.getItem('adminPermissions')) {
      return this.permissionsUserService.checkPermissionAdmin({ type: "actions", screenCode: Number(this.id), actionCode: data.actionCode })

    } else {
      return ""
    }

  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getLookups(this.filteration)
  }
  sendRequest(data: any) {

    this.defaultLookupsService.acceptDepartments({ DepartmentId: data.id }).subscribe(
      {
        next: res => {
          this.getLookups(this.filteration);
          const succressDialog = this.dialog.open(ToastSuccessComponent, {
            width: "30vw",
            data: {
              title: "تم قبول الطلب",
              message: res.message,
              buttonSend: "اغلاق"
            },
          });
          setTimeout(() => {
            succressDialog.close();

          }, 2000);
          succressDialog.componentInstance.submitted = true;
          succressDialog.componentInstance.submitClicked.subscribe(result => {
            succressDialog.close();

          })
        },
        error: err => {

        }
      }
    )

  }

  reasonOfRefuse(data: any) {
    let reasonOfRefuseDialog = this.dialog.open(DialogDeleteComponent, {
        width: "30vw",
        data: {
          title: "هل متأكد من حذف المسمي الوظيفي؟",
          message: "برجاء توضيح السبب إن أمكن",
          titleClose: "تراجع",
          buttonSend: "حذف"
        },
      });


    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      this.defaultLookupsService.deleteDepartments({ DepartmentId: data.id }).subscribe({
        next: res => {
          this.toast.success(res.message);
          reasonOfRefuseDialog.componentInstance.submitted = true;
          reasonOfRefuseDialog.close();
          this.getLookups(this.filteration);
        },
        error: err => {
          reasonOfRefuseDialog.componentInstance.submitted = true;

        }
      })



    })
  }


  requestLookup() {
    const dialogRefAddCurrency = this.dialog.open(AddLookupComponent, {
      width: "50vw",
      data: {
        title: "إضافة القسم الأفتراضي",
        label:"إسم الاجازة",
        setAsNecessary: "تعيين كنشط",
        titleVacationTypeId: "نوع الاسنئذان <span class='color-red'>*</span>",
        titleName: "الأسم<span class='color-red'>*</span>",
        placeholdeName: "برجاء ادخال الأسم",
        validationtitleName: "الأسم مطلوب",
        buttonSend:"إضافة",
        titleClose: "تراجع"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editLookup = false;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
 
      formData.NameTranslations = result.NameTranslations.map(translate => {
        return {
          LanguageId: translate.LanguageId.id, 
          Name: translate.name
        }
      })


      formData.isActive = result.IsActive;

      dialogRefAddCurrency.componentInstance.submitted = false;

      this.defaultLookupsService.createDepartments(formData).subscribe(
        {
          next: (data: any) => {

            
            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الأقسام الأفتراضية"

              },
            });
            this.getLookups(this.filteration);

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
  editLookup(data: any) {
    const dialogRefAddCurrency = this.dialog.open(AddLookupComponent, {
      width: "50vw",
     
      data: {
        title: "تعديل القسم الأفتراضي ",
        label:"إسم الاجازة",
        setAsNecessary: "تعيين كنشط",
        titleVacationTypeId: "نوع الاستئذانات <span class='color-red'>*</span>",
        titleName: "الأسم<span class='color-red'>*</span>",
        placeholdeName: "برجاء ادخال الأسم",
        validationtitleName: "الأسم مطلوب",
        buttonSend:"تعديل",
      titleClose: "تراجع"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editLookup = true;
    dialogRefAddCurrency.componentInstance.typeGetById = 2;
    dialogRefAddCurrency.componentInstance.id = data.id;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      
      formData.id = data.id;
      formData.nameTranslations = result.NameTranslations.map(translate => {
        return {
          Id:translate.id,
          LanguageId: translate.LanguageId.id, 
          Name: translate.name
        }
      })

      formData.isActive = result.IsActive;
      dialogRefAddCurrency.componentInstance.submitted = false;
      this.defaultLookupsService.updateDepartments(formData).subscribe(
        {
          next: (data: any) => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الأقسام الأفتراضية"

              },
            });
            this.getLookups(this.filteration);

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


  dialogLookupFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(LookupFileComponent, {
      width: "40vw",
      data: {
        title: "ملف القسم الأفتراضي",
        codeLabel:"كود القسم الأفتراضي ",
        translationsLabel:"أسماء القسم الأفتراضي",
        nameLabel:"أسم القسم الأفتراضي "
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id;
    dialogRefAddCurrency.componentInstance.infoType =2;


  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getLookups(this.filteration)
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
    this.getLookups(filteration)

  }
  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
