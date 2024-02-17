import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { DialogAddASectionComponent } from 'src/app/shared/components/dialog-add-a-section/dialog-add-a-section.component';
import { DeleteShiftComponent } from 'src/app/shared/components/delete-shift/delete-shift.component';
import { SectionsService } from './services/sections.service';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { ToastrService } from 'ngx-toastr';
import { DialogSectionFileComponent } from 'src/app/shared/components/dialog-section-file/dialog-section-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})
export class SectionsComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  private sectionsService = inject(SectionsService);


  columns: any[] = [
    {
      name: "كود القسم",
      field: "orderNumber",
    },
    {
      name: "اسم القسم",
      field: "departmentName",
    },
    {
      name: "رئيس القسم",
      field: "headOfDepartment",
    },
    {
      name: "عدد الموظفين بالقسم",
      field: "numberOfEmployeesInDepartment"
    },


    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  sections: any = [];

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
  defaultRowPerPage = { name: '5', code: 5 };

  totalItems: number = 0;
  first: number = 0;
  rows: number = 10;
  RowsPerPage!: any[];
  mobileQuery: MediaQueryList;
  opened = false;
  cards!: any;
  spinnerCards = false;
  private _mobileQueryListener: () => void;
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.sections = this.sections;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.sections = this.sections;

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
      code: [""],

    });
    this.categories.push({ name: "adasd", key: "adsas" });
    this.RowsPerPage = [
      { name: '2', code: 2 },
      { name: '5', code: 5 }
    ];

    this.sections = [
    ];
    this.getInformation();

    this.getSection(this.filteration)
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  getInformation() {
    this.spinnerCards = true;
    this.sectionsService.getInformation().subscribe({
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
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 2, actionCode: data.actionCode })
  }
  dialogSectionFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogSectionFileComponent, {
      width: "40vw",
      data: {
        title: "ملف القسم"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id

  }
  filter() {
    let filteration = { ...this.filteration }
    Object.entries(this.filterForm?.value).forEach(([key, value]: any) => {
      if (typeof value  === 'string') {
        if(value != "") {
          filteration[key] = value.trim();
        }
      } else {
        if(value >=0) {
          filteration[key] = value;

        }

      }
    })
    this.getSection(filteration);
  }
  exportTableToExcel() {
    let columns = [...this.columns];
    delete columns[4]
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'الأقسام',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };
    let formatTable = this.sections.map(section => {
      
      return {
        orderNumber: section.orderNumber,
        departmentName: section.departmentName,
        headOfDepartment: section.headOfDepartment.name,
        numberOfEmployeesInDepartment: section.numberOfEmployeesInDepartment
      }
    })
    new ngxCsv(formatTable, "sheet", options);
  }
  exportTableToPDF() {
    let table: any = document.getElementById("tableSectionsHidden");
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100); 
      pdf.save('ملف_PDF.pdf');
    });
  

  }
  resetFilteration() {
    this.filterForm.get("FreeText")?.setValue("");
    this.filterForm.get("code")?.setValue("");

    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getSection(this.filteration);
  }
  getSection(filteration: any) {
    this.sections = [];
    this.isLoading = true;
    this.sectionsService.listSections(filteration).subscribe(
      {
        next: data => {

          data.data.forEach((section: any) => {

            this.sections.push({
              id: section.id,
              isActive: section.isActive,
              orderNumber: section?.code ? section?.code : "لا يوجد",
              departmentName: section?.name ? section?.name : "لا يوجد",
              headOfDepartment: {
                name: section?.manager?.managerName ? section?.manager?.managerName : "لا يوجد",
                alt: section?.manager?.managerName ? section?.manager?.managerName : "لا",
                img: section?.manager?.profileImagePath ? section?.manager?.profileImagePath : "../../../../assets/img/5034901-200.png"
              },
              numberOfEmployeesInDepartment: section?.numberOfEmployees ? section?.numberOfEmployees : "0"
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
  addSection() {
    const dialogRefAddCurrency = this.dialog.open(DialogAddASectionComponent, {
      width: "80vw",
      data: {
        title: "إضافة قسم",

        titleShift: "اسم القسم <span class='color-red'>*</span>",
        placeholdeShift: "اسم القسم",
        validationtitleShift: "اسم القسم مطلوب",
        setAsNecessary: "تعيين كنشط",
        titlePermanentType: "رئيس القسم <span class='color-red'>*</span>",
        placeholderPermanentType: " اختار رئيس القسم",
        validationtitlePermanentType: "رئيس القسم مطلوب",
        titleManagerId: "الموظف <span class='color-red'>*</span>",
        placeholderManagerId: "الموظف",
        validationtitleManagerId: "الموظف مطلوب",
        managerDelegatorIds: "نواب رئيس القسم <span class='color-red'>*</span>",
        placeholdemanagerDelegatorIds: "نواب رئيس القسم",
        ValidationManagerDelegatorIds: "نواب رئيس القسم مطلوب",
        titleZone: "المناطق <span class='color-red'>*</span>",
        placeholderZone: "المناطق",
        titleNotes: "الملاحظات <span class='color-red'>*</span>",
        placeholdeNotes: "الملاحظات",
        validationtitleNotes: "الملاحظات مطلوبه",
        validationtitleZone: "المناطق مطلوبه",
        titleClose: "تراجع",
        buttonSend: "إضافة قسم"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editSection = false;

    // dialogRefAddCurrency.componentInstance.list = this.categories;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};

      formData.name = result.name;
      formData.isActive = result.isActive;
      formData.parentId = result.parentId.key;
      formData.managerId = result.managerId.key;

      formData.managerDelegatorIds = [];
      formData.zoneIds = [];
      formData.notes = result.notes;

      if (result?.managerDelegatorIds?.length > 0) {
        result?.managerDelegatorIds?.forEach((direct: any) => {
          formData.managerDelegatorIds.push(direct.key);
        });
      }
      if (result?.zoneIds?.length > 0) {
        result?.zoneIds?.forEach((direct: any) => {
          formData.zoneIds.push(direct.key);
        });
      }

      this.sectionsService.createSection(formData).subscribe(
        {
          next: data => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الاقسام"
              },
            });
            this.getSection(this.filteration);
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

          }
        }
      )
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  editSection(data: any) {

    const dialogRefAddCurrency = this.dialog.open(DialogAddASectionComponent, {
      width: "80vw",
      data: {
        title: "تعديل قسم",
        titleFieldDisabled: "كود القسم",
        code: data.orderNumber,

        titleShift: "اسم القسم <span class='color-red'>*</span>",
        placeholdeShift: "اسم القسم",
        validationtitleShift: "اسم القسم مطلوب",
        setAsNecessary: "تعيين كنشط",

        titlePermanentType: "رئيس القسم <span class='color-red'>*</span>",
        placeholderPermanentType: " اختار رئيس القسم",
        validationtitlePermanentType: "رئيس القسم مطلوب",
        titleManagerId: "الموظف <span class='color-red'>*</span>",
        placeholderManagerId: "الموظف",
        validationtitleManagerId: "الموظف مطلوب",
        managerDelegatorIds: "نواب رئيس القسم <span class='color-red'>*</span>",
        placeholdemanagerDelegatorIds: "نواب رئيس القسم",
        ValidationManagerDelegatorIds: "نواب رئيس القسم مطلوب",
        titleZone: "المناطق <span class='color-red'>*</span>",
        placeholderZone: "المناطق",
        titleNotes: "الملاحظات <span class='color-red'>*</span>",
        placeholdeNotes: "الملاحظات",
        validationtitleNotes: "الملاحظات مطلوبه",
        validationtitleZone: "المناطق مطلوبه",
        titleClose: "تراجع",
        buttonSend: "حفظ القسم"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editSection = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    // dialogRefAddCurrency.componentInstance.list = this.categories;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      formData.id = data.id;

      formData.name = result.name;
      formData.isActive = result.isActive;
      formData.parentId = result.parentId.key;
      formData.managerId = result.managerId.key;

      formData.managerDelegatorIds = [];
      formData.zoneIds = [];
      formData.notes = result.notes;
      if (result?.managerDelegatorIds?.length > 0) {
        result?.managerDelegatorIds?.forEach((direct: any) => {
          formData.managerDelegatorIds.push(direct.key);
        });
      }
      if (result?.zoneIds?.length > 0) {
        result?.zoneIds?.forEach((direct: any) => {
          formData.zoneIds.push(direct.key);
        });
      }

      this.sectionsService.updateSection(formData).subscribe(
        {
          next: data => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الاقسام"
              },
            });
            this.getSection(this.filteration);
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
    const reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
      width: "30vw",
      data: {
        title: "متأكد من تعليق حساب القسم",
        message: "برجاء توضيح السبب إن أمكن ليظهر للقسم عند محاولة تسجيل الدخول",
        titleReasonOfRefuse: "سبب التعليق",
        placeholdeReasonOfRefuse: "برجاء كتابة سبب الرفض ليظهر للقسم",
        titleClose: "تراجع",
        buttonSend: "تعليق القسم"
      },
    });
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      this.sectionsService.disabledSection({ id: data.id, DisableReason: result.notes }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getSection(this.filteration);
            reasonOfRefuseDialog.close();
          },
          error: err => {
            reasonOfRefuseDialog.componentInstance.submitted = true;

          }
        }
      )

    })
  }
  enabledRow(data: any) {

    this.sectionsService.enableSection({ departmentId: data.id }).subscribe(
      {
        next: res => {

          this.toast.success(res.message);
          this.getSection(this.filteration);
        },
        error: err => {

        }
      }
    )
  }
  deleteRow() {
    const reasonOfRefuseDialog = this.dialog.open(DeleteShiftComponent, {
      width: "30vw",
      data: {
        title: "متأكد من حذف القسم؟",
        message: "لا يمكن الرجوع في في هذا الأمر",

        titleClose: "تراجع",
        buttonSend: "حذف"
      },
    });
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.close();

    })
  }
  onPageChange(event: any) {

    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getSection(this.filteration)
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

    this.filteration.PageNumber = even;
    let filteration = { ...this.filteration, PageNumber: even - 1 };
    this.getSection(filteration)

  }
  numberOfRowsPerPage(data: any) {

    this.filteration = { ...this.filteration, PageSize: data.value.code };

    this.getSection(this.filteration)
  }
  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
