import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ChangeDetectorRef, Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth-service.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent {
  togglePassword = true;
  FormGroup: FormGroup = this.fb.group({
    Email: ["", [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]]
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
    //   { name: 'عربي', code: 'AR' },
    //   { name: 'انجليزي', code: 'US' },
    //   { name: 'الهند', code: 'IN' }
    // ];
    // this.selectedCountry = { name: 'عربي', code: 'AR' };
    if (this.currentLang === undefined || this.currentLang === null) {
      this.countries = [
        { name: 'عربي', code: 'AR' },
        { name: 'انجليزي', code: 'US' }
      ];
      this.selectedCountry = { name: 'عربي', code: 'AR' };
      document.documentElement.setAttribute('lang', 'ar');
      this.translate.use("ar");
    } else {

   
      this.selectedCountry = { name: 'arabic', code: 'AR' };

      if (this.currentLang == "ar") {
        document.documentElement.setAttribute('lang', 'ar');
        this.translate.use("ar");
        this.countries = [
          { name: 'عربي', code: 'AR' },
          { name: 'انجليزي', code: 'US' }
        ];
        this.selectedCountry = { name: 'عربي', code: 'AR' };

      }
      else if (this.currentLang == "en") {
        this.selectedCountry = { name: 'english', code: 'US' };
        document.documentElement.setAttribute('lang', 'en');
        this.translate.use("en");
        this.countries = [
          { name: 'english', code: 'US' },
          { name: 'arabic', code: 'AR' },
        ];
        this.selectedCountry = { name: 'english', code: 'US' };
      } 
      // else if (this.currentLang == "ind") {
      //   this.selectedCountry = { name: 'India', code: 'IN' };
      //   document.documentElement.setAttribute('lang', 'en');
      //   this.translate.use("ind");
      //   this.countries = [
      //     { name: 'India', code: 'IN' },

      //     { name: 'arabic', code: 'AR' },
      //     { name: 'english', code: 'US' }
      //   ];
      //   this.selectedCountry = { name: 'India', code: 'IN' };

      // }

    }
  }
  changeLanguage(lang: any) {
    this.countries = [];
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
      ];
      let findIndexCountry =  this.countries.findIndex(country =>country.code == "AR" )
      this.selectedCountry = this.countries[findIndexCountry];

    } 
    // else if (lang.value.code == "IN") {
    //   document.documentElement.setAttribute('lang', 'en');
    //   localStorage.setItem("lang", "ind");
    //   this.translate.use("ind");
    //   this.countries = [
    //     { name: 'India', code: 'IN' },

    //     { name: 'arabic', code: 'AR' },
    //     { name: 'english', code: 'US' }
    //   ];
    //   let findIndexCountry =  this.countries.findIndex(country =>country.code == "IN" )
    //   this.selectedCountry = this.countries[findIndexCountry];
    // }
    this.cd.detectChanges();
  }
  submit() {
    
    if (this.FormGroup.valid && this.loading) {
      

      this.loading = false;
      this.isLoading = true;
      this.authService.signup({
        UserEmail: this.FormGroup.value.Email,
      }).subscribe(
        {
          next: (res: any) => {
            // let formatObjectPermissions = JSON.stringify({ isAdmin: res.data.isAdmin, availablePermissions: res.data.availablePermissions })
            // localStorage.setItem("permissions", formatObjectPermissions);
            // let parseJson = JSON.parse(formatObjectPermissions);
            // if (parseJson.isAdmin || parseJson.availablePermissions.length > 0) {
            //   this.authService.setToken(res.data.token);
            //   this.toast.success(res.message,"", {timeOut: 1000});


            //   this.router.navigate(["/user/dashboard"]);
            //   this.isLoading = false;

            // } else {
            //   this.toast.error("you don't have permissions");
            // this.isLoading = false;

            // }
            this.loading = true;
            this.isLoading = false;
            

            this.router.navigate([`/checkEmail`], { queryParams: { email: this.FormGroup.value.Email } })

            this.toast.success(res.message,"", {timeOut: 1000});
          


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
    }
  }
  getControl(FormControl: string) {
    return this.FormGroup.get(FormControl);
  }
}
