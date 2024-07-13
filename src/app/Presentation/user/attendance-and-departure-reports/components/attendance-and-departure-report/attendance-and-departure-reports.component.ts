import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';

import moment from 'moment';
import { EmployeesService } from '../../../employees/services/employees.service';
import { ReportService } from '../../services/report.service';

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
    DateFrom: ['', Validators.required],
    DateTo: ['', Validators.required],
    EmployeeId:[''],
    DepartmentId:[''],
    ZoneId:[''],
    JobTitleId:[''],
  });
  private employeesService = inject(EmployeesService);
  private reportService = inject(ReportService);
  show = false;
  private route = inject(ActivatedRoute);
  lastSearchQuery = "";
  opened = false;
  employeesList:any[] = [];
  depatmentsList:any[] = [];
  zonesList:any[] = [];
  jobTitleList:any[] = [];
  loadingReport = false;
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
    let employee = this.employeesService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let department =  this.employeesService.GetForDropDownDepartment({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let zones =  this.employeesService.GetForDropDownZones({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let jobTitle =  this.employeesService.GetForDropDownJobTitle({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });

    // let screenGetForDropDown = this.plansService.screenGetForDropDown({PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    this.loading = true;

    combineLatest({
      employee,
      department,
      zones,
      jobTitle
    }).subscribe({
      next:data => {

        data?.employee?.data?.forEach((employee: any) => {
          this.employeesList.push({ name: employee.name, key: employee.id })
        });

        data?.department?.data?.forEach((department: any) => {
          this.depatmentsList.push({ name: department.name, key: department.id })
        });
        data?.zones?.data?.forEach((zone: any) => {
          this.zonesList.push({ name: zone.name, key: zone.id })
        });
        data?.jobTitle?.data?.forEach((zone: any) => {
          this.jobTitleList.push({ name: zone.name, key: zone.id })
        });
        this.loading = false;

      },
      error:err => {
        this.loading = false;

      }
    })
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
        if (key === "EmployeeId") {
          if (value != "") {
            this.filteration[key] = value.key ? value.key : 0
          }
        } else if (key === "DepartmentId") {
          if (value != "") {
            this.filteration[key] = value.key ? value.key : 0
          }
        } else if (key === "ZoneId") {
          if (value != "") {
            this.filteration[key] = value.key ? value.key : 0
          }
        }else if (key === "JobTitleId") {
          if (value != "") {
            this.filteration[key] = value.key ? value.key : 0
          }
        } else if (key === "DateFrom") {
          if (value != "") {
            this.filteration[key] = moment(value).format("MM/DD/YYYY")
          }
        }else if (key === "DateTo") {
          if (value != "") {
            this.filteration[key] = moment(value).format("MM/DD/YYYY")
          }
        }else {
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
      this.getReport(this.filteration);
    } else {
      this.reportForm.get("DateFrom")?.markAsDirty();
      this.reportForm.get("DateTo")?.markAsDirty();

    }
  }
  getReport(filteration) {
    this.loadingReport = true;

    this.reportService.GetEmployeeDailyAttendanceGroupByDayPath(filteration).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        this.url = url;
        this.submitted = true;
        this.loadingReport = false;
        this.show = true;
      },
      error:err=> {
        this.submitted = true;
        this.show = false;
        this.loadingReport = false;

      }
    }
     )
  }
 
  request() {

  }
  reset() {

  }
  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'EmployeeID':
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
        case 'DepartmentId':
          if (data || data === "") {
            if (data !== this.lastSearchQuery || data === "") {
              this.lastSearchQuery = data;
              this.employeesService.GetForDropDownDepartment({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
                debounceTime(300),
                distinctUntilChanged()).subscribe((res: any) => {
                  this.depatmentsList = [];
                  this.lastSearchQuery = "";
  
                  res?.data?.forEach((jobTitle: any) => {
                    this.depatmentsList.push({ name: jobTitle.name, key: jobTitle.id })
                  });
                });
            }
  
          }
          break;
          case 'ZoneId':
            if (data || data === "") {
              if (data !== this.lastSearchQuery || data === "") {
                this.lastSearchQuery = data;
                this.employeesService.GetForDropDownZones({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
                  debounceTime(300),
                  distinctUntilChanged()).subscribe((res: any) => {
                    this.zonesList = [];
                    this.lastSearchQuery = "";
    
                    res?.data?.forEach((jobTitle: any) => {
                      this.zonesList.push({ name: jobTitle.name, key: jobTitle.id })
                    });
                  });
              }
            }
            break;
            case 'JobTitleId':
              if (data || data === "") {
                if (data !== this.lastSearchQuery || data === "") {
                  this.lastSearchQuery = data;
                  this.employeesService.GetForDropDownJobTitle({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
                    debounceTime(300),
                    distinctUntilChanged()).subscribe((res: any) => {
                      this.jobTitleList = [];
                      this.lastSearchQuery = "";
      
                      res?.data?.forEach((jobTitle: any) => {
                        this.jobTitleList.push({ name: jobTitle.name, key: jobTitle.id })
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
