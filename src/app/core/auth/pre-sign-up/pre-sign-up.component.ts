import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth-service.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TermsAndConditionsComponent } from 'src/app/shared/components/terms-and-conditions/terms-and-conditions.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pre-sign-up',
  templateUrl: './pre-sign-up.component.html',
  styleUrls: ['./pre-sign-up.component.scss']
})
export class PreSignUpComponent {
  togglePassword = true;
  toggleConfirmPassword = true;
  private dialog = inject(MatDialog);

  FormGroup: FormGroup = this.fb.group({
    CompanyVerificationCode: ["", Validators.required],
    EmployeeNumber: ["", Validators.required]

  });
  code="+20";
  private authService = inject(AuthService);
  currentLang = localStorage.getItem("lang");
  countries!: any[];
  loading: boolean = true;
  isLoading = false;
  general: any[] = [];
  countriesPhone: any[] = [];
  isCurrentCountry;
  private router = inject(Router)
  selectedCountry: any = { name: 'عربي', code: 'AR' };
  constructor(private fb: FormBuilder, public translate: TranslateService, private toast: ToastrService) {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.countries = [
      { name: 'عربي', code: 'AR' },
      { name: 'انجليزي', code: 'US' }
      // { name: 'الهند', code: 'IN' }
    ];
    if (this.currentLang === undefined || this.currentLang === null) {
      this.countries = [
        { name: 'عربي', code: 'AR' },
        { name: 'انجليزي', code: 'US' }
        // { name: 'الهند', code: 'IN' }
      ];
      this.selectedCountry = { name: 'عربي', code: 'AR' };
      document.documentElement.setAttribute('lang', 'ar');
      this.translate.use("ar");
    } else {
      if (this.currentLang == "ar") {
        this.selectedCountry = { name: 'arabic', code: 'AR' };
        document.documentElement.setAttribute('lang', 'ar');
        this.translate.use("ar");
        this.countries = [
          { name: 'عربي', code: 'AR' },
          { name: 'انجليزي', code: 'US' }
          // { name: 'الهند', code: 'IN' }
        ];
        this.selectedCountry = { name: 'عربي', code: 'AR' };
    

      } else if (this.currentLang == "en") {
        this.selectedCountry = { name: 'english', code: 'US' };
        document.documentElement.setAttribute('lang', 'en');
        this.translate.use("en");
        this.countries = [
          { name: 'english', code: 'US' },
          { name: 'arabic', code: 'AR' }
          // { name: 'India', code: 'IN' }
        ];
        this.selectedCountry = { name: 'english', code: 'US' };
      } 
    }
  }
  changeLanguage(lang: any) {
    lang.value;
    if (lang.value.code === "US") {
      document.documentElement.setAttribute('lang', 'en');
      localStorage.setItem("lang", "en");
      this.translate.use("en");
      this.countries = [
        { name: 'english', code: 'US' },
        { name: 'arabic', code: 'AR' }
        // { name: 'India', code: 'IN' }
      ];
      let findIndexCountry =  this.countries.findIndex(country =>country.code == "US" )
      this.selectedCountry = this.countries[findIndexCountry];
    } else if (lang.value.code == "AR") {
      document.documentElement.setAttribute('lang', 'ar');
      localStorage.setItem("lang", "ar");
      this.translate.use("ar");
      this.countries = [
        { name: 'عربي', code: 'AR' },
        { name: 'انجليزي', code: 'US' }
        // { name: 'الهند', code: 'IN' }
      ];
      let findIndexCountry =  this.countries.findIndex(country =>country.code == "AR" )
      this.selectedCountry = this.countries[findIndexCountry];
    } 
  }
  submit() {
    // this.router.navigate(["/signUp"], {queryParams:{CompanyVerificationCode:this.FormGroup.value.CompanyVerificationCode,EmployeeNumber:this.FormGroup.value.EmployeeNumber}});

    if (this.FormGroup.valid && this.loading) {
      this.loading = false;
      // this.isLoading = true;
      let formatObject:any = {
        CompanyVerificationCode: this.FormGroup.value.CompanyVerificationCode,
        EmployeeNumber: this.FormGroup.value.EmployeeNumber,
      };
      this.authService.preSignup(formatObject).subscribe(
        {
          next: (res: any) => {
            this.toast.success(res.message);
            // this.authService.setToken(res.data.token);
            // this.isLoading = false;
            this.router.navigate(["/signUp"], {queryParams:{CompanyVerificationCode:this.FormGroup.value.CompanyVerificationCode,EmployeeNumber:this.FormGroup.value.EmployeeNumber}});
            // this.loading = true;
          },
          error: err => {
            this.toast.error(err.error.message);
            // this.isLoading = false;
            this.loading = true;
          }
        }
      )
    } else {
      this.FormGroup.get("CompanyVerificationCode")?.markAsDirty();
      this.FormGroup.get("EmployeeNumber")?.markAsDirty();
    }
  }
  getControl(FormControl: string) {
    return this.FormGroup.get(FormControl);
  }
}
