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
import { FingerPrintDevicesService } from './services/finger-print-devices.service';
import { AddFingerPrintDeviceComponent } from 'src/app/shared/components/add-finger-print-device/add-finger-print-device.component';
import { DialogFingerPrintDeviceFileComponent } from 'src/app/shared/components/dialog-finger-print-device-file/dialog-finger-print-device-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-finger-print-devices',
  templateUrl: './finger-print-devices.component.html',
  styleUrls: ['./finger-print-devices.component.scss']
})
export class FingerPrintDevicesComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  private fingerPrintDevicesService = inject(FingerPrintDevicesService);


  columns: any[] = [
    {
      name: "رقم الجهاز",
      field: "code",
    },


    {
      name: "اسم الجهاز",
      field: "name",
    },
    {
      name: "عنوان ال IP",
      field: "ipAddress",
    },
    {
      name: "رقم البورت",
      field: "portNumber"
    },
    {
      name: "الموديل",
      field: "model"
    },
    {
      name: "الرقم التسلسلي",
      field: "serialNumber"
    },
    {
      name: "الإجراء",
      field: "actions"
    }

  ];

  fingerPrintDevices: any = [];

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
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.fingerPrintDevices = this.fingerPrintDevices;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.fingerPrintDevices = this.fingerPrintDevices;

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
    this.getInformation();

    this.getFingerprintDevices(this.filteration);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  filter() {
    let filteration = { ...this.filteration }
    Object.entries(this.filterForm?.value).forEach(([key, value]: any) => {
      if (typeof value  === 'string') {
        filteration[key] = value.trim();
      } else {
        filteration[key] = value;

      }
    })
    this.getFingerprintDevices(filteration);
  }
  exportTableToExcel() {
    let data = document.getElementById("tableFingerPrintDevicesHidden");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ExcelSheet.xlsx');
  }
  exportTableToPDF() {
    let table: any = document.getElementById("tableFingerPrintDevicesHidden");
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 80); 
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
    this.getFingerprintDevices(this.filteration);
  }
  getInformation() {
    this.spinnerCards = true;
    this.fingerPrintDevicesService.getInformation().subscribe({
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
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 13, actionCode: data.actionCode })
  }
  getFingerprintDevices(filteration: any) {
    this.fingerPrintDevices = [];
    this.isLoading = true;
    this.fingerPrintDevicesService.listFingerprintDevices(filteration).subscribe(data => {
      data.data.forEach((fingerPrintDevice: any) => {
        this.fingerPrintDevices.push({
          id: fingerPrintDevice.id,
          code: fingerPrintDevice.code,
          name: fingerPrintDevice.name,
          ipAddress: fingerPrintDevice.ipAddress,
          portNumber: fingerPrintDevice.portNumber,
          model: fingerPrintDevice.model,
          serialNumber: fingerPrintDevice.serialNumber,
          isActive: fingerPrintDevice.isActive
        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;

    })
  }
  addFingerprintDevice() {
    const dialogRefAddCurrency = this.dialog.open(AddFingerPrintDeviceComponent, {
      width: "70vw",
      data: {
        title: "اضافه جهاز بصمة",
        setAsActive: "تعيين كنشط",

        titleName: "اسم الجهاز <span class= 'color-red' >* </span>",
        placeholdeName: "اسم الجهاز",
        ValidationName: "اسم الجهاز مطلوب",


        titleIpAddress: "عنوان ال IP <span class='color-red'>*</span>",
        placeholdeIpAddress: "عنوان ال IP",
        ValidationIpAddress: "عنوان ال IP مطلوب",


        titlePortNumber: "رقم البورت <span class='color-red'>*</span>",
        placeholdePortNumber: "رقم البورت",
        ValidationPortNumber: "رقم البورت مطلوب",

        titleModel: "الموديل <span class='color-red'>*</span>",
        placeholderModel: "اختار الموديل",
        validationModel: "الموديل مطلوب",

        titleSerialNumber: "الرقم التسلسلي <span class='color-red'>*</span>",
        placeholdeSerialNumber: "الرقم التسلسلي",
        ValidationSerialNumber: "الرقم التسلسلي مطلوب",
        titleClose: "تراجع",
        buttonSend: "إضافة جهاز بصمة"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editFingerPrintDevice = false;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      formData.isActive = result.isActive;
      formData.name = result.name;
      formData.IpAddress = result.IpAddress;
      formData.PortNumber = result.PortNumber
      formData.Model = result.Model
      formData.SerialNumber = result.SerialNumber
      this.fingerPrintDevicesService.createFingerprintDevice(formData).subscribe(
        {
          next: data => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات اجهزة البصمة"
              },
            });
            this.getFingerprintDevices(this.filteration);
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
  editFingerprintDevice(data: any) {
    const dialogRefAddCurrency = this.dialog.open(AddFingerPrintDeviceComponent, {
      width: "70vw",
      data: {
        title: "تعديل جهاز بصمة",
        setAsActive: "تعيين كنشط",

        titleName: "اسم الجهاز <span class= 'color-red' >* </span>",
        placeholdeName: "اسم الجهاز",
        ValidationName: "اسم الجهاز مطلوب",


        titleIpAddress: "عنوان ال IP <span class='color-red'>*</span>",
        placeholdeIpAddress: "عنوان ال IP",
        ValidationIpAddress: "عنوان ال IP مطلوب",


        titlePortNumber: "رقم البورت <span class='color-red'>*</span>",
        placeholdePortNumber: "رقم البورت",
        ValidationPortNumber: "رقم البورت مطلوب",

        titleModel: "الموديل <span class='color-red'>*</span>",
        placeholderModel: "اختار الموديل",
        validationModel: "الموديل مطلوب",

        titleSerialNumber: "الرقم التسلسلي <span class='color-red'>*</span>",
        placeholdeSerialNumber: "الرقم التسلسلي",
        ValidationSerialNumber: "الرقم التسلسلي مطلوب",
        titleClose: "تراجع",
        buttonSend: "تعديل جهاز بصمة"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editFingerPrintDevice = true;

    dialogRefAddCurrency.componentInstance.id = data.id;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};
      formData.id = data.id;
      formData.isActive = result.isActive;
      formData.name = result.name;
      formData.IpAddress = result.IpAddress;
      formData.PortNumber = result.PortNumber
      formData.Model = result.Model
      formData.SerialNumber = result.SerialNumber
      this.fingerPrintDevicesService.updateFingerprintDevice(formData).subscribe(
        {
          next: data => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات اجهزة البصمة"
              },
            });
            this.getFingerprintDevices(this.filteration);
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
  dialogFingerPrintDeviceFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogFingerPrintDeviceFileComponent, {
      width: "40vw",
      data: {
        title: "ملف جهاز البصمة"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id
  }
  enabledRow(data: any) {

    this.fingerPrintDevicesService.enabledFingerprintDevice({ fingerprintDeviceId: data.id }).subscribe(
      {
        next: res => {

          this.toast.success(res.message);
          this.getFingerprintDevices(this.filteration);
        },
        error: err => {

        }
      }
    )
  }

  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getFingerprintDevices(this.filteration)
  }
  deleteRow(data: any) {
    const reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
      width: "30vw",
      data: {
        title: "متأكد من تعليق جهاز البصمة؟",
        message: "برجاء توضيح السبب إن أمكن ليظهر للمجموعة عند محاولة تسجيل الدخول",
        titleReasonOfRefuse: "سبب التعليق",
        placeholdeReasonOfRefuse: "برجاء كتابة سبب الرفض ليظهر للمجموعة",
        titleClose: "تراجع",
        buttonSend: "تعليق المجموعة"
      },
    });
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      this.fingerPrintDevicesService.disabledFingerprintDevice({ Id: data.id, DisableReason: result.notes }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getFingerprintDevices(this.filteration);
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
    this.getFingerprintDevices(this.filteration)
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
