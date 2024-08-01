import { Subject, map, takeUntil } from 'rxjs';
import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent
} from "ng-apexcharts";
import { MediaMatcher } from '@angular/cdk/layout';
import { DashboardService } from './services/dashboard.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddAnEmployeeComponent } from 'src/app/shared/components/dialog-add-an-employee/dialog-add-an-employee.component';
import { EmployeesService } from '../employees/services/employees.service';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { TranslateService } from '@ngx-translate/core';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @ViewChild("chart") chart!: ChartComponent;
  @ViewChild("chartCandlestick") chartCandl!: ChartComponent;
  private dialog = inject(MatDialog);

  private dashboardService = inject(DashboardService);
  router = inject(Router)
  public chartOptions!: any;
  public chartCandlestick!: any;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  RowsPerPage!: any[];
  headerInformations: any = {};
  leadingHeader = false;
  totalItems: number = 0;
  totalItemsBestEmployees: number = 0;
  totalItemsDepartments: number = 0;
  items!: MenuItem[];
  cities!: any[];
  bestEmployeesList!: any[];
  private employeesService = inject(EmployeesService);

  statusOfOrders!: any[];
  selectedCity!: any;

  plotOptions: any = {
    pie: {
      size: '100%',
      disblay: "block",
      startAngle: 0,
      endAngle: 360,
      expandOnClick: true,
      offsetX: 30,
      offsetY: 0,
      customScale: 10,
      dataLabels: {
        offset: 0,
        enabled: false,
        minAngleToShowLabel: 10
      },

    }
  }
  dataLabels: any = {
    enabled: false,
    offset: 0,
    formatter: function (val: any) {
      return val + "%"
    }
  }
  cards!: any;
  spinnerCards = false;
  spinnerChart = true;
  employeesStatus: any = {};
  loadingEmployeesStatus = false;
  currentLang = localStorage.getItem("lang");
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(media: MediaMatcher, private changeDetectorRef: ChangeDetectorRef,
    private permissionsUserService: PermissionsUserService,
    public translate: TranslateService) {
    this.mobileQuery = media.matchMedia('(max-width: 992px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.chartCandlestick.chart = {
          type: "candlestick",
          width: "100%",
          height: 350,


          zoom: {
            enabled: true
          },
        }
        changeDetectorRef.detectChanges();
      }



    };
    this.mobileQuery.addListener(this._mobileQueryListener);

  }
  employeesAttendances: any[] = [];
  bestEmployees: any[] = [];

  departmentsInformations: any[] = [];
  filteration: any = {
    PageSize: 5,
    PageNumber: 0,
    PagingEnabled: true
  };
  filterationBestEmloyees: any = {
    PageSize: 5,
    PageNumber: 0,
    PagingEnabled: true
  };
  filterationDepartments: any = {
    PageSize: 5,
    PageNumber: 0,
    PagingEnabled: true
  };
  
  filterationStatusOfOrders:any = {
  }
  id:any;
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.RowsPerPage = [
      { name: '5', code: 5 },
      { name: '10', code: 10 },
      { name: '25', code: 25 },

    ];
    this.dashboardService.getHeaderInformations().subscribe({
      next: data => {

        this.headerInformations.employeesAttendanceRateToday = data.data.employeesAttendanceRateToday;
        this.headerInformations.name = data.data.name;
        this.leadingHeader = true;

      },
      error: err => {
        this.leadingHeader = false;

      }

    })
    this.chartCandlestick = {
      series: [
        {
          name: "candle",
          data: [
            {
              x: new Date(1538778600000),
              y: [6629.81, 6650.5, 6623.04, 6633.33]
            },
            {
              x: new Date(1538780400000),
              y: [6632.01, 6643.59, 6620, 6630.11]
            },
            {
              x: new Date(1538782200000),
              y: [6630.71, 6648.95, 6623.34, 6635.65]
            },
            {
              x: new Date(1538784000000),
              y: [6635.65, 6651, 6629.67, 6638.24]
            },
            {
              x: new Date(1538785800000),
              y: [6638.24, 6640, 6620, 6624.47]
            },
            {
              x: new Date(1538787600000),
              y: [6624.53, 6636.03, 6621.68, 6624.31]
            },
            {
              x: new Date(1538789400000),
              y: [6624.61, 6632.2, 6617, 6626.02]
            },
            {
              x: new Date(1538791200000),
              y: [6627, 6627.62, 6584.22, 6603.02]
            },
            {
              x: new Date(1538793000000),
              y: [6605, 6608.03, 6598.95, 6604.01]
            },
            {
              x: new Date(1538794800000),
              y: [6604.5, 6614.4, 6602.26, 6608.02]
            },
            {
              x: new Date(1538796600000),
              y: [6608.02, 6610.68, 6601.99, 6608.91]
            },
            {
              x: new Date(1538798400000),
              y: [6608.91, 6618.99, 6608.01, 6612]
            },
            {
              x: new Date(1538800200000),
              y: [6612, 6615.13, 6605.09, 6612]
            },
            {
              x: new Date(1538802000000),
              y: [6612, 6624.12, 6608.43, 6622.95]
            },
            {
              x: new Date(1538803800000),
              y: [6623.91, 6623.91, 6615, 6615.67]
            },
            {
              x: new Date(1538805600000),
              y: [6618.69, 6618.74, 6610, 6610.4]
            },
            {
              x: new Date(1538807400000),
              y: [6611, 6622.78, 6610.4, 6614.9]
            },
            {
              x: new Date(1538809200000),
              y: [6614.9, 6626.2, 6613.33, 6623.45]
            },

          ]
        }
      ],
      chart: {
        type: "candlestick",
        width: "110%",
        height: 350,


        zoom: {
          enabled: true
        },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#3C90EB',
            downward: '#10B981'
          }
        }
      },

      xaxis: {
        type: "datetime",
        offestX: 50,

      },
      yaxis: {
        width: 100,
        offestX: 50,

        labels: {
          show: true,
          offestX: 50,

        },
        tooltip: {
          enabled: true

        }
      }
    };
    if (this.mobileQuery.matches) {
      this.chartCandlestick.chart = {
        type: "candlestick",
        width: "100%",
        height: 350,


        zoom: {
          enabled: true
        },
      }
    }


    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
    
    this.bestEmployeesList = [
      { name: 'اليوم', code: 'today' },
      { name: 'الشهر', code: 'month' },
      { name: 'السنة', code: 'year' }
    ];
    this.statusOfOrders = [
      { name: 'اليوم', code: 'today' },
      { name: 'الشهر', code: 'month' },
      { name: 'السنة', code: 'year' }
    ];
    if (this.currentLang === undefined || this.currentLang === null) {
      this.bestEmployeesList = [
        { name: 'اليوم', code: 'today' },
        { name: 'الشهر', code: 'month' },
        { name: 'السنة', code: 'year' }
      ];
      this.statusOfOrders = [
        { name: 'اليوم', code: 'today' },
        { name: 'الشهر', code: 'month' },
        { name: 'السنة', code: 'year' }
      ];
  } else {
 
    if (this.currentLang == "ar") {
        this.bestEmployeesList = [
          { name: 'اليوم', code: 'today' },
          { name: 'الشهر', code: 'month' },
          { name: 'السنة', code: 'year' }
        ];
        this.statusOfOrders = [
          { name: 'اليوم', code: 'today' },
          { name: 'الشهر', code: 'month' },
          { name: 'السنة', code: 'year' }
        ];

    } else if (this.currentLang == "en") {
        this.bestEmployeesList = [
          { name: 'today', code: 'today' },
          { name: 'the month', code: 'month' },
          { name: 'the year', code: 'year' }
        ];
        this.statusOfOrders = [
          { name: 'today', code: 'today' },
          { name: 'the month', code: 'month' },
          { name: 'the year', code: 'year' }
        ];
      }

  }
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if(data.lang === "ar") {
        this.bestEmployeesList = [
          { name: 'اليوم', code: 'today' },
          { name: 'الشهر', code: 'month' },
          { name: 'السنة', code: 'year' }
        ];
        this.statusOfOrders = [
          { name: 'اليوم', code: 'today' },
          { name: 'الشهر', code: 'month' },
          { name: 'السنة', code: 'year' }
        ];
      } else if(data.lang === "en") {
        this.bestEmployeesList = [
          { name: 'today', code: 'today' },
          { name: 'the month', code: 'month' },
          { name: 'the year', code: 'year' }
        ];
        this.statusOfOrders = [
          { name: 'today', code: 'today' },
          { name: 'the month', code: 'month' },
          { name: 'the year', code: 'year' }
        ];
      }
      this.getDepartmentsInformations(this.filterationDepartments);
    })
 
    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {
            }
          },
          {
            label: 'Delete',
            icon: 'pi pi-times',
            command: () => {
            }
          }
        ]
      },
      {
        label: 'Navigate',
        items: [
          {
            label: 'Angular',
            icon: 'pi pi-external-link',
            url: 'http://angular.io'
          },
          {
            label: 'Router',
            icon: 'pi pi-upload',
            routerLink: '/fileupload'
          }
        ]
      }
    ];
    this.getInformation();
    this.getRequestsStatus(this.filterationStatusOfOrders);
    this.getEmployeesStatus();
    this.getEmployeesAttendancesStatus(this.filteration);
    this.getDepartmentsInformations(this.filterationDepartments);
    this.getBestEmployees(this.filterationBestEmloyees);
  }
  navigateComponent(componentName:string) {
    let permissions = JSON.parse(localStorage.getItem("permissions") as string);
    let findIndexRoute = permissions?.availablePermissions?.findIndex((permission:any) => permission?.url?.includes(componentName));
    if(findIndexRoute >= 0) {
      this.router.navigate([`${permissions?.availablePermissions[findIndexRoute]?.url}/${permissions?.availablePermissions[findIndexRoute]?.screenCode}`]);
    }
  }
  showActiosEmployee(data: any) {
    let permissions = JSON.parse(localStorage.getItem("permissions") as string);
    let findIndexRoute = permissions?.availablePermissions?.findIndex((permission:any) => permission?.url?.includes("employees"));
    if(findIndexRoute >= 0) {
      return this.permissionsUserService.checkPermission({ type: "actions", screenCode: Number(permissions?.availablePermissions[findIndexRoute]?.screenCode), actionCode: data.actionCode })
    } else {
     return false;
    }
  }
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: Number(this.id), actionCode: data.actionCode })
  }
  onChangeStatusOfOrders(data:any) {
    switch (data.value.code) {
      case 'today':
        this.filterationStatusOfOrders.Type = 0;
      this.getRequestsStatus(this.filterationStatusOfOrders);
      break;
      case 'month':
        this.filterationStatusOfOrders.Type = 1;
      this.getRequestsStatus(this.filterationStatusOfOrders);
      break;
      case 'year':
        this.filterationStatusOfOrders.Type = 2;
        this.getRequestsStatus(this.filterationStatusOfOrders);
      break;
    }

  }
  onChangeBestEmployees(data:any) {
    switch (data.value.code) {
      case 'today':
        this.filterationBestEmloyees.Type = 0;
      this.getBestEmployees(this.filterationBestEmloyees);
      break;
      case 'month':
        this.filterationBestEmloyees.Type = 1;
      this.getBestEmployees(this.filterationBestEmloyees);
      break;
      case 'year':
        this.filterationBestEmloyees.Type = 2;
        this.getBestEmployees(this.filterationBestEmloyees);
      break;
    }

  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getEmployeesAttendancesStatus(this.filteration);
  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getEmployeesAttendancesStatus(this.filteration);

  }
  onPageChangeBestEmployees(event: any) {
    this.filterationBestEmloyees = { ...this.filterationBestEmloyees, PageNumber: event.page };
    this.getBestEmployees(this.filterationBestEmloyees);

  }
  onPageChangeDepartments(event: any) {
    this.filterationDepartments = { ...this.filterationDepartments, PageNumber: event.page };
    this.getDepartmentsInformations(this.filterationDepartments);

  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  getRequestsStatus(filteration:any) {
    this.spinnerChart = true;
    
    this.dashboardService.getRequestsStatus(filteration).subscribe({
      next: data => {

        this.chartOptions = {
          series: [data.acceptedCount, data.pendingCount, data.rejectedCount],
          chart: {
            type: "donut",
            width: "100%",
            height: 400,
            offsetY: 20
          },
          colors: ['#10B981', 'rgba(251, 191, 36, 1)', 'rgba(239, 68, 68, 1)'],

          labels: [`
      <span class='d-block title-chart-dount'>
        الطلبات المقبولة
      </span>
      <span class='d-block subTitle-chart-dount'>
  <strong>${data.acceptedCount}</strong> طلب
      </span>
      `, `
      <span class='d-block title-chart-dount'>
الطلبات المنتظرة
      </span>
      <span class='d-block subTitle-chart-dount'>
      <strong>${data.pendingCount}</strong> طلب
      </span>
      `, `
      <span class='d-block title-chart-dount'>
الطلبات الرفوضة
      </span>
      <span class='d-block subTitle-chart-dount'>
      <strong>${data.rejectedCount}</strong> طلب
      </span>
      `],

          plotOptions: {
            tooltip: {
              enabled: false,
            },
            pie: {
              enabled: false,

              dataLabels: {
                offset: 0,
                enabled: false,
                minAngleToShowLabel: 10
              },

            }
          },
          legend: {
            position: "bottom",
            horizontalAlign: 'center',
            width: "100%",
            offsetY: 10,

            itemMargin: {
              horizontal: 15,
              vertical: 0,

            }
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: "100%"
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };

        this.spinnerChart = false;

      },
      error: err => {
        this.spinnerChart = false;

      }
    })
  }
  getDepartmentsInformations(filteration: any) {
    this.dashboardService.getDepartmentsInformations(filteration).subscribe({
      next: data => {
        moment.locale("ar");
        if (this.currentLang == "ar") {
          moment.locale("ar");

  
      } else if (this.currentLang == "en") {
        moment.locale("en");

        }
        this.departmentsInformations = data.data.map((depratment: any) => {
          return {
            ...depratment, lastEditDate: {
              Date: this.isSameDay(new Date(), new Date(depratment.lastEditDate)) ? moment(new Date(depratment.lastEditDate)).format('h:mm A') : moment(new Date(depratment.lastEditDate)).format('MMMM Do YYYY, h:mm a'),
              currentDate: this.isSameDay(new Date(), new Date(depratment.lastEditDate))
            }
          }
        });
        moment.locale("en");
        this.totalItemsDepartments = data.totalCount;

      },
      error: err => {

      }
    })
  }

  addAnEmployee(data:any) {
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
    dialogRefAddCurrency.componentInstance.departmentIsReadOnly = true;
    // dialogRefAddCurrency.componentInstance.list = this.categories;
    dialogRefAddCurrency.componentInstance.editEmployee = false;
    dialogRefAddCurrency.componentInstance.departmentID = data.id;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData = new FormData();
      moment.locale("en"); 
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
                buttonSend: "الموظفين"
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
  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  getEmployeesAttendancesStatus(filteration: any) {
    this.dashboardService.getEmployeesAttendancesStatus(filteration).subscribe({
      next: data => {

        this.employeesAttendances = data.data.map((attend: any) => {
          return { ...attend, attendanceRate: attend.attendanceRate + 10 }
        });
        this.totalItems = data.totalCount;

      },
      error: err => {

      }
    })
  }
  getBestEmployees(filteration: any) {
    this.dashboardService.getBestEmployees(filteration).subscribe({
      next: data => {
        this.bestEmployees = data.data;
        this.totalItemsBestEmployees = data.totalCount;

      },
      error: err => {

      }
    })
  }
 
  navigateEmployeesStatus(status:any, value:any) {
    let permissions = JSON.parse(localStorage.getItem("permissions") as string);
    let findIndexRoute = permissions?.availablePermissions?.findIndex((permission:any) => permission?.url?.includes("employees"));
    if(findIndexRoute >= 0) {
      if(value > 0) {
        this.router.navigate([`${permissions?.availablePermissions[findIndexRoute]?.url}/${permissions?.availablePermissions[findIndexRoute]?.screenCode}`], {queryParams:{Status:status}})
  
      }
    }

  }
  getEmployeesStatus() {
    this.loadingEmployeesStatus = true;
    this.dashboardService.getEmployeesStatus().subscribe({
      next: data => {


        this.employeesStatus = data;
        this.loadingEmployeesStatus = false;

      },
      error: err => {
        this.loadingEmployeesStatus = false;

      }
    })
  }
  getInformation() {
    this.dashboardService.getEmployeesAttendancesInformations().subscribe({
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
  ngOnDestroy() {
    this.destroy$.next(true);
    // this.destroy$.unsubscribe();
  }
}
