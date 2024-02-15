import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  togglePassword = true;
  FormGroup: FormGroup = this.fb.group({
    Email: ["", [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    password: ["", [Validators.required, Validators.minLength(5)]]
  });
  private authService = inject(AuthService);
  currentLang = localStorage.getItem("lang");
  countries!: any[];
  loading: boolean = true;
  isLoading = false;
  private router = inject(Router)
  selectedCountry: any;
  constructor(private fb: FormBuilder, public translate: TranslateService, private toast: ToastrService, private cd:ChangeDetectorRef) {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.countries = [
    //   { name: 'السعودية', code: 'AR' },
    //   { name: 'الولايات المتحدة', code: 'US' },
    //   { name: 'الهند', code: 'IN' }
    // ];
    // this.selectedCountry = { name: 'السعودية', code: 'AR' };

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

   
      this.selectedCountry = { name: 'Egypt', code: 'AR' };

      if (this.currentLang == "ar") {
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
          { name: 'Egypt', code: 'AR' },
          { name: 'India', code: 'IN' }
        ];
        this.selectedCountry = { name: 'United States', code: 'US' };
      } else if (this.currentLang == "ind") {
        this.selectedCountry = { name: 'India', code: 'IN' };
        document.documentElement.setAttribute('lang', 'en');
        this.translate.use("ind");
        this.countries = [
          { name: 'India', code: 'IN' },

          { name: 'Egypt', code: 'AR' },
          { name: 'United States', code: 'US' }
        ];
        this.selectedCountry = { name: 'India', code: 'IN' };

      }

    }
  }
  changeLanguage(lang: any) {
    this.countries = [];
    if (lang.value.code === "US") {
      document.documentElement.setAttribute('lang', 'en');
      localStorage.setItem("lang", "en");
      this.translate.use("en");
      this.countries = [
        { name: 'United States', code: 'US' },
        { name: 'Egypt', code: 'AR' },
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

        { name: 'Egypt', code: 'AR' },
        { name: 'United States', code: 'US' }
      ];
      let findIndexCountry =  this.countries.findIndex(country =>country.code == "IN" )
      this.selectedCountry = this.countries[findIndexCountry];
    }
    this.cd.detectChanges();
  }
  submit() {

    if (this.FormGroup.valid && this.loading) {
      this.loading = false;
      this.isLoading = true;
      this.authService.login({
        Email: this.FormGroup.value.Email,
        Password: this.FormGroup.value.password,
        RememberMe: true,
        ApplicationType: 1
      }).subscribe(
        {
          next: (res: any) => {
            let formatObjectPermissions = JSON.stringify({ isAdmin: res.data.isAdmin, availablePermissions: res.data.availablePermissions })
            localStorage.setItem("permissions", formatObjectPermissions);
            let parseJson = JSON.parse(formatObjectPermissions);
            if (parseJson.isAdmin || parseJson.availablePermissions.length > 0) {
              this.authService.setToken(res.data.token);
              this.toast.success(res.message,"", {timeOut: 1000});
              
              this.router.navigate(["/user/dashboard"]);
            } else {
              this.toast.error("you don't have permissions");

            }
            this.isLoading = false;

            this.loading = true;

          },
          error: err => {
            this.toast.error(err.error.message);
            this.isLoading = false;

            this.loading = true;
          }
        }
      )
    } else {
      this.FormGroup.get("Email")?.markAsDirty();
      this.FormGroup.get("password")?.markAsDirty();
    }
  }
  getControl(FormControl: string) {
    return this.FormGroup.get(FormControl);
  }
}
