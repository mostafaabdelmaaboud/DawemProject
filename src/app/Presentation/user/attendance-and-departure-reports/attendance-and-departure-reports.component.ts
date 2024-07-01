import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { EmployeesService } from '../employees/services/employees.service';
import { ReportService } from './services/report.service';

@Component({
  selector: 'app-attendance-and-departure-reports',
  templateUrl: './attendance-and-departure-reports.component.html',
  styleUrls: ['./attendance-and-departure-reports.component.scss']
})
export class AttendanceAndDepartureReportsComponent {
  date!: Date;
  mobileQuery: MediaQueryList;
  subscription!: Subscription;
  loading = false;
  id:any;
  reportForm: FormGroup = this.fb.group({
    dateFrom: ['', Validators.required],
    dateTo: ['', Validators.required],
    EmployeeID:['', Validators.required]
  });
  private employeesService = inject(EmployeesService);
  private reportService = inject(ReportService);
  show = false;
  private route = inject(ActivatedRoute);
  lastSearchQuery = "";
  opened = false;
  employeesList:any[] = [];
  url!: string;

  private _mobileQueryListener: () => void;
  constructor(
    private config: PrimeNGConfig, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;

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
  submitted = true;
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.getEmployees();
  }
  getControl(controlName: string) {
    return this.reportForm?.get(controlName);
  }
  filteration = {

  }
  filter() {
    if(this.reportForm.valid && this.submitted) {
      this.submitted = false;
      Object.entries(this.reportForm?.value).forEach(([key, value]: any) => {
        if (key === "EmployeeID") {
          if (value != "") {
            this.filteration[key] = value.key
          }
        }  else {
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
      // this.filteration.PageNumber = 0;
  
      this.getReport(this.filteration);
    }



  }
  getReport(filteration) {
    this.loading = true;
    this.reportService.GetAttendanceForAllEmployeeReport(filteration).subscribe({
      next: data => {
        this.submitted = true;
        // data.data.forEach((employee: any) => {
        //   this.employees.push({
        //     id: employee.id,
        //     orderNumber: employee.employeeNumber,
        //     isActive: employee.isActive,
        //     code:employee.code,
        //     employeeName: {
        //       name: employee?.name ? employee?.name : "لا يوجد",
        //       alt: employee?.name ? employee?.name : "لا يوجد",
        //       img: employee?.profileImagePath ? employee?.profileImagePath : "../../../../assets/img/5034901-200.png"
        //     },
        //     section: employee?.dapartmentName ? employee?.dapartmentName : "لا يوجد",
        //     joiningDate: employee?.joiningDate ? moment(employee.joiningDate).format("DD/MM/YYYY") : "لا يوجد"
        //   });
        // });
        // this.totalItems = data.totalCount
        this.loading = false;
      },
      error:err=> {
        this.submitted = true;

        this.loading = false;

      }
    }
     )
  }
  getEmployees() {
    this.loading = true;
    this.employeesService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe({
      next:res => {
        res?.data?.forEach((jobTitle: any) => {
          this.employeesList.push({ name: jobTitle.name, key: jobTitle.id })
        });
        this.loading = false;

      },
      error:err => {
        this.loading = false;

      }
    });

  }
  request() {

  }
  reset() {

  }
  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'JobTitleId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.employeesService.GetForDropDownEmployee({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.employeesList = [];
                this.lastSearchQuery = "";

                res?.data?.forEach((jobTitle: any) => {
                  this.employeesList.push({ name: jobTitle.name, key: jobTitle.id })
                });
              });
          }

        }
        break;
    
 
      default:
        
        break;
    }
  }
}
