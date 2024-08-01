import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import moment from 'moment';
import { EmployeesService } from '../../../employees/services/employees.service';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-briefing-summons-in-period-report',
  templateUrl: './briefing-summons-in-period-report.component.html',
  styleUrls: ['./briefing-summons-in-period-report.component.scss']
})
export class BriefingSummonsInPeriodReportComponent {
  date!: Date;
  mobileQuery: MediaQueryList;
  subscription!: Subscription;
  loading = false;
  id:any;
  allowedTimeWithMinutesRequired = false;
  reportForm: FormGroup = this.fb.group({
    DateFrom: ['', [Validators.required, this.dateFromValidator("DateTo")]],
    DateTo: ['', [Validators.required, this.dateToValidator("DateFrom")]],
    DepartmentIds:[''],
    JobTitleIds:[''],
    AllowedTimeWithMinutesFrom:[null, [this.allowedTimeWithMinutesFromValidator('AllowedTimeWithMinutesTo'), Validators.min(0)]],
    AllowedTimeWithMinutesTo:[null, [this.allowedTimeWithMinutesToValidator('AllowedTimeWithMinutesFrom'), Validators.min(0)]],
    NoOfRequiredEmployeeFrom:[null, [this.allowedTimeWithMinutesFromValidator('NoOfRequiredEmployeeTo'), Validators.min(0)]],
    NoOfRequiredEmployeeTo:[null, [this.allowedTimeWithMinutesToValidator('NoOfRequiredEmployeeFrom'), Validators.min(0)]],
    PercentageOfDoneFrom:[null, [this.percentageOfDoneFromValidator('PercentageOfDoneTo'),  Validators.max(100), Validators.min(0)]],
    PercentageOfDoneTo:[null, [this.percentageOfDoneToValidator('PercentageOfDoneFrom'), Validators.max(100), Validators.min(0)]]
  });
  private employeesService = inject(EmployeesService);
  private reportService = inject(ReportsService);
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
  dateFromValidator(conInput: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: any = control.value;
      let checkMin = true;
      

      if (value != '') {
        
        if (this.reportForm?.get(conInput)?.dirty && !this.reportForm?.get(conInput)?.hasError('required')) {
          

          if (value > this.reportForm?.get(conInput)?.value) {
            

            checkMin = false;
          }
        }
        if(this.reportForm?.get(conInput)?.invalid) {
          this.reportForm?.get(conInput)?.setValue( this.reportForm?.get(conInput)?.value)
        }
      }
      return checkMin ? null : { dateRangeError: true };
    };
  }
  dateToValidator(conInput: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: any = control.value;
      let checkMin = true;


      if (value != null) {
        if (this.reportForm?.get(conInput)?.dirty && !this.reportForm?.get(conInput)?.hasError('required')) {
          if (value < this.reportForm?.get(conInput)?.value) {
            checkMin = false;
          }
        }
        if(this.reportForm?.get(conInput)?.invalid) {
          this.reportForm?.get(conInput)?.setValue( this.reportForm?.get(conInput)?.value)
        }
      }
      return checkMin ? null : { dateRangeError: true };
    };
  }
  submitted = true;
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;
  this.loadDataDropdown();
  }
  percentageOfDoneFromValidator(conInput: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: any = control.value;
      let checkMin = true;
      if (value != '') {
        
        if (this.reportForm?.get(conInput)?.dirty && !this.reportForm?.get(conInput)?.hasError('required')) {
          if (value > this.reportForm?.get(conInput)?.value) {
            if(this.reportForm?.get(conInput)?.value != "" && this.reportForm?.get(conInput)?.value != null) {
              if(this.reportForm?.get(conInput)?.value != "" && this.reportForm?.get(conInput)?.value != null) {
                checkMin = false;
  
              }

            }
          }
          if(this.reportForm?.get(conInput)?.invalid) {
            this.reportForm?.get(conInput)?.setValue( this.reportForm?.get(conInput)?.value)
          }
        }
      }
      return checkMin ? null : { dateRangeError: true };
    };
  }
  percentageOfDoneToValidator(conInput: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: any = control.value;
      let checkMin = true;


      if (value != '') {
        if (this.reportForm?.get(conInput)?.dirty && !this.reportForm?.get(conInput)?.hasError('required')) {
          
          if (value < this.reportForm?.get(conInput)?.value) {
            if(this.reportForm?.get(conInput)?.value != "" && this.reportForm?.get(conInput)?.value != null) {
              checkMin = false;

            }
          }
          
          if(this.reportForm?.get(conInput)?.invalid) {
            this.reportForm?.get(conInput)?.setValue( this.reportForm?.get(conInput)?.value)
          }
        }
      }
      return checkMin ? null : { dateRangeError: true };
    };
  }
  allowedTimeWithMinutesFromValidator(conInput: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: any = control.value;
      let checkMin = true;
      if (value != '') {
        if (this.reportForm?.get(conInput)?.dirty && !this.reportForm?.get(conInput)?.hasError('required')) {
          if (value > this.reportForm?.get(conInput)?.value) {
            if(this.reportForm?.get(conInput)?.value != "" && this.reportForm?.get(conInput)?.value != null) {
              if(this.reportForm?.get(conInput)?.value != "" && this.reportForm?.get(conInput)?.value != null) {
                checkMin = false;
  
              }

            }
          }
          if(this.reportForm?.get(conInput)?.invalid) {
            this.reportForm?.get(conInput)?.setValue( this.reportForm?.get(conInput)?.value)
          }
        }
      }
      return checkMin ? null : { dateRangeError: true };
    };
  }
 
  allowedTimeWithMinutesToValidator(conInput: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: any = control.value;
      let checkMin = true;


      if (value != '') {
        if (this.reportForm?.get(conInput)?.dirty && !this.reportForm?.get(conInput)?.hasError('required')) {
          
          if (value < this.reportForm?.get(conInput)?.value) {
            if(this.reportForm?.get(conInput)?.value != "" && this.reportForm?.get(conInput)?.value != null) {
              if(this.reportForm?.get(conInput)?.value != "" && this.reportForm?.get(conInput)?.value != null) {
                checkMin = false;
  
              }

            }
          }
          
          if(this.reportForm?.get(conInput)?.invalid) {
            this.reportForm?.get(conInput)?.setValue( this.reportForm?.get(conInput)?.value)
          }
        }
      }
      return checkMin ? null : { dateRangeError: true };
    };
  }
  loadDataDropdown() {
    let department =  this.employeesService.GetForDropDownDepartment({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let zones =  this.employeesService.GetForDropDownZones({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let jobTitle =  this.employeesService.GetForDropDownJobTitle({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });

    // let screenGetForDropDown = this.plansService.screenGetForDropDown({PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    this.loading = true;

    combineLatest({
      department,
      zones,
      jobTitle
    }).subscribe({
      next:data => {



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
    let validAllowMinutes = false;
    let validNoOfRequiredEmployee = false;
    let validPercentageOfDone = false;
    this.reportForm.get("AllowedTimeWithMinutesFrom")?.markAsDirty();
    this.reportForm.get("AllowedTimeWithMinutesTo")?.markAsDirty();
    this.reportForm.get("NoOfRequiredEmployeeFrom")?.markAsDirty();
    this.reportForm.get("NoOfRequiredEmployeeTo")?.markAsDirty();
    this.reportForm.get("PercentageOfDoneFrom")?.markAsDirty();
    this.reportForm.get("PercentageOfDoneTo")?.markAsDirty();
    
    if(this.reportForm.get("AllowedTimeWithMinutesFrom")?.value != null && this.reportForm.get("AllowedTimeWithMinutesTo")?.value != null) {
      validAllowMinutes = true;
    } else {
      if(this.reportForm.get("AllowedTimeWithMinutesFrom")?.value === null && this.reportForm.get("AllowedTimeWithMinutesTo")?.value === null) {
        validAllowMinutes = true;
      } else {
        validAllowMinutes = false;
      }
    }
    if(this.reportForm.get("NoOfRequiredEmployeeFrom")?.value != null && this.reportForm.get("NoOfRequiredEmployeeTo")?.value != null) {
      validNoOfRequiredEmployee = true;
    } else {
      if(this.reportForm.get("NoOfRequiredEmployeeFrom")?.value === null && this.reportForm.get("NoOfRequiredEmployeeTo")?.value === null) {
        validNoOfRequiredEmployee = true;
      } else {
        validNoOfRequiredEmployee = false;
      }
    }
    if(this.reportForm.get("PercentageOfDoneFrom")?.value != null && this.reportForm.get("PercentageOfDoneTo")?.value != null) {
      validPercentageOfDone = true;
    } else {
      if(this.reportForm.get("PercentageOfDoneFrom")?.value === null && this.reportForm.get("PercentageOfDoneTo")?.value === null) {
        validPercentageOfDone = true;
      } else {
        validPercentageOfDone = false;
      }
    }

    if(this.reportForm.valid && this.submitted && validAllowMinutes && validNoOfRequiredEmployee && validPercentageOfDone) {
      this.submitted = false;
      this.getReport(this.reportForm?.value);
    } else {
      this.reportForm.get("DateFrom")?.markAsDirty();
      this.reportForm.get("DateTo")?.markAsDirty();

    }
  }
  removeText = true;

  getReport(filteration) {
    this.loadingReport = true;
    this.reportService.getBriefingSummonsInPeriodReport(filteration)
    .then(response => response.blob())
    .then(blob => {
      this.url = window.URL.createObjectURL(blob);
      this.submitted = true;
      this.loadingReport = false;
      this.show = true;
      this.removeText = false;
    })
    .catch(error => {
      this.submitted = true;
      this.loadingReport = false;
      this.show = true;
      this.removeText = false;

    });
 
  }
 
  request() {

  }
  reset() {
    this.reportForm.get("DateFrom")?.setValue("");
    this.reportForm.get("DateTo")?.setValue("");
    this.reportForm.get("DepartmentIds")?.setValue("");
    this.reportForm.get("JobTitleIds")?.setValue("");
    this.loadDataDropdown();
    this.removeText = true;


    // this.filter();
    this.show = false;

  }
  employeeIDClearData = false;
  departmentIdClearData = false;
  zoneIdClearData = false;
  jobTitleIdData = false;

  searchDropdown(data: any, type: string) {

    switch (type) {

        case 'DepartmentId':
          if (data || data === "") {
            if (data !== this.lastSearchQuery || data === "") {
              this.lastSearchQuery = data;
              this.employeesService.GetForDropDownDepartment({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
                debounceTime(300),
                distinctUntilChanged()).subscribe((res: any) => {
                  let newArray:any[]= [];
                  this.lastSearchQuery = "";
                  res?.data?.forEach((jobTitle: any) => {
                    newArray.push({ name: jobTitle.name, key: jobTitle.id })
                  });
                  newArray = newArray.filter(newItem => 
                    !this.depatmentsList.some(oldItem => oldItem.key === newItem.key)
                  );
                  if(newArray.length > 0){
                    this.depatmentsList = [...this.depatmentsList, ...newArray]
                  } else {
                    if(!res?.data?.length) {
                      this.toast.error("لا يوجد بيانات");
                    }
                  }
                  if(data != "") {
                    this.departmentIdClearData = true;
                  } else {
                    this.departmentIdClearData = false;
      
                  }
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
                    let newArray:any[]= [];
                    this.lastSearchQuery = "";
                    res?.data?.forEach((jobTitle: any) => {
                      newArray.push({ name: jobTitle.name, key: jobTitle.id })
                    });
                    newArray = newArray.filter(newItem => 
                      !this.zonesList.some(oldItem => oldItem.key === newItem.key)
                    );
                    if(newArray.length > 0){
                      this.zonesList = [...this.zonesList, ...newArray]
                    } else {
                      if(!res?.data?.length) {
                        this.toast.error("لا يوجد بيانات");
                      }
                    }
                    if(data != "") {
                      this.zoneIdClearData = true;
                    } else {
                      this.zoneIdClearData = false;
        
                    }
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
                      let newArray:any[]= [];
                      this.lastSearchQuery = "";
                      res?.data?.forEach((jobTitle: any) => {
                        newArray.push({ name: jobTitle.name, key: jobTitle.id })
                      });
                      newArray = newArray.filter(newItem => 
                        !this.jobTitleList.some(oldItem => oldItem.key === newItem.key)
                      );
                      if(newArray.length > 0){
                        this.jobTitleList = [...this.jobTitleList, ...newArray]
                      } else {
                        if(!res?.data?.length) {
                          this.toast.error("لا يوجد بيانات");
                        }
                      }
                      if(data != "") {
                        this.jobTitleIdData = true;
                      } else {
                        this.jobTitleIdData = false;
          
                      }
                    });
                }
              }
              break;
      default:
        
        break;
    }
  }
}
