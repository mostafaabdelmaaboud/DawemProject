import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth-service.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  togglePassword = true;
  toggleConfirmPassword = true;

  FormGroup: FormGroup = this.fb.group({
    name: ["", Validators.required],
    companyName: ["", Validators.required],
    companyCountryId: ["", Validators.required],
    companyAddress: ["", Validators.required],
    companyEmail: ["", [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    password: ["", [Validators.required, Validators.minLength(5)]],
    confirmPassword: ["", [Validators.required, Validators.minLength(5), , this.passwordMatchValidator()]],

    userEmail: ["", [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    userMobileNumber: ["", [Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{8,}$/)]],
    agreed: [, Validators.required],

  });
  private authService = inject(AuthService);
  currentLang = localStorage.getItem("lang");
  countries!: any[];
  loading: boolean = true;
  isLoading = false;
  general: any[] = []
  private router = inject(Router)
  selectedCountry: any = { name: 'السعودية', code: 'AR' };
  constructor(private fb: FormBuilder, public translate: TranslateService, private toast: ToastrService) {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.countries = [
      { name: 'السعودية', code: 'AR' },
      { name: 'الولايات المتحدة', code: 'US' },
      { name: 'الهند', code: 'IN' }
    ];
    this.authService.getCountries({ PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe({
      next: data => {
        this.general = [];
        data.forEach((country: any) => {
          this.general.push({ name: country.globalName, id: country.id })
        });
      },
      error: err => {
      }
    });
    if (this.currentLang === undefined || this.currentLang === null) {
      this.countries = [
        { name: 'السعودية', code: 'AR' },
        { name: 'الولايات المتحدة', code: 'US' },
        { name: 'الهند', code: 'IN' }
      ];
      this.selectedCountry = { name: 'السعودية', code: 'AR' };
      document.documentElement.setAttribute('lang', 'ar');
      this.translate.use("ar");
    } else {
   
      if (this.currentLang == "ar") {
        this.selectedCountry = { name: 'Saudi Arabia', code: 'AR' };
        document.documentElement.setAttribute('lang', 'ar');
        this.translate.use("ar");
        this.countries = [
          { name: 'السعودية', code: 'AR' },
          { name: 'الولايات المتحدة', code: 'US' },
          { name: 'الهند', code: 'IN' }
        ];
        this.selectedCountry = { name: 'السعودية', code: 'AR' };

      }
      else if (this.currentLang == "en") {
        this.selectedCountry = { name: 'United States', code: 'US' };
        document.documentElement.setAttribute('lang', 'en');

        this.translate.use("en");
        this.countries = [
          { name: 'United States', code: 'US' },
          { name: 'Saudi Arabia', code: 'AR' },
          { name: 'India', code: 'IN' }
        ];
        this.selectedCountry = { name: 'United States', code: 'US' };

      } else if (this.currentLang == "ind") {
        this.selectedCountry = { name: 'India', code: 'IN' };
        document.documentElement.setAttribute('lang', 'en');
        this.translate.use("ind");
        this.countries = [
          { name: 'India', code: 'IN' },
          { name: 'Saudi Arabia', code: 'AR' },
          { name: 'United States', code: 'US' }
        ];
        this.selectedCountry = { name: 'India', code: 'IN' };

      }
    }
  }
  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      let passwordMismatch = false;
      if (value != "") {
        passwordMismatch = this.getControl('password')?.value != value;

      }
      return passwordMismatch ? { passwordMismatch: true } : null;
    };
  }
  changeLanguage(lang: any) {
    lang.value;
    if (lang.value.code === "US") {
      document.documentElement.setAttribute('lang', 'en');
      localStorage.setItem("lang", "en");
      this.translate.use("en");
      this.countries = [
        { name: 'United States', code: 'US' },
        { name: 'Saudi Arabia', code: 'AR' },
        { name: 'India', code: 'IN' }
      ];
      
      let findIndexCountry =  this.countries.findIndex(country =>country.code == "US" )
      this.selectedCountry = this.countries[findIndexCountry];
    } else if (lang.value.code == "AR") {
      document.documentElement.setAttribute('lang', 'ar');
      localStorage.setItem("lang", "ar");
      this.translate.use("ar");
      this.countries = [
        { name: 'السعودية', code: 'AR' },
        { name: 'الولايات المتحدة', code: 'US' },
        { name: 'الهند', code: 'IN' }
      ];
      let findIndexCountry =  this.countries.findIndex(country =>country.code == "AR" )
      this.selectedCountry = this.countries[findIndexCountry];
    } else if (lang.value.code == "IN") {
      document.documentElement.setAttribute('lang', 'en');
      localStorage.setItem("lang", "ind");
      this.translate.use("ind");

      this.countries = [
        { name: 'India', code: 'IN' },
        { name: 'Saudi Arabia', code: 'AR' },
        { name: 'United States', code: 'US' }
      ];
      let findIndexCountry =  this.countries.findIndex(country =>country.code == "IN" )
      this.selectedCountry = this.countries[findIndexCountry];

    }
  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'companyCountryId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.authService.getCountries({PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.general = [];
                res.forEach((country: any) => {
                  this.general.push({ name: country.globalName, id: country.id })
                });
              });
          }

        }
        break;

      default:
        break;
    }
  }
  submit() {

    if (this.FormGroup.valid && this.loading) {
      this.loading = false;
      // this.isLoading = true;

      let formatObject = {
        name: this.FormGroup.value.name,
        companyName: this.FormGroup.value.companyName,
        companyCountryId: this.FormGroup.value.companyCountryId.id,
        companyAddress: this.FormGroup.value.companyAddress,
        companyEmail: this.FormGroup.value.companyEmail,
        password: this.FormGroup.value.password,
        confirmPassword: this.FormGroup.value.confirmPassword,

        userEmail: this.FormGroup.value.userEmail,
        userMobileNumber: this.FormGroup.value.userMobileNumber,
        agreed: this.FormGroup.value.agreed ? this.FormGroup.value.agreed[0] : false,
      };

      this.authService.signup(formatObject).subscribe(
        {
          next: (res: any) => {
            this.toast.success(res.message);

            // this.authService.setToken(res.data.token);
            // this.isLoading = false;

            this.router.navigate(["/login"]);

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
      this.FormGroup.get("name")?.markAsDirty();
      this.FormGroup.get("companyName")?.markAsDirty();
      this.FormGroup.get("companyCountryId")?.markAsDirty();
      this.FormGroup.get("companyAddress")?.markAsDirty();
      this.FormGroup.get("companyEmail")?.markAsDirty();
      this.FormGroup.get("password")?.markAsDirty();

      this.FormGroup.get("confirmPassword")?.markAsDirty();
      this.FormGroup.get("userEmail")?.markAsDirty();
      this.FormGroup.get("userMobileNumber")?.markAsDirty();
      this.FormGroup.get("agreed")?.markAsDirty();

    }
  }
  getControl(FormControl: string) {
    return this.FormGroup.get(FormControl);
  }
}
