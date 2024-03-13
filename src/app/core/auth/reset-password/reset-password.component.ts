import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth-service.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  togglePassword = true;
  toggleConfirmPassword = true;

  FormGroup: FormGroup = this.fb.group({
    password: ["", [Validators.required, Validators.minLength(5)]],
    confirmPassword: ["", [Validators.required, Validators.minLength(5), , this.passwordMatchValidator()]]
  });
  private authService = inject(AuthService);
  currentLang = localStorage.getItem("lang");
  countries!: any[];
  loading: boolean = true;
  isLoading = false;
  general: any[] = []
  private router = inject(Router)
  selectedCountry: any = { name: 'عربي', code: 'AR' };
  private route = inject(ActivatedRoute);
  email:string = "";
  resetToken:string = "";

  constructor(private fb: FormBuilder, public translate: TranslateService, private toast: ToastrService) {
  }
  ngOnInit(): void {
    this.countries = [
      { name: 'عربي', code: 'AR' },
      { name: 'انجليزي', code: 'US' }
    ];
    if (this.route.snapshot.queryParamMap.get("email")) {
      this.email = this.route.snapshot.queryParamMap.get("email") as string;
      this.email = this.decodeQueryParameter(this.email);
    };
    if (this.route.snapshot.queryParamMap.get("resetToken")) {
      this.resetToken = this.route.snapshot.queryParamMap.get("resetToken") as string;
      this.resetToken = this.decodeQueryParameter(this.resetToken);
    };
    if (this.currentLang === undefined || this.currentLang === null) {
      this.countries = [
        { name: 'عربي', code: 'AR' },
        { name: 'انجليزي', code: 'US' }
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
        ];
        this.selectedCountry = { name: 'عربي', code: 'AR' };

      } else if (this.currentLang == "en") {
        this.selectedCountry = { name: 'english', code: 'US' };
        document.documentElement.setAttribute('lang', 'en');
        this.translate.use("en");
        this.countries = [
          { name: 'english', code: 'US' },
          { name: 'arabic', code: 'AR' }
        ];
        this.selectedCountry = { name: 'english', code: 'US' };
      } 
    }
  }
  decodeQueryParameter(params: string): string {
    const stringWithSpaces = params.replace(/ /g, '+');
    return decodeURIComponent(stringWithSpaces);
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
        { name: 'english', code: 'US' },
        { name: 'arabic', code: 'AR' }
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
      ];
      let findIndexCountry =  this.countries.findIndex(country =>country.code == "AR" )
      this.selectedCountry = this.countries[findIndexCountry];
    }
  }
  lastSearchQuery = "";
  submit() {
    if (this.FormGroup.valid && this.loading) {
      this.loading = false;
      // this.isLoading = true;
      let formatObject = {
        UserEmail:this.email,
        ResetToken:this.resetToken,
        NewPassword: this.FormGroup.value.password,
        ConfirmNewPassword: this.FormGroup.value.confirmPassword,
      };

      this.authService.ResetPassword(formatObject).subscribe(
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
      this.FormGroup.get("password")?.markAsDirty();
      this.FormGroup.get("confirmPassword")?.markAsDirty();
    }
  }
  getControl(FormControl: string) {
    return this.FormGroup.get(FormControl);
  }
}
