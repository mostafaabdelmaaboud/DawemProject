import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogAddAnEmployeeComponent } from 'src/app/shared/components/dialog-add-an-employee/dialog-add-an-employee.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { DialogEmployeeFileComponent } from 'src/app/shared/components/dialog-employee-file/dialog-employee-file.component';
import { EmployeesService } from './services/employees.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ActivatedRoute } from '@angular/router';
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
    let data = document.getElementById("tableEmployeesHidden");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ExcelSheet.xlsx');
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
    const dialogRefAddCurrency = this.dialog.open(DialogAddAnEmployeeComponent, {
      width: "50vw",
      data: {
        title: "إضافة موظف",
        setAsNecessary: "تعيين كنشط",
        labelRadioButtonFirst: "نوع الدوام",
        firstRadio: "دوام كامل",
        secondRadio: "دوام جزئي",
        thirdRadio: "دوام حر / شيفت",
        titleFieldDisabled: "كود الموظف",
        code: "#001093",
        JobNumber: "الرقم الوظيفي <span class='color-red'>*</span>",
        placeholdeJobNumber: "الرقم الوظيفي",
        validationtitleJobNumber: "الرقم الوظيفي مطلوب",
        directManager: "المدير المباشر <span class='color-red'>*</span>",
        placeholdeDirectManager: "المدير المباشر",
        validationtitleDirectManager: "المدير المباشر مطلوب",
        email: "البريد الالكتروني <span class='color-red'>*</span>",
        placeholdeEmail: "البريد الالكتروني",
        validationtitleEmail: "البريد الالكتروني مطلوب",
        validationtitleEmailPattern: "البريد الالكتروني غير صحيح",

        address: "العنوان <span class='color-red'>*</span>",
        placeholdeAddress: "العنوان",
        validationtitleAddress: "العنوان مطلوب",
        mobileNumber: "رقم الهاتف <span class='color-red'>*</span>",
        placeholdeMobileNumber: "رقم الهاتف",
        validationtitleMobileNumber: "رقم الهاتف مطلوب",
        titleWorkSchedule: "جدول الدوام <span class='color-red'>*</span>",
        placeholderWorkSchedule: " اختار جدول الدوام",
        validationtitleWorkSchedule: "جدول الدوام مطلوب",
        fieldFirst: "اسم الموظف <span class='color-red'>*</span>",
        placeholdefieldFirst: "اسم الموظف",
        validationtitlefieldFirst: "اسم الموظف مطلوب",
        titleDropdownFirst: "المسمى الوظيفي <span class='color-red'>*</span>",
        placeholderDropdownFirst: " اختار المسمى الوظيفي",
        validationtitleDropdownFirst: "المسمي الوظفس مطلوب",
        titleDropdownSecond: "القسم <span class='color-red'>*</span>",
        validationtitleDropdownSecond: " اختار القسم مطلوب",
        placeholderDropdown: " اختار القسم",
        titleCalendar: "تاريخ الالتحاق <span class='color-red'>*</span>",
        validationCalendar: "تاريخ الالتحاق مطلوب",
        uploadFile: "ارفاق ملف",
        chooseLabel: "اختار الملف ليتم رفعه",
        labelEmployeeName: "نوع الموظف",
        firstRadioEmployeeName: "عسكري",
        secondRadioEmployeeName: "مدني",
        thirdRadioEmployeeName: "تعاقد مباشر",
        thirdRadioFour: "تعاقد شركات",
        placeholderCalendar: "اختار التاريخ",
        labelRadioButtonSecond: "نوع الشيفت",
        firstRadiTwo: "صباحي",
        secondRadioTwo: "مسائي",
        thirdRadioTwo: "ليلي",
        titleNotes: "رصيد الاجازات <span class='color-red'>*</span>",
        placeholdeNotes: "رصيد الاجازات",
        validationtitleNotes: "برجاء كتابة رصيد الاجازات هنا",
        buttonSend: "إضافة الموظف",
        titleClose: "تراجع"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    // dialogRefAddCurrency.componentInstance.list = this.categories;
    dialogRefAddCurrency.componentInstance.editEmployee = false;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = new FormData();

      formData.append("CreateEmployeeModelString", JSON.stringify({
        IsActive: result.isActive,
        AttendanceType: Number(result.AttendanceType),
        name: result.name,
        DirectManagerId: result.directManager.key,
        email: result.email,
        address: result.address,
        EmployeeType: Number(result.employeeType),
        employeeNumber: result.employeeNumber,

        mobileNumber: result.mobileNumber,
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

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الموظفين"
              },
            });
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
  editAnEmployee(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogAddAnEmployeeComponent, {
      width: "50vw",
      data: {
        title: "تعديل موظف",
        setAsNecessary: "تعيين كنشط",
        labelRadioButtonFirst: "نوع الدوام",
        firstRadio: "دوام كامل",
        secondRadio: "دوام جزئي",
        thirdRadio: "دوام حر / شيفت",
        titleFieldDisabled: "كود الموظف",
        code: data.orderNumber,
        JobNumber: "الرقم الوظيفي <span class='color-red'>*</span>",
        placeholdeJobNumber: "الرقم الوظيفي",
        validationtitleJobNumber: "الرقم الوظيفي مطلوب",
        directManager: "المدير المباشر <span class='color-red'>*</span>",
        placeholdeDirectManager: "المدير المباشر",
        validationtitleDirectManager: "المدير المباشر مطلوب",
        email: "البريد الالكتروني <span class='color-red'>*</span>",
        placeholdeEmail: "البريد الالكتروني",
        validationtitleEmail: "البريد الالكتروني مطلوب",
        validationtitleEmailPattern: "البريد الالكتروني غير صحيح",
        address: "العنوان <span class='color-red'>*</span>",
        placeholdeAddress: "العنوان",
        validationtitleAddress: "العنوان مطلوب",
        mobileNumber: "رقم الهاتف <span class='color-red'>*</span>",
        placeholdeMobileNumber: "رقم الهاتف",
        validationtitleMobileNumber: "رقم الهاتف مطلوب",
        labelEmployeeName: "نوع الموظف",
        firstRadioEmployeeName: "عسكري",
        secondRadioEmployeeName: "مدني",
        thirdRadioEmployeeName: "تعاقد مباشر",
        thirdRadioFour: "تعاقد شركات",
        titleWorkSchedule: "جدول الدوام <span class='color-red'>*</span>",
        placeholderWorkSchedule: " اختار جدول الدوام",
        validationtitleWorkSchedule: "جدول الدوام مطلوب",
        fieldFirst: "اسم الموظف <span class='color-red'>*</span>",
        placeholdefieldFirst: "اسم الموظف",
        validationtitlefieldFirst: "اسم الموظف مطلوب",
        titleDropdownFirst: "المسمى الوظيفي <span class='color-red'>*</span>",
        placeholderDropdownFirst: " اختار المسمى الوظيفي",
        validationtitleDropdownFirst: "المسمي الوظفس مطلوب",
        titleDropdownSecond: "القسم <span class='color-red'>*</span>",
        validationtitleDropdownSecond: " اختار القسم مطلوب",
        placeholderDropdown: " اختار القسم",
        titleCalendar: "تاريخ الالتحاق <span class='color-red'>*</span>",
        validationCalendar: "تاريخ الالتحاق مطلوب",
        uploadFile: "ارفاق ملف",
        chooseLabel: "اختار الملف ليتم رفعه",
        placeholderCalendar: "اختار التاريخ",
        labelRadioButtonSecond: "نوع الشيفت",
        firstRadiTwo: "صباحي",
        secondRadioTwo: "مسائي",
        thirdRadioTwo: "ليلي",
        titleNotes: "رصيد الاجازات <span class='color-red'>*</span>",
        placeholdeNotes: "رصيد الاجازات",
        validationtitleNotes: "برجاء كتابة رصيد الاجازات هنا",
        buttonSend: "تعديل الموظف",
        titleClose: "تراجع"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editEmployee = true;

    dialogRefAddCurrency.componentInstance.id = data.id;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = new FormData();
      formData.append("UpdateEmployeeModelString", JSON.stringify({
        id: data.id,
        IsActive: result.isActive,
        AttendanceType: Number(result.AttendanceType),
        name: result.name,
        DirectManagerId: result.directManager.key,
        email: result.email,
        address: result.address,
        mobileNumber: result.mobileNumber,
        EmployeeType: Number(result.employeeType),
        employeeNumber: result.employeeNumber,
        JobTitleId: result.JobTitleId.key,
        ProfileImageName: result.files[0]?.fileUpload?.name ? result.files[0]?.fileUpload?.name : "",
        DepartmentId: result.DepartmentId.key,
        JoiningDate: moment(result.JoiningDate).format("MM/DD/YYYY"),
        ScheduleId: result.ScheduleId.key,
        AnnualVacationBalance: result.AnnualVacationBalance

      }));
      result.files.forEach((file: any) => {
        if (file.detailsImage === false) {
          formData.append("ProfileImageFile", file.fileUpload, file.fileUpload.name);

        }
      });
      dialogRefAddCurrency.componentInstance.submitted = false;
      this.employeesService.updateEmployee(formData).subscribe(
        {
          next: data => {

            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.close();
            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات الموظفين"
              },
            });
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
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 4, actionCode: data.actionCode })
  }
  dialogEmployeeFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogEmployeeFileComponent, {
      width: "40vw",
      data: {
        title: "ملف الموظف"
      },
    });
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

}
