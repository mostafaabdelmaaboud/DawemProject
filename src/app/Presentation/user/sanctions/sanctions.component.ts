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
import { ToastrService } from 'ngx-toastr';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SanctionsService } from './services/sanctions.service';
import { AddSanctionComponent } from 'src/app/shared/components/add-sanction/add-sanction.component';
import { DialogSanctionFileComponent } from 'src/app/shared/components/dialog-sanction-file/dialog-sanction-file.component';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-sanctions',
  templateUrl: './sanctions.component.html',
  styleUrls: ['./sanctions.component.scss']
})
export class SanctionsComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  private sanctionsService = inject(SanctionsService);
  columns: any[] = [
    {
      name: "رقم الجزاء",
      field: "code",
    },
    {
      name: "الأسم",
      field: "name",
    },
    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  sanactions: any = [];
  sanactionsIsExport: any = [];
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
        this.sanactions = this.sanactions;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.sanactions = this.sanactions;
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
    this.getInformation();

    this.getSummons(this.filteration);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  getInformation() {
    this.spinnerCards = true;
    this.sanctionsService.getInformation().subscribe({
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
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 30, actionCode: data.actionCode })
  }
  getSummons(filteration: any) {
    this.sanactions = [];
    this.isLoading = true;
    this.sanctionsService.listSanctions(filteration).subscribe(data => {
      data.data.forEach((sanaction: any) => {
        this.sanactions.push({
          id: sanaction.id,
          code: sanaction.code,
          name: sanaction.name,
          isActive: sanaction.isActive
        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;
    })
  }
  addSanction() {
    const dialogRefAddCurrency = this.dialog.open(AddSanctionComponent, {
      width: "70vw",
      data: {
        title: "اضافه جزاء",
        titleFieldDisabled:"الكود",
        setAsActive: "تعيين كنشط",
        titleClose: "تراجع",
        buttonSend: "إضافة جزاء"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editSanction = false;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};

      formData.isActive = result.isActive;
      formData.name = result.name;
      formData.warningMessage = result.warningMessage;
      formData.type = Number(result.type);

      this.sanctionsService.createSanction(formData).subscribe(
        {
          next: data => {
            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.close();
            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "الجزاءات"
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

          }
        }
      )
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  editSanction(data: any)  {
    const dialogRefAddCurrency = this.dialog.open(AddSanctionComponent, {
      width: "70vw",
      data: {
        title: "تعديل الجزاء",
        titleFieldDisabled:"الكود",

        setAsActive: "تعيين كنشط",
        titleClose: "تراجع",
        buttonSend: "حفظ الجزاء"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editSanction = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      formData.id = data.id;
      formData.isActive = result.isActive;
      formData.name = result.name;
      formData.warningMessage = result.warningMessage;
      formData.type = Number(result.type);

      this.sanctionsService.updateSanction(formData).subscribe(
        {
          next: data => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "الجزاءات"
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

          }
        }
      )
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  dialogFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogSanctionFileComponent, {
      width: "40vw",
      data: {
        title: "ملف الجزاء"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id
  }
  enabledRow(data: any) {

    this.sanctionsService.enabledSanction({ sanctionId: data.id }).subscribe(
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
    delete this.filteration.PageNumber;
    this.getSummons(this.filteration);
  }
  exportTableToExcel() {
    let columns = [...this.columns];
    delete columns[2]
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'الجزاءات',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };

    if(!this.isLoading) {
      this.isLoading = true;
      this.sanactionsIsExport = [];
      let filteration = {...this.filteration, isExport:true};
   
      this.sanctionsService.listSanctions(filteration).subscribe(data => {
        data.data.forEach((sanaction: any) => {
          this.sanactionsIsExport.push({
            id: sanaction.id,
            code: sanaction.code,
            name: sanaction.name,
            isActive: sanaction.isActive
          })
        });
        let formatTable = this.sanactionsIsExport.map(sanaction => {
      
          return {
            code: sanaction.code,
            name: sanaction.name
          }
        })
        this.isLoading = false;
        new ngxCsv(formatTable, "sheet", options);
      })
    }  }
  exportTableToPDF() {

    if(!this.isLoading) {
      this.isLoading = true;
      let table: any = document.getElementById("tableSanctionsHidden");
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
        title: "متأكد من تعليق الجزاء؟",
        message: "برجاء توضيح السبب إن أمكن ليظهر للجزاء عند محاولة تسجيل الدخول",
        titleReasonOfRefuse: "سبب التعليق",
        placeholdeReasonOfRefuse: "برجاء كتابة سبب الرفض ليظهر للجزاء",
        titleClose: "تراجع",
        buttonSend: "تعليق الجزاء"
      },
    });
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      this.sanctionsService.disabledSanction({ Id: data.id, DisableReason: result.notes }).subscribe(
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

  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
