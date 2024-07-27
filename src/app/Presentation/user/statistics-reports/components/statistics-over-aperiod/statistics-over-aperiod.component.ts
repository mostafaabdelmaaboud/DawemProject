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
  selector: 'app-statistics-over-aperiod',
  templateUrl: './statistics-over-aperiod.component.html',
  styleUrls: ['./statistics-over-aperiod.component.scss']
})
export class StatisticsOverAperiodComponent {
  date!: Date;
  mobileQuery: MediaQueryList;
  subscription!: Subscription;
  loading = false;
  id:any;
  allowedTimeWithMinutesRequired = false;
  reportForm: FormGroup = this.fb.group({
    DateFrom: ['', Validators.required],
    DateTo: ['', Validators.required],
    OrderBy:[0]

  });
  private employeesService = inject(EmployeesService);
  private reportService = inject(ReportsService);
  show = false;
  private route = inject(ActivatedRoute);
  lastSearchQuery = "";
  opened = false;
  employeesList:any[] = [];
  depatmentsList:any[] = [];
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
  this.loadDataDropdown();
  }

  loadDataDropdown() {

    // let screenGetForDropDown = this.plansService.screenGetForDropDown({PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    this.loading = false;


  }
  getControl(controlName: string) {
    return this.reportForm?.get(controlName);
  }
  filteration = {

  }
  filter() {

    if(this.reportForm.valid && this.submitted) {
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
    this.reportService.getStatisticsOverAperiodReport(filteration)
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
                  this.depatmentsList = [];
                  this.lastSearchQuery = "";
  
                  res?.data?.forEach((jobTitle: any) => {
                    this.depatmentsList.push({ name: jobTitle.name, key: jobTitle.id })
                  });
                  if(data != "") {
                    this.departmentIdClearData = true;
                  } else {
                    this.departmentIdClearData = false;
      
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
