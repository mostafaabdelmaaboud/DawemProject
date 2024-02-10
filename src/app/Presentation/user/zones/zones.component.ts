import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import {  Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { ToastrService } from 'ngx-toastr';
import { ZonesService } from './services/zones.service';
import { AddZoneComponent } from 'src/app/shared/components/add-zone/add-zone.component';
import { DialogZoneFileComponent } from 'src/app/shared/components/dialog-zone-file/dialog-zone-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss']
})
export class ZonesComponent {
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
  listDepratment: any[] = [];
  listSchedules: any[] = [];
  listJobTitle: any[] = [];
  columns: any[] = [
    {
      name: "#",
      field: "zoneNumber",
    },
    {
      name: "اسم الزون",
      field: "zoneName",
    },
    {
      name: "الخط الطولي",
      field: "Latit"
    },
    {
      name: "الخط العرضي",
      field: "Long"
    },
    {
      name: "المسافه",
      field: "Radius"
    },
    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  zones: any = [];

  isLoading = true;
  listDirectManager: any[] = [];

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
  private _mobileQueryListener: () => void;
  private zonesService = inject(ZonesService);
  cards!: any;
  spinnerCards = false;
  constructor(
    private config: PrimeNGConfig, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.zones = this.zones;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.zones = this.zones;

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
      { name: '5', code: 5 },
      { name: '10', code: 10 },
      { name: '25', code: 25 },

    ];

    this.zonesService.GetForDropDownZone({ PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe(res => {
      res?.data?.forEach((jobTitle: any) => {
        this.listDirectManager.push({ name: jobTitle.name, key: jobTitle.id })
      });
    });
    this.getInformation();
    this.getZones(this.filteration);
    this.getListDepartment();
    this.getListSchedules();
    this.getListJobTitle();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

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
      title: 'المناطق',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };
    let formatTable = this.zones.map(zone => {
      
      return {
        zoneNumber: zone.zoneNumber,
        zoneName: zone.zoneName,
        Latit: zone.Latit,
        Long: zone.Long,
        Radius: zone.Radius
      }
    })
    new ngxCsv(formatTable, "sheet", options);
  }
  exportTableToPDF() {
    let table: any = document.getElementById("tableZonesHidden");
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100); 
      pdf.save('ملف_PDF.pdf');
    });
  

  }
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 37, actionCode: data.actionCode })
  }
  getInformation() {
    this.spinnerCards = true;
    this.zonesService.getInformation().subscribe({
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
  mathRound(data: any) {
    return Math.ceil(data)
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
    this.getZones(filteration);
  }
  numberOfRowsPerPage(data: any) {


    this.filteration = { ...this.filteration, PageSize: data.value.code };

    this.getZones(this.filteration)
  }
  getZones(filteration: any) {
    this.zones = [];
    this.isLoading = true;
    this.zonesService.listZones(filteration).subscribe(data => {
      data.data.forEach((zone: any) => {

        this.zones.push({
          id: zone.id,
          code: zone.code,
          isActive: zone.isActive,
          zoneNumber: zone.code,
          zoneName: zone.name,
          Latit: zone.latitude,
          Long: zone.longitude,
          Radius: zone.radius
        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;



    })
  }
  enabledRow(data: any) {

    this.zonesService.enabledZone({ zoneId: data.id }).subscribe(
      {
        next: res => {

          this.toast.success(res.message);
          this.getZones(this.filteration);
        },
        error: err => {

        }
      }
    )
  }
  resetFilteration() {
    this.filterForm.get("FreeText")?.setValue("");
    this.filterForm.get("code")?.setValue("");

    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getZones(this.filteration);
  }
  addAnZones() {
    const dialogRefAddCurrency = this.dialog.open(AddZoneComponent, {
      width: "60vw",
      data: {
        title: "إضافة منطقة",
        setAsNecessary: "تعيين كنشط",
        titleFieldDisabled: "كود الموظف",
        code: "#001093",
        radiusNumber: "المسافه <span class='color-red'>*</span>",
        placeholdeRadius: "المسافه",
        validationtitleRadius: "المسافه مطلوب",
        fieldFirst: "اسم الزون <span class='color-red'>*</span>",
        placeholdefieldFirst: "اسم الزون",
        validationtitlefieldFirst: "اسم الزون مطلوب",
        buttonSend: "إضافة منطقة",
        titleClose: "تراجع"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    // dialogRefAddCurrency.componentInstance.list = this.categories;
    dialogRefAddCurrency.componentInstance.editEmployee = false;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = {};

      formData = {
        name: result.name,
        isActive: result.isActive,
        latitude: result.latitude,
        longitude: result.longitude,
        radius: result.radius,
      }


      dialogRefAddCurrency.componentInstance.submitted = false;


      this.zonesService.createZone(formData).subscribe(
        {
          next: data => {

            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات المناطق"
              },
            });
            this.getZones(this.filteration);

            setTimeout(() => {
              succressDialog.close();

            }, 2000);

            succressDialog.componentInstance.submitted = true;
            succressDialog.componentInstance.submitClicked.subscribe(result => {


              succressDialog.close();

            })

          },
          error: err => {
            dialogRefAddCurrency.close();

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
  getListDepartment() {

    this.zonesService.getDepartmentForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe(data => {


      data?.data?.forEach((jobTitle: any) => {
        this.listDepratment.push({ name: jobTitle.name, key: jobTitle.id })
      });
    })
  }
  getListSchedules() {

    this.zonesService.getScheduleForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe(data => {


      data?.data?.forEach((jobTitle: any) => {
        this.listSchedules.push({ name: jobTitle.name, key: jobTitle.id })
      });
    })
  }
  getListJobTitle() {

    this.zonesService.getJobTitles({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe(data => {


      data?.data?.forEach((jobTitle: any) => {
        this.listJobTitle.push({ name: jobTitle.name, key: jobTitle.id })
      });
    })
  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'JobTitleId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.zonesService.getJobTitles({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listJobTitle = [];
                res?.data?.forEach((jobTitle: any) => {
                  this.listJobTitle.push({ name: jobTitle.name, key: jobTitle.id })
                });
              });
          }

        }
        break;
      case 'DirectManagerId':
        if (data || data === "") {

          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.zonesService.GetForDropDownZone({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe(res => {
                this.listDirectManager = [];
                res?.data?.forEach((jobTitle: any) => {
                  this.listDirectManager.push({ name: jobTitle.name, key: jobTitle.id })
                });

              });

          }


        }

        break;
      case 'DepartmentId':
        if (data || data === "") {

          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.zonesService.getDepartmentForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe(res => {
                this.listDepratment = [];
                res?.data?.forEach((jobTitle: any) => {
                  this.listDepratment.push({ name: jobTitle.name, key: jobTitle.id })
                });

              });

          }

        }
        break;
      case 'ScheduleId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.zonesService.getScheduleForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe(res => {
                this.listSchedules = [];
                res?.data?.forEach((jobTitle: any) => {
                  this.listSchedules.push({ name: jobTitle.name, key: jobTitle.id })
                });
              });

          }
        }

        break;

      default:
        break;
    }
  }
  editAnZones(data: any) {
    const dialogRefAddCurrency = this.dialog.open(AddZoneComponent, {
      width: "50vw",
      data: {
        title: "تعديل المنطقة",
        setAsNecessary: "تعيين كنشط",
        titleFieldDisabled: "كود الموظف",
        code: data.code,

        radiusNumber: "المسافه <span class='color-red'>*</span>",
        placeholdeRadius: "المسافه",
        validationtitleRadius: "المسافه مطلوب",
        fieldFirst: "اسم الزون <span class='color-red'>*</span>",
        placeholdefieldFirst: "اسم الزون",
        validationtitlefieldFirst: "اسم الزون مطلوب",
        buttonSend: "تعديل المنطقة",
        titleClose: "تراجع"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editEmployee = true;

    dialogRefAddCurrency.componentInstance.id = data.id;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = {};

      formData = {
        id: data.id,
        name: result.name,
        isActive: result.isActive,
        latitude: result.latitude,
        longitude: result.longitude,
        radius: result.radius,
      }


      dialogRefAddCurrency.componentInstance.submitted = false;
      this.zonesService.updateZone(formData).subscribe(
        {
          next: data => {

            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.close();
            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات المناطق"
              },
            });
            this.getZones(this.filteration);

            setTimeout(() => {
              succressDialog.close();

            }, 2000);
            succressDialog.componentInstance.submitted = true;
            succressDialog.componentInstance.submitClicked.subscribe(result => {
              succressDialog.close();
            })
          },
          error: err => {
            dialogRefAddCurrency.close();
            dialogRefAddCurrency.componentInstance.submitted = true;

          }
        }
      )
      dialogRefAddCurrency.componentInstance.submitted = false;
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  dialogZonesFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogZoneFileComponent, {
      width: "40vw",
      data: {
        title: "ملف المنطقة"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id

  }
  reasonOfRefuse(data: any) {
    const reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
      width: "50vw",
      data: {
        title: "متأكد من تعليق حساب المنطقة",
        message: "برجاء توضيح السبب إن أمكن ليظهر للمنطقة عند محاولة تسجيل الدخول",
        titleReasonOfRefuse: "سبب التعليق",
        placeholdeReasonOfRefuse: "برجاء كتابة سبب الرفض ليظهر للمنطقة",
        titleClose: "تراجع",
        buttonSend: "تعليق المنطقة"
      },
    });
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      this.zonesService.disabledZone({ id: data.id, disableReason: result.notes }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getZones(this.filteration);
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
    this.getZones(this.filteration)
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
    this.getZones(filteration)
  }
  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
