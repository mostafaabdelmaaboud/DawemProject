import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import {  Subject, Subscription, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { DialogUploadFileComponent } from 'src/app/shared/components/uploadFiles/dialog-upload-file/dialog-upload-file.component';
import moment from 'moment';
import { HttpEventType } from '@angular/common/http';
import { DialogUploadFileProgressBarComponent } from 'src/app/shared/components/uploadFiles/dialog-upload-file-progress-bar/dialog-upload-file-progress-bar.component';
import { saveAs } from "file-saver";

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
  defaultRowPerPage = { name: '5', code: 5 };

  columns: any[] = [
    {
      name: "كود المنطقة",
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
  zonesIsExport: any = [];
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
  destroy$: Subject<boolean> = new Subject<boolean>();
  isUploading: boolean = false;
  isCanceling: boolean = false;
  isDialogProgressBarOpen = false;
  dialogRefUploadFiles!: any;
  dialogRefUploadFilesProgressBar!: any;
  barWith: number = 0;
  uploadSub: Subject<boolean> = new Subject();
  loading = false;
  
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
      this.date = new Date();

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

    this.zonesService.GetForDropDownZone({ PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe(res => {
      res?.data?.forEach((jobTitle: any) => {
        this.listDirectManager.push({ name: jobTitle.name, key: jobTitle.id })
      });
    });
    this.translate.get("zones").subscribe(data => {
      this.columns = [
        {
          name: data.areaCode,
          field: "zoneNumber",
        },
        {
          name: data.zoneName,
          field: "zoneName",
        },
        {
          name: data.longitudinalLine,
          field: "Latit"
        },
        {
          name: data.latitudinalLine,
          field: "Long"
        },
        {
          name: data.distance,
          field: "Radius"
        },
        {
          name: data.action,
          field: "actions"
        }
    
      ];
    })
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(dataParent => {
      this.translate.get("zones").subscribe(data => {
        this.columns = [
          {
            name: data.areaCode,
            field: "zoneNumber",
          },
          {
            name: data.zoneName,
            field: "zoneName",
          },
          {
            name: data.longitudinalLine,
            field: "Latit"
          },
          {
            name: data.latitudinalLine,
            field: "Long"
          },
          {
            name: data.distance,
            field: "Radius"
          },
          {
            name: data.action,
            field: "actions"
          }
      
        ];
      })
     
    })
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
    if(!this.isLoading) {
      this.isLoading = true;
      this.zonesIsExport = [];
      let filteration = {...this.filteration, isExport:true};
      this.zonesService.listZones(filteration).subscribe(data => {
        data.data.forEach((zone: any) => {
          this.zonesIsExport.push({
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
        let formatTable = this.zonesIsExport.map(zone => {
          return {
            zoneNumber: zone.zoneNumber,
            zoneName: zone.zoneName,
            Latit: zone.Latit,
            Long: zone.Long,
            Radius: zone.Radius
          }
        })
        this.isLoading = false;
        new ngxCsv(formatTable, "sheet", options);
      })
    }
  }
  exportTableToPDF() {

    if(!this.isLoading) {
      this.isLoading = true;
      let table: any = document.getElementById("tableZonesHidden");
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
    this.getZones(this.filteration);
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
    let dialogRefAddCurrency!:MatDialogRef<AddZoneComponent, any>;
    this.translate.get("zones").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(AddZoneComponent, {
        width: "60vw",
        data: {
          title: translate.addARegion,
          setAsNecessary: translate.setAsActive,
          titleFieldDisabled: translate.employeeCode,
          code: "#001093",
          radiusNumber: translate.distance+" <span class='color-red'>*</span>",
          placeholdeRadius: translate.distance,
          validationtitleRadius: translate.distanceRequired,
          fieldFirst: translate.theNameOfTheZone+" <span class='color-red'>*</span>",
          placeholdefieldFirst: translate.theNameOfTheZone,
          validationtitlefieldFirst: translate.zoneNameIsRequired,
          buttonSend: translate.addARegion,
          titleClose: translate.toRetreat
        },
      });
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
            let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
            this.translate.get("zones").subscribe(translate => {
                succressDialog = this.dialog.open(ToastSuccessComponent, {
                width: "30vw",
                data: {
                  title: translate.yourRequestHasBeenSent,
                  message: data.message,
                  buttonSend: translate.areaRequests
                },
              });
            })
     
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

      this.zonesService.importDataFromExcel(formData).pipe(takeUntil(this.uploadSub)).subscribe(
        {
          next: data => {

            if (data.type === HttpEventType.UploadProgress) {
              this.isUploading = true;

              this.barWith = Math.round(100 / (data.total || 0) * data.loaded);
              if (!this.isDialogProgressBarOpen) {
                this.isDialogProgressBarOpen = true;
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
              this.dialogRefUploadFilesProgressBar.componentInstance.barWithText = "يتم تحميل المف..." + this.barWith + "%";
              this.dialogRefUploadFilesProgressBar.componentInstance.barWidth = this.barWith;
            } else if (data.type === HttpEventType.Response) {
              this.dialogRefUploadFilesProgressBar.componentInstance.barWithText = "تم تحميل الملف بنجاح";
              this.isUploading = false;
              this.isDialogProgressBarOpen = false;
              this.dialogRefUploadFiles.componentInstance.submitted = true;
                  this.dialogRefUploadFilesProgressBar.close();
                  this.dialogRefUploadFiles.close();
                this.toast.success("Successfully upload!", '', {
                  timeOut: 5000,
                  onActivateTick: true
                });  
            }
          },
          error: err => {
            if(err.status === 400) {
              let valuesError = Object.values(err?.error);
              this.dialogRefUploadFiles.componentInstance.errorUploadFileIdCopy = valuesError.join(" , ")
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
    this.zonesService.exportDraft().subscribe( {
      next:data => {
        // let fileName = data.headers.get('content-disposition')?.split(';')[1].split('=')[1];
        // let blob:Blob = data.body as Blob;
        // let a = document.createElement('a');
        // a.download = fileName;
        // a.href = window.URL.createObjectURL(blob);
        // a.click();
        saveAs(data.body, 'zones.docx')
        this.loading = false;


      },
      error:err => {
        this.loading = false;

        this.toast.error(err.message);

      }
    }
      );
  }
  editAnZones(data: any) {
    let dialogRefAddCurrency!:MatDialogRef<AddZoneComponent, any>;
    this.translate.get("zones").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(AddZoneComponent, {
        width: "50vw",
        data: {
          title: translate.editRegion,
          setAsNecessary: translate.setAsActive,
          titleFieldDisabled: translate.employeeCode,
          code: data.code,
          radiusNumber: translate.distance+" <span class='color-red'>*</span>",
          placeholdeRadius: translate.distance,
          validationtitleRadius: translate.distanceRequired,
          fieldFirst: translate.theNameOfTheZone+" <span class='color-red'>*</span>",
          placeholdefieldFirst: translate.theNameOfTheZone,
          validationtitlefieldFirst: translate.zoneNameIsRequired,
          buttonSend: translate.editRegion,
          titleClose: translate.toRetreat
        },
      });
    })
  
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
            let succressDialog!:MatDialogRef<ToastSuccessComponent, any>;
            this.translate.get("zones").subscribe(translate => {
              succressDialog = this.dialog.open(ToastSuccessComponent, {
                width: "30vw",
                data: {
                  title: translate.yourRequestHasBeenSent,
                  message: data.message,
                  buttonSend: translate.areaRequests
                },
              });
            })
     
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
 
  dialogZonesFile(data: any) {
    let dialogRefAddCurrency!:MatDialogRef<DialogZoneFileComponent, any>;
    this.translate.get("zones").subscribe(translate => {
      dialogRefAddCurrency = this.dialog.open(DialogZoneFileComponent, {
        width: "40vw",
        data: {
          title: translate.areaFile
        },
      });
    });

    dialogRefAddCurrency.componentInstance.id = data.id

  }
  reasonOfRefuse(data: any) {
    let reasonOfRefuseDialog!:MatDialogRef<DialogCloseComponent, any>;
    this.translate.get("zones").subscribe(translate => {
        reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
        width: "50vw",
        data: {
          title: translate.makeSureYourRegionsAccountIsSuspended,
          message: translate.pleaseExplainTheReason,
          titleReasonOfRefuse: translate.reasonForComment,
          placeholdeReasonOfRefuse: translate.pleaseWriteTheReasonForRejectionSoThatItAppearsInTheRegion,
          titleClose: translate.toRetreat,
          buttonSend: translate.regionComment
        },
      });
    })

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
  ngOnDestroy() {
    this.destroy$.next(true);
    this.subscription.unsubscribe();
  }
}
