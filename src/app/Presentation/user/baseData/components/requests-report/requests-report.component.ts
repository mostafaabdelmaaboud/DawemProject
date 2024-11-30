import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';
import { Subject, Subscription, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { EmployeesService } from '../../../employees/services/employees.service';
import { BaseDataService } from '../../services/base-data.service';

@Component({
  selector: 'app-requests-report',
  templateUrl: './requests-report.component.html',
  styleUrls: ['./requests-report.component.scss']
})
export class RequestsReportComponent {
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
  private searchSubject = new Subject<{ value: any; type: any }>();

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
  this.searchSubject
  .pipe(
    debounceTime(500),
    distinctUntilChanged((prev, curr) =>  prev.value === curr.value && prev.type === curr.type
  ) 
  )
  .subscribe(({ value, type }) => {
    this.searchDropdown(value, type, true);
  });
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
    this.baseDataService.getRequestsReport(filteration)
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

    this.reportForm.get("FreeText")?.reset();
    this.reportForm.get("DateFrom")?.reset();
    this.reportForm.get("DateTo")?.reset();
    this.reportForm.get("EmployeeIds")?.reset();
    this.reportForm.get("DepartmentIds")?.reset();
    this.reportForm.get("GroupIds")?.reset();
    this.loadDataDropdown();
    this.removeText = true;


    // this.filter();
    this.show = false;

  }
  searchList(target:any, type:any) {
    let value = target.value;

    this.searchSubject.next({ value, type }); 

  }
  employeeIDClearData = false;
  departmentIdClearData = false;
  zoneIdClearData = false;
  jobTitleIdData = false;

  sortArrayBySearchTerm(
    array: { name: string; key: number }[],
    searchTerm: string
  ): { name: string; key: number }[] {
    return array.sort((a, b) => {
      const aIndex = a.name.indexOf(searchTerm);
      const bIndex = b.name.indexOf(searchTerm);
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });
  }
  searchDropdown(data: any, type: string, searchInput?) {

    switch (type) {
      case 'EmployeeID':
        if (data || data === "") {
            this.lastSearchQuery = data;
            this.employeesService.GetForDropDownEmployee({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              distinctUntilChanged()).subscribe((res: any) => {
                let newArray:any[]= [];
                this.lastSearchQuery = "";
                res?.data?.forEach((jobTitle: any) => {
                  newArray.push({ name: jobTitle.name, key: jobTitle.id })
                });
                newArray = newArray.filter(newItem => 
                  !this.employeesList.some(oldItem => oldItem.key === newItem.key)
                );
                const searchTerm = data;

                if(res?.data?.length > 0 || searchInput){
                  if(newArray?.length >0) {
                    this.employeesList = [...this.employeesList, ...newArray]
                  }
                  let formatSearch = this.sortArrayBySearchTerm(this.employeesList, searchTerm);
                  this.employeesList = [...formatSearch];
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
        break;
        case 'DepartmentId':
          if (data || data === "") {
              this.lastSearchQuery = data;
              this.employeesService.GetForDropDownDepartment({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
                distinctUntilChanged()).subscribe((res: any) => {
                  let newArray:any[]= [];
                  this.lastSearchQuery = "";
                  res?.data?.forEach((jobTitle: any) => {
                    newArray.push({ name: jobTitle.name, key: jobTitle.id })
                  });
                  newArray = newArray.filter(newItem => 
                    !this.depatmentsList.some(oldItem => oldItem.key === newItem.key)
                  );
                  const searchTerm = data;
                  if(res?.data?.length > 0 || searchInput){
                    if(newArray?.length >0) {
                      this.depatmentsList = [...this.depatmentsList, ...newArray]
                    }
                    let formatSearch = this.sortArrayBySearchTerm(this.depatmentsList, searchTerm);
                    this.depatmentsList = [...formatSearch];
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
          break;
          case 'GroupId':
            if (data || data === "") {
                this.lastSearchQuery = data;
                this.baseDataService.groupsForDropdown({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
                  distinctUntilChanged()).subscribe((res: any) => {
                    let newArray:any[]= [];
                    this.lastSearchQuery = "";
                    res?.data?.forEach((jobTitle: any) => {
                      newArray.push({ name: jobTitle.name, key: jobTitle.id })
                    });
                    newArray = newArray.filter(newItem => 
                      !this.groupsList.some(oldItem => oldItem.key === newItem.key)
                    );
                    const searchTerm = data;
                    if(res?.data?.length > 0 || searchInput){
                      if(newArray?.length >0) {
                        this.groupsList = [...this.groupsList, ...newArray]
                      }
                      let formatSearch = this.sortArrayBySearchTerm(this.groupsList, searchTerm);
                      this.groupsList = [...formatSearch];
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
            break;
     
      default:
        
        break;
    }
  }
}
