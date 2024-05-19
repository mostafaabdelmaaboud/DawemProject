import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { DialogDeleteComponent } from 'src/app/shared/components/dialog-delete/dialog-delete.component';
import { RequestJobTitleComponent } from 'src/app/shared/components/request-job-title/request-job-title.component';
import { DialogJobTitleFileComponent } from 'src/app/shared/components/dialog-job-title-file/dialog-job-title-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { DialogResponsibilityFileAdminComponent } from 'src/app/shared/components/dialog-responsibility-file-admin/dialog-responsibility-file-admin.component';
import { RequestResponsibilityAdminComponent } from 'src/app/shared/components/request-responsibility-admin/request-responsibility-admin.component';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { CompaniesService } from './services/companies.service';
import { AddCompanyAdminComponent } from 'src/app/shared/components/add-company-admin/add-company-admin.component';
import { DialogCompanyFileAdminComponent } from 'src/app/shared/components/dialog-company-file-admin/dialog-company-file-admin.component';
import { SignupComponent } from './dialogs/signup/signup.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);

  columns: any[] = [
    {
      name: "كود الشركة",
      field: "code",
    },
    {
      name: "اسم الدولة",
      field: "countryName",
    },
    {
      name:  "اسم الشركة",
      field: "countryNameWidthLogo"
    },
    {
      name: "نوع الاشتراك",
      field: "subscriptionTypeName"
    },
    {
      name: "عدد الموظفين",
      field: "numberOfEmployees"
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
  companies: any = [];
  companiesIsExport: any = [];
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
  listCountires:any[]= [];
  private _mobileQueryListener: () => void;
  private companiesService = inject(CompaniesService);
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
        this.companies = this.companies;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.companies = this.companies;
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
  ngOnInit(): void {
    if (this.mobileQuery.matches) {
      this.opened = true;
    } else {
      this.opened = false;

    }
    this.filterForm = this.fb.group({
      FreeText: [""],
      CountryId: [""],
      SubscriptionType: ["0"],
      NumberOfEmployeesFrom: [""],
      NumberOfEmployeesTo: [""],

    });
    this.categories.push({ name: "adasd", key: "adsas" });
    this.RowsPerPage = [
      { name: '2', code: 2 },
      { name: '5', code: 5 }

    ];
    this.getInformation();

    this.getCompanies(this.filteration);
    this. getCountries();
  }
  filter() {
    Object.entries(this.filterForm?.value).forEach(([key, value]: any) => {
      if (key === "CountryId") {
         if (value != "") {
           this.filteration[key] =value.key
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
     this.getCompanies(this.filteration);
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
      this.companiesIsExport = [];
      let filteration = {...this.filteration, isExport:true};
   
      this.companiesService.getCompanies(filteration).subscribe(
        {
          next: data => {
    
            data.data.forEach((company: any) => {
              this.companiesIsExport.push({
                id: company.id,
              code: company.code,
              countryName: company.countryName,
              countryNameWidthLogo: {
                name: company?.name ? company?.name : "لا يوجد",
                alt: company?.name ? company?.name : "لا يوجد",
                img: company?.logoImagePath ? company?.logoImagePath : "../../../../assets/img/5034901-200.png"
              },
              subscriptionTypeName: company.subscriptionTypeName,
              numberOfEmployees: company.numberOfEmployees,
              isActive: company.isActive ? 'نشط' : 'غير نشط'
  
              })
            });
            let formatTable = this.companiesIsExport.map(company => {
      
              return {
                id: company.id,
                code: company.code,
                countryName: company.countryName,
                countryNameWidthLogo: company.countryNameWidthLogo,
                subscriptionTypeName: company.subscriptionTypeName,
                numberOfEmployees: company.numberOfEmployees,
                isActive: company.isActive
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
      let table: any = document.getElementById("companiesHidden");
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
  this.filterForm.get("SubscriptionType")?.setValue("0");

    
    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getCompanies(this.filteration);
  }
  getInformation() {
    this.spinnerCards = true;
    this.companiesService.getInformation().subscribe({
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
  getCountries() {
    this.companiesService.GetCountries({PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe(data => {
      data?.data?.forEach((country: any) => {
        this.listCountires.push({ name: country.name, key: country.id })
      });
    })
  }
  lastSearchQuery = "";
  searchDropdown(data: any, type: string) {
    switch (type) {
      case 'CountryId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.companiesService.GetCountries({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listCountires = [];
                this.lastSearchQuery = "";

                res?.data?.forEach((country: any) => {
                  this.listCountires.push({ name: country.name, key: country.id })
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
  getCompanies(filteration: any) {
    this.companies = [];
    this.isLoading = true;
    this.companiesService.getCompanies(filteration).subscribe(
      {
        next: data => {

 
          data.data.forEach((company: any) => {
            
            this.companies.push({
              id: company.id,
              code: company.code,
              countryName: company.countryName,
              countryNameWidthLogo: {
                name: company?.name ? company?.name : "لا يوجد",
                alt: company?.name ? company?.name : "لا يوجد",
                img: company?.logoImagePath ? company?.logoImagePath : "../../../../assets/img/5034901-200.png"
              },
              subscriptionTypeName: company.subscriptionTypeName,
              numberOfEmployees: company.numberOfEmployees,
              isActive: company.isActive ? 'نشط' : 'غير نشط'

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
    return this.permissionsUserService.checkPermissionAdmin({ type: "actions", screenCode: 17, actionCode: data.actionCode })
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getCompanies(this.filteration)
  }
  sendRequest(data: any) {

    this.companiesService.accept({ companyId: data.id }).subscribe(
      {
        next: res => {
          this.getCompanies(this.filteration);
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

    let reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
      width: "30vw",
      data: {
        title: "هل متأكد من رفض الشركة؟",
        message: "برجاء توضيح السبب إن أمكن",
        titleReasonOfRefuse:"سبب الرفض",
        placeholdeReasonOfRefuse: "برجاء كتابة سبب الرفض",
        titleClose:"تراجع",
        buttonSend: "رفض الشركة"
      },
    });

    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      reasonOfRefuseDialog.componentInstance.submitted = false;


      this.companiesService.companyDisable({ id: data.id, disableReason: result.notes }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getCompanies(this.filteration);
            reasonOfRefuseDialog.close();
          },
          error: err => {
            reasonOfRefuseDialog.componentInstance.submitted = true;

          }
        }
      )
    })
  }

  requestCompanies() {
    const dialogRefAddCurrency = this.dialog.open(AddCompanyAdminComponent, {
      width: "95vw",
      maxWidth:"95vw",
      data: {
        title: "إضافة شركة",
        setAsNecessary: "تعيين كضرورية",
        titleVacationTypeId: "نوع الاسنئذان <span class='color-red'>*</span>",
        titleName: "الأسم<span class='color-red'>*</span>",
        placeholdeName: "برجاء ادخال الأسم",
        validationtitleName: "الأسم مطلوب",
        buttonSend: "ارسال",
        titleClose:"تراجع"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editCompany = false;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {

      // let formData: any = {};
      // formData.name = result.name;
      // formData.isActive = result.IsNecessary;

      // dialogRefAddCurrency.componentInstance.submitted = false;

      // this.companiesService.createResponsibility(formData).subscribe(
      //   {
      //     next: (data: any) => {


      //       dialogRefAddCurrency.componentInstance.submitted = true;

      //       dialogRefAddCurrency.close();

      //       const succressDialog = this.dialog.open(ToastSuccessComponent, {
      //         width: "30vw",
      //         data: {
      //           title: "تم ارسال طلبك",
      //           message: data.message,
      //           buttonSend: "طلبات المسؤوليات"

      //         },
      //       });
      //       this.getCompanies(this.filteration);

      //       setTimeout(() => {
      //         succressDialog.close();

      //       }, 2000);
      //       succressDialog.componentInstance.submitted = true;
      //       succressDialog.componentInstance.submitClicked.subscribe(result => {
      //         succressDialog.close();
      //       })

      //     },
      //     error: (err: any) => {

      //       dialogRefAddCurrency.componentInstance.submitted = true;

      //     }
      //   }
      // )
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {
        this.getCompanies(this.filteration);

      }
    });
  }
  createCompany() {
    const dialogRefAddCurrency = this.dialog.open(SignupComponent, {
      width: "80vw",
      maxWidth: "80vw",

      data: {
        title: "تسجيل  شركة",
        setAsNecessary: "تعيين كنشط",
        titleVacationTypeId: "نوع الاسنئذان <span class='color-red'>*</span>",
        titleName: "الأسم<span class='color-red'>*</span>",
        placeholdeName: "برجاء ادخال الأسم",
        validationtitleName: "الأسم مطلوب",
        buttonSend:"تسجيل  شركة",
        titleClose: "تراجع"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editPlane = false;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      dialogRefAddCurrency.componentInstance.loading = true;
      
      this.companiesService.signup(result).subscribe(
        {
          next: (data: any) => {

            
            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الشركات"

              },
            });
            // this.getPlans(this.filteration);

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
      // let formData: any = {};
      // formData.NameTranslations = result.NameTranslations.map(translate => {
      //   return {
      //     LanguageId: translate.LanguageId.id, 
      //     Name: translate.name
      //   }
      // })
      // formData.MinNumberOfEmployees = result.MinNumberOfEmployees;

      // formData.MaxNumberOfEmployees = result.MaxNumberOfEmployees;

      // formData.IsActive = result.IsActive;
      // formData.IsTrial = result.IsTrial;
      // formData.EmployeeCost = result.EmployeeCost;
      // formData.Notes = result.Notes;

      // dialogRefAddCurrency.componentInstance.submitted = false;

      // this.plansService.createPlane(formData).subscribe(
      //   {
      //     next: (data: any) => {

            
      //       dialogRefAddCurrency.componentInstance.submitted = true;

      //       dialogRefAddCurrency.close();

      //       const succressDialog = this.dialog.open(ToastSuccessComponent, {
      //         width: "30vw",
      //         data: {
      //           title: "تم ارسال طلبك",
      //           message: data.message,
      //           buttonSend: "طلبات الخطط"

      //         },
      //       });
      //       this.getPlans(this.filteration);

      //       setTimeout(() => {
      //         succressDialog.close();

      //       }, 2000);
      //       succressDialog.componentInstance.submitted = true;
      //       succressDialog.componentInstance.submitClicked.subscribe(result => {
      //         succressDialog.close();
      //       })

      //     },
      //     error: (err: any) => {
            

      //       dialogRefAddCurrency.componentInstance.submitted = true;

      //     }
      //   }
      // )
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  editCompanies(data: any) {
    const dialogRefAddCurrency = this.dialog.open(AddCompanyAdminComponent, {
      width: "95vw",
      maxWidth:"95vw",
      data: {
        title: "تعديل الشركة",
        setAsNecessary: "تعيين كضرورية",
        titleVacationTypeId: "نوع الاستئذانات <span class='color-red'>*</span>",
        titleName: "الأسم<span class='color-red'>*</span>",
        placeholdeName: "برجاء ادخال الأسم",
        validationtitleName: "الأسم مطلوب",
        buttonSend: "ارسال",
        titleClose:"تراجع"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editCompany = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      formData.id = data.id;
      formData.name = result.name;
      formData.isActive = result.IsNecessary;

      dialogRefAddCurrency.componentInstance.submitted = false;

      this.companiesService.updateResponsibility(formData).subscribe(
        {
          next: (data: any) => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات المسؤوليات"

              },
            });
            this.getCompanies(this.filteration);

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
        this.getCompanies(this.filteration);

      }
    });
  }


  dialogCompanyFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogCompanyFileAdminComponent, {
      width: "80vw",
      maxWidth:"80vw",
      data: {
        title: "ملف الشركة"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id

  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getCompanies(this.filteration)
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
    this.getCompanies(filteration)

  }
  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
