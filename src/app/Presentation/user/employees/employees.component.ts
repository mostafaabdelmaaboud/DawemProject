import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogAddAnEmployeeComponent } from 'src/app/shared/components/dialog-add-an-employee/dialog-add-an-employee.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { DialogEmployeeFileComponent } from 'src/app/shared/components/dialog-employee-file/dialog-employee-file.component';
import { EmployeesService } from './services/employees.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ActivatedRoute } from '@angular/router';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent {
  
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);

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
      name: "رقم الموظف",
      field: "orderNumber",
    },
    {
      name: "اسم الموظف",
      field: "employeeName",
    },
    {
      name: "القسم",
      field: "section"
    },
    {
      name: "تاريخ الالتحاق",
      field: "joiningDate"
    },
    {
      name: "رصيد الاجازات",
      field: "vacationsBalance"
    },
    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  employees: any = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

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
  private employeesService = inject(EmployeesService);
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
        this.employees = this.employees;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.employees = this.employees;

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
      DirectManagerId:[""],
      JobTitleId:[""],
      DepartmentId:[""],
      ScheduleId:[""]
    });
    this.categories.push({ name: "adasd", key: "adsas" });
    this.RowsPerPage = [
      { name: '2', code: 2 },
      { name: '5', code: 5 }

    ];
    this.translate.get("employees").subscribe(data => {
      this.columns = [
        {
          name: data.employeeNumber,
          field: "orderNumber",
        },
        {
          name: data.employeeName,
          field: "employeeName",
        },
        {
          name: data.section,
          field: "section"
        },
        {
          name: data.joiningDate,
          field: "joiningDate"
        },
        {
          name: data.vacationsBalance,
          field: "vacationsBalance"
        },
        {
          name: data.action,
          field: "actions"
        }
    
      ];
    })
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(dataParent => {
      this.translate.get("employees").subscribe(data => {
        this.columns = [
          {
            name: data.employeeNumber,
            field: "orderNumber",
          },
          {
            name: data.employeeName,
            field: "employeeName",
          },
          {
            name: data.section,
            field: "section"
          },
          {
            name: data.joiningDate,
            field: "joiningDate"
          },
          {
            name: data.vacationsBalance,
            field: "vacationsBalance"
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
    this.employeesService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe(res => {
      res?.data?.forEach((jobTitle: any) => {
        this.listDirectManager.push({ name: jobTitle.name, key: jobTitle.id })
      });
    })
    this.getInformation();

    this.getListDepartment();
    this.getListSchedules();
    this.getListJobTitle();
    if (this.route.snapshot.queryParamMap.get("Status")) {
      let status = this.route.snapshot.queryParamMap.get("Status") as string;
      this.filteration.Status = status;
      this.getEmployees(this.filteration);

    } else {
      this.getEmployees(this.filteration);

    }
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  getInformation() {
    this.spinnerCards = true;
    this.employeesService.getInformation().subscribe({
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
  
  exportTableToExcel() {
    let columns = [...this.columns];
    delete columns[5]

    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'الموظفين',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };
 
    let formatTable = this.employees.map(employee => {
      return {
        orderNumber: employee.orderNumber,
        employeeName: employee.employeeName.name,
        section: employee.section,
        joiningDate: employee.joiningDate,

        vacationsBalance: employee.vacationsBalance

      }
    })

    new ngxCsv(formatTable, "sheet", options);
  }
  exportTableToPDF() {
    let table: any = document.getElementById("tableEmployeesHidden");
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100); 
      pdf.save('ملف_PDF.pdf');
    });
  

  }
  filter() {
    let filteration = { ...this.filteration }


    Object.entries(this.filterForm?.value).forEach(([key, value]: any) => {
      if (key === "DepartmentId") {
        if (value != "") {
          filteration[key] = value.key
        }
      } else if (key === "JobTitleId") {
        if (value != "") {
          filteration[key] = value.key
        }
      } else if (key === "ScheduleId") {
        if (value != "") {
          filteration[key] = value.key
        }
      } else if (key === "DirectManagerId") {
        if (value != "") {
          filteration[key] = value.key
        }
      } else {
        if (typeof value  === 'string') {
          if(value != "") {
            filteration[key] = value.trim();
          }
        } else {
          if(value >=0) {
            filteration[key] = value;
  
          }
  
        }
      }

    })

    this.getEmployees(filteration);

  }
  numberOfRowsPerPage(data: any) {


    this.filteration = { ...this.filteration, PageSize: data.value.code };

    this.getEmployees(this.filteration)
  }
  getEmployees(filteration: any) {
    this.employees = [];
    this.isLoading = true;
    this.employeesService.listEmployees(filteration).subscribe(data => {

      data.data.forEach((employee: any) => {

        this.employees.push({
          id: employee.id,
          orderNumber: employee.employeeNumber,
          isActive: employee.isActive,
          code:employee.code,
          employeeName: {
            name: employee?.name ? employee?.name : "لا يوجد",
            alt: employee?.name ? employee?.name : "لا يوجد",
            img: employee?.profileImagePath ? employee?.profileImagePath : "../../../../assets/img/5034901-200.png"
          },
          section: employee?.dapartmentName ? employee?.dapartmentName : "لا يوجد",
          joiningDate: employee?.joiningDate ? moment(employee.joiningDate).format("DD/MM/YYYY") : "لا يوجد",
          vacationsBalance: employee?.annualVacationBalance ? employee.annualVacationBalance : "0"
        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;



    })
  }
  enabledRow(data: any) {

    this.employeesService.enabledEmployee({ employeeId: data.id }).subscribe(
      {
        next: res => {

          this.toast.success(res.message);
          this.getEmployees(this.filteration);
        },
        error: err => {

        }
      }
    )
  }
  resetFilteration() {
    this.filterForm.get("FreeText")?.setValue("");
    this.filterForm.get("code")?.setValue("");
    this.filterForm.get("DirectManagerId")?.setValue("");
    this.filterForm.get("JobTitleId")?.setValue("");
    this.filterForm.get("DepartmentId")?.setValue("");
    this.filterForm.get("ScheduleId")?.setValue("");
    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getEmployees(this.filteration);
  }
  addAnEmployee() {
    let dialogRefAddCurrency!:MatDialogRef<DialogAddAnEmployeeComponent, any>;
    this.translate.get("employees").subscribe(data => {
      dialogRefAddCurrency = this.dialog.open(DialogAddAnEmployeeComponent, {
        width: "50vw",
        data: {
          title: data.addAnEmployee,
          setAsNecessary: data.setAsActive,
          labelRadioButtonFirst: data.performanceType,
          firstRadio: data.fullTime,
          secondRadio: data.partTime,
          thirdRadio: data.freeTimeShift,
          titleFieldDisabled: data.employeeCode,
          code: "#001093",
          JobNumber: data.jobNumber + " <span class='color-red'>*</span>",
          placeholdeJobNumber: data.jobNumber,
          validationtitleJobNumber:  data.jobNumberRequired,
          directManager: data.directManager+" <span class='color-red'>*</span>",
          placeholdeDirectManager: data.directManager,
          validationtitleDirectManager: data.directManagerRequired,
          email: data.email+" <span class='color-red'>*</span>",
          placeholdeEmail: data.email,
          validationtitleEmail: data.emailRequired,
          validationtitleEmailPattern: data.invalidEmail,
  
          address: data.theAddress +" <span class='color-red'>*</span>",
          placeholdeAddress: data.theAddress,
          validationtitleAddress: data.addressRequired,
          mobileNumber: data.phoneNumber + " <span class='color-red'>*</span>",
          placeholdeMobileNumber: data.phoneNumber,
          validationtitleMobileNumber: data.phoneNumberRequired,
          titleWorkSchedule: data.workSchedule + " <span class='color-red'>*</span>",
          placeholderWorkSchedule: data.chooseYourWorkSchedule,
          validationtitleWorkSchedule: data.workScheduleRequired,
          fieldFirst: data.employeeName +" <span class='color-red'>*</span>",
          placeholdefieldFirst: data.employeeName,
          validationtitlefieldFirst: data.employeeNameRequired,
          titleDropdownFirst: data.jobTitle+" <span class='color-red'>*</span>",
          placeholderDropdownFirst: data.chooseYourJobTitle,
          validationtitleDropdownFirst: data.theEmployeeNamedIsWanted,
          titleDropdownSecond: data.section +" <span class='color-red'>*</span>",
          validationtitleDropdownSecond: data.chooseTheRequiredSection,
          placeholderDropdown: data.chooseSection,
          titleCalendar: data.joiningDate+" <span class='color-red'>*</span>",
          validationCalendar: data.joiningDateIsRequired,
          uploadFile: data.attachAFile,
          chooseLabel: data.selectTheFileToUpload,
          labelEmployeeName: data.employeeType,
          firstRadioEmployeeName: data.military,
          secondRadioEmployeeName: data.civil,
          thirdRadioEmployeeName: data.directContract,
          thirdRadioFour: data.companyContracting,
          placeholderCalendar: data.chooseDate,
          labelRadioButtonSecond: data.shiftType,
          firstRadiTwo: data.morning,
          secondRadioTwo: data.evening,
          thirdRadioTwo: data.layla,
          titleNotes: data.vacationsBalance+" <span class='color-red'>*</span>",
          placeholdeNotes: data.vacationsBalance,
          validationtitleNotes: data.pleaseWriteYourVacationBalanceHere,
          buttonSend: data.addEmployee,
          titleClose: data.toRetreat
        },
      });
    })

    dialogRefAddCurrency.componentInstance.submitted = true;
    // dialogRefAddCurrency.componentInstance.list = this.categories;
    dialogRefAddCurrency.componentInstance.editEmployee = false;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = new FormData();
      let formDataObject: any = {};

      moment.locale("en"); 
      formDataObject.zoneIds = [];
      if (result?.zoneIds?.length > 0) {
        result?.zoneIds?.forEach((direct: any) => {
          formDataObject.zoneIds.push(direct.key);
        });
      }
      formData.append("CreateEmployeeModelString", JSON.stringify({
        IsActive: result.isActive,
        AttendanceType: Number(result.AttendanceType),
        name: result.name,
        DirectManagerId: result.directManager.key,
        email: result.email,
        address: result.address,
        EmployeeType: Number(result.employeeType),
        employeeNumber: result.employeeNumber,
        zoneIds:formDataObject.zoneIds,
        mobileNumber: dialogRefAddCurrency.componentInstance.code + result.mobileNumber,
        
        JobTitleId: result.JobTitleId.key,
        DepartmentId: result.DepartmentId.key,
        JoiningDate: moment(result.JoiningDate).format("MM/DD/YYYY"),
        ScheduleId: result.ScheduleId.key,
        AnnualVacationBalance: result.AnnualVacationBalance

      }));

      result.files.forEach((file: any) => {
        formData.append("ProfileImageFile", file.fileUpload, file.fileUpload.name);
      });
      dialogRefAddCurrency.componentInstance.submitted = false;

      this.employeesService.createEmployee(formData).subscribe(
        {
          next: data => {

            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();
            let succressDialog:any;
            this.translate.get("employees").subscribe(translate => {
              succressDialog = this.dialog.open(ToastSuccessComponent, {
                width: "30vw",
                data: {
                  title: translate.yourRequestHasBeenSent,
                  message: data.message,
                  buttonSend: translate.employeeRequests
                },
              });
            })
          
            this.getEmployees(this.filteration);

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
  editAnEmployee(data: any) {
    let dialogRefAddCurrency!:MatDialogRef<DialogAddAnEmployeeComponent, any>;
    this.translate.get("employees").subscribe(translate => {
       dialogRefAddCurrency = this.dialog.open(DialogAddAnEmployeeComponent, {
        width: "50vw",
        data: {
          title: translate.employeeModification,
          setAsNecessary:  translate.setAsActive,
          labelRadioButtonFirst: translate.performanceType,
          firstRadio: translate.fullTime,
          secondRadio: translate.partTime,
          thirdRadio: translate.freeTimeShift,
          titleFieldDisabled: translate.employeeCode,
          code: data.code,
          JobNumber: translate.jobNumber + " <span class='color-red'>*</span>",
          placeholdeJobNumber: translate.jobNumber,
          validationtitleJobNumber:  translate.jobNumberRequired,
          directManager: translate.directManager+" <span class='color-red'>*</span>",
          placeholdeDirectManager: translate.directManager,
          validationtitleDirectManager: translate.directManagerRequired,
          email: translate.email+" <span class='color-red'>*</span>",
          placeholdeEmail: translate.email,
          validationtitleEmail: translate.emailRequired,
          validationtitleEmailPattern: translate.invalidEmail,
          address: translate.theAddress +" <span class='color-red'>*</span>",
          placeholdeAddress: translate.theAddress,
          validationtitleAddress: translate.addressRequired,
          mobileNumber: translate.phoneNumber + " <span class='color-red'>*</span>",
          placeholdeMobileNumber: translate.phoneNumber,
          validationtitleMobileNumber: translate.phoneNumberRequired,
          labelEmployeeName: translate.employeeType,
          firstRadioEmployeeName: translate.military,
          secondRadioEmployeeName: translate.civil,
          thirdRadioEmployeeName: translate.directContract,
          thirdRadioFour: translate.companyContracting,
          titleWorkSchedule: translate.workSchedule + " <span class='color-red'>*</span>",
          placeholderWorkSchedule: translate.chooseYourWorkSchedule,
          validationtitleWorkSchedule: translate.workScheduleRequired,
          fieldFirst: translate.employeeName +" <span class='color-red'>*</span>",
          placeholdefieldFirst: translate.employeeName,
          validationtitlefieldFirst: translate.employeeNameRequired,
          titleDropdownFirst: translate.jobTitle+" <span class='color-red'>*</span>",
          placeholderDropdownFirst: translate.chooseYourJobTitle,
          validationtitleDropdownFirst: translate.theEmployeeNamedIsWanted,
          titleDropdownSecond: translate.section +" <span class='color-red'>*</span>",
          validationtitleDropdownSecond: translate.chooseTheRequiredSection,
          placeholderDropdown: translate.chooseSection,
          titleCalendar: translate.joiningDate+" <span class='color-red'>*</span>",
          validationCalendar: translate.joiningDateIsRequired,
          uploadFile: translate.attachAFile,
          chooseLabel: translate.selectTheFileToUpload,
          placeholderCalendar: translate.chooseDate,
          labelRadioButtonSecond: translate.shiftType,
          firstRadiTwo: translate.morning,
          secondRadioTwo: translate.evening,
          thirdRadioTwo: translate.layla,
          titleNotes: translate.vacationsBalance+" <span class='color-red'>*</span>",
          placeholdeNotes: translate.vacationsBalance,
          validationtitleNotes: translate.pleaseWriteYourVacationBalanceHere,
          buttonSend:translate.employeeModification,
          titleClose: translate.toRetreat
        },
      });
    })

    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editEmployee = true;

    dialogRefAddCurrency.componentInstance.id = data.id;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = new FormData();
      let formDataObject: any = {};

      moment.locale("en"); 

      formDataObject.zoneIds = [];
      if (result?.zoneIds?.length > 0) {
        result?.zoneIds?.forEach((direct: any) => {
          formDataObject.zoneIds.push(direct.key);
        });
      }
      formData.append("UpdateEmployeeModelString", JSON.stringify({
        id: data.id,
        IsActive: result.isActive,
        AttendanceType: Number(result.AttendanceType),
        name: result.name,
        DirectManagerId: result.directManager.key,
        email: result.email,
        address: result.address,
        mobileNumber: dialogRefAddCurrency.componentInstance.code+ result.mobileNumber,
        EmployeeType: Number(result.employeeType),
        employeeNumber: result.employeeNumber,
        zoneIds:formDataObject.zoneIds,
        JobTitleId: result.JobTitleId.key,
        ProfileImageName: result.files[0]?.fileUpload?.name ? result.files[0]?.fileUpload?.name : "",
        DepartmentId: result.DepartmentId.key,
        JoiningDate: moment(result.JoiningDate).format("MM/DD/YYYY"),
        ScheduleId: result.ScheduleId.key,
        AnnualVacationBalance: result.AnnualVacationBalance

      }));
      result.files.forEach((file: any) => {
        if (file.detailsImage === false) {
          formData.append("ProfileImageFile",  file.fileUpload.name);

        } else {
          
          formData.append("ProfileImageName", file.fileUpload.name);

        }
      });
      dialogRefAddCurrency.componentInstance.submitted = false;
      this.employeesService.updateEmployee(formData).subscribe(
        {
          next: data => {

            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.close();
            let succressDialog:any;
            this.translate.get("employees").subscribe(translate => {
              
              succressDialog = this.dialog.open(ToastSuccessComponent, {
                width: "30vw",
                data: {
                  title: translate.yourRequestHasBeenSent,
                  message: data.message,
                  buttonSend: translate.employeeRequests
                },
              });
            })
            this.getEmployees(this.filteration);

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
      dialogRefAddCurrency.componentInstance.submitted = false;
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  getListDepartment() {

    this.employeesService.getDepartmentForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe(data => {


      data?.data?.forEach((jobTitle: any) => {
        this.listDepratment.push({ name: jobTitle.name, key: jobTitle.id })
      });
    })
  }
  getListSchedules() {
    this.employeesService.getScheduleForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe(data => {
      data?.data?.forEach((jobTitle: any) => {
        this.listSchedules.push({ name: jobTitle.name, key: jobTitle.id })
      });
    })
  }
  getListJobTitle() {
    this.employeesService.getJobTitles({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe(data => {
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
            this.employeesService.getJobTitles({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
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
            this.employeesService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
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
            this.employeesService.getDepartmentForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
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
            this.employeesService.getScheduleForDropDown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
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

  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 4, actionCode: data.actionCode })
  }
  dialogEmployeeFile(data: any) {
    let dialogRefAddCurrency!:MatDialogRef<DialogEmployeeFileComponent, any>;
    this.translate.get("employees").subscribe(data => {
      dialogRefAddCurrency = this.dialog.open(DialogEmployeeFileComponent, {
        width: "40vw",
        data: {
          title: data.employeeFile
        },
      });
    })

    dialogRefAddCurrency.componentInstance.id = data.id

  }
  reasonOfRefuse(data: any) {
    const reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
      width: "30vw",
      data: {
        title: "متأكد من تعليق حساب الموظف؟",
        message: "برجاء توضيح السبب إن أمكن ليظهر للموظف عند محاولة تسجيل الدخول",
        titleReasonOfRefuse: "سبب التعليق",
        placeholdeReasonOfRefuse: "برجاء كتابة سبب الرفض ليظهر للموظف",
        titleClose: "تراجع",
        buttonSend: "تعليق الحساب"
      },
    });
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      this.employeesService.disabledEmployee({ id: data.id, disableReason: result.notes }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getEmployees(this.filteration);
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
    this.getEmployees(this.filteration)
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
    this.getEmployees(filteration)
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
