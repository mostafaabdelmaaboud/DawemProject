import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { EmployeesService } from '../../../employees/services/employees.service';
import { BaseDataService } from '../../services/base-data.service';

@Component({
  selector: 'app-schedule-plan-logs-report',
  templateUrl: './schedule-plan-logs-report.component.html',
  styleUrls: ['./schedule-plan-logs-report.component.scss']
})
export class SchedulePlanLogsReportComponent {
  date!: Date;
  mobileQuery: MediaQueryList;
  subscription!: Subscription;
  loading = false;
  id:any;
  reportForm: FormGroup = this.fb.group({
    FreeText: [''],
    DateFrom: ['', [Validators.required, this.dateFromValidator("DateTo")]],
    DateTo: ['', [Validators.required, this.dateToValidator("DateFrom")]],
    EmployeeIds:[''],
    DepartmentIds:[''],
    GroupIds:['']
  });
  private employeesService = inject(EmployeesService);
  private baseDataService = inject(BaseDataService);
  show = false;
  private route = inject(ActivatedRoute);
  lastSearchQuery = "";
  opened = false;
  employeesList:any[] = [];
  depatmentsList:any[] = [];
  groupsList:any[] = [];
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
  loadDataDropdown() {
    let employee = this.employeesService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let department =  this.employeesService.GetForDropDownDepartment({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let groups =  this.baseDataService.groupsForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    // let screenGetForDropDown = this.plansService.screenGetForDropDown({PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    this.loading = true;

    combineLatest({
      employee,
      department,
      groups
      
    }).subscribe({
      next:data => {

        data?.employee?.data?.forEach((employee: any) => {
          this.employeesList.push({ name: employee.name, key: employee.id })
        });

        data?.department?.data?.forEach((department: any) => {
          this.depatmentsList.push({ name: department.name, key: department.id })
        });
        data?.groups?.data?.forEach((zone: any) => {
          this.groupsList.push({ name: zone.name, key: zone.id })
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

      // this.filteration.PageNumber = 0;
      this.getReport(this.reportForm?.value);
    } else {
      this.reportForm.get("DateFrom")?.markAsDirty();
      this.reportForm.get("DateTo")?.markAsDirty();


    }
  }
  removeText = true;
  getReport(filteration) {
    this.loadingReport = true;
    this.baseDataService.getSchedulePlanLogsReport(filteration)
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
 
  reset() {

    this.reportForm.get("FreeText")?.setValue("");
    this.reportForm.get("DateFrom")?.setValue("");
    this.reportForm.get("DateTo")?.setValue("");
    this.reportForm.get("EmployeeIds")?.setValue("");
    this.reportForm.get("DepartmentIds")?.setValue("");
    this.reportForm.get("GroupIds")?.setValue("");
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
      case 'EmployeeID':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.employeesService.GetForDropDownEmployee({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                let newArray:any[]= [];
                this.lastSearchQuery = "";
                res?.data?.forEach((jobTitle: any) => {
                  newArray.push({ name: jobTitle.name, key: jobTitle.id })
                });
                newArray = newArray.filter(newItem => 
                  !this.employeesList.some(oldItem => oldItem.key === newItem.key)
                );
                if(newArray.length > 0){
                  this.employeesList = [...this.employeesList, ...newArray]
                } else {
                  if(!res?.data?.length) {
                    this.toast.error("لا يوجد بيانات");
                  }
                }

                if(data != "") {
                  this.employeeIDClearData = true;
                } else {
                  this.employeeIDClearData = false;
    
                }
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
          case 'GroupId':
            if (data || data === "") {
              if (data !== this.lastSearchQuery || data === "") {
                this.lastSearchQuery = data;
                this.baseDataService.groupsForDropdown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
                  debounceTime(300),
                  distinctUntilChanged()).subscribe((res: any) => {
                    let newArray:any[]= [];
                    this.lastSearchQuery = "";
                    res?.data?.forEach((jobTitle: any) => {
                      newArray.push({ name: jobTitle.name, key: jobTitle.id })
                    });
                    newArray = newArray.filter(newItem => 
                      !this.groupsList.some(oldItem => oldItem.key === newItem.key)
                    );
                    if(newArray.length > 0){
                      this.groupsList = [...this.groupsList, ...newArray]
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
     
      default:
        
        break;
    }
  }
}
