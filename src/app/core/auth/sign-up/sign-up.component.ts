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
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  togglePassword = true;
  toggleConfirmPassword = true;
  private dialog = inject(MatDialog);

  FormGroup: FormGroup = this.fb.group({
    // name: ["", Validators.required],
    companyName: ["", Validators.required],
    companyCountryId: ["", Validators.required],
    // companyAddress: ["", Validators.required],
    companyEmail: ["", [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    password: ["", [Validators.required, Validators.minLength(5)]],
    confirmPassword: ["", [Validators.required, Validators.minLength(5), , this.passwordMatchValidator()]],
    // numberOfEmployees: ["", Validators.required],
    // userEmail: ["", [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    userMobileNumber: ["", [Validators.required]],
    // IsTrial: [false],
    // subscriptionDurationInMonths: ["", [Validators.required]],
    agreed: [, Validators.required],

  });
  // subscription = true;
  code="+20";
  private authService = inject(AuthService);
  currentLang = localStorage.getItem("lang");
  countries!: any[];
  loading: boolean = true;
  isLoading = false;
  general: any[] = [];
  countriesPhone: any[] = [];
  isCurrentCountry;
  isCurrentCountryGeneral;

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
      //   this.FormGroup.get("userMobileNumber")?.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)])

      //   this.code= "+91";

      // }
    }
    this.getCountries();
    // this.FormGroup.get("IsTrial")?.valueChanges.subscribe(data => {

    //   if (data) {
    //     this.subscription = false;

    //     this.FormGroup.removeControl("subscriptionDurationInMonths");
    //   } else {
    //     this.FormGroup.addControl("subscriptionDurationInMonths", this.fb.control("", [Validators.required]));

    //     this.subscription = true;

    //   }
    // })
  }
  getCountries() {
    this.authService.getCountries({ PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe({
      next: data => {
        this.countriesPhone = [];

        this.general = [];
        data.forEach((country: any) => {
          this.general.push({ name: country.name, id: country.id });
          this.countriesPhone.push({ name: country.name,dial:country.dial,phoneLength:country.phoneLength, id: country.id, flagPath:country.flagPath });
          if(country.isCurrentCountry) {
            this.isCurrentCountry = { name: country.name,dial:country.dial,phoneLength:country.phoneLength, id: country.id, flagPath:country.flagPath };
            this.isCurrentCountryGeneral = { name: country.name, id: country.id };

            this.selectCountry();
          }
        });
      },
      error: err => {
      }
    });
  }
  selectCountry() {
    const pattern = new RegExp(`^\\d{${this.isCurrentCountry.phoneLength}}$`);
    this.FormGroup.get("userMobileNumber")?.setValidators([Validators.required, Validators.pattern(pattern)])
    this.code= "+"+this.isCurrentCountry.phoneLength;
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
        // { name: 'India', code: 'IN' }
      ];
      let findIndexCountry =  this.countries.findIndex(country =>country.code == "US" )
      this.selectedCountry = this.countries[findIndexCountry];


      this.getCountries();

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

      this.getCountries();

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
    //   this.FormGroup.get("userMobileNumber")?.reset();

    //   this.FormGroup.get("userMobileNumber")?.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)])
    //   this.code= "+91";
    // }
  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'companyCountryId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.authService.getCountries({PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.general = [];
                this.lastSearchQuery = "";
                res.forEach((country: any) => {
                  this.general.push({ name: country.name, id: country.id })
                });
              });
          }

        }
        break;
        case 'countriesPhoneId':
          if (data || data === "") {
            if (data !== this.lastSearchQuery || data === "") {
              this.lastSearchQuery = data;
              this.authService.getCountries({PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
                debounceTime(300),
                distinctUntilChanged()).subscribe((res: any) => {
                  this.countriesPhone = [];
                  this.lastSearchQuery = "";
                  res.forEach((country: any, i:number) => {
                    this.countriesPhone.push({ name: country.name,dial:country.dial,phoneLength:country.phoneLength, id: country.id, flagPath:country.flagPath });
                    if(i === 0) {
                      this.isCurrentCountry ={ name: country.name,dial:country.dial,phoneLength:country.phoneLength, id: country.id, flagPath:country.flagPath  }
                    }
                  });
                  if(res?.length > 0) {
                    this.selectCountry();

                    }
                });
            }
  
          }
          break;
        
      default:
        break;
    }
  }
  submit() {
    if (this.FormGroup.valid && this.loading && this.FormGroup.value.agreed) {
      this.loading = false;
      this.isLoading = true;
      debugger;
      let formatObject:any = {
        // name: this.FormGroup.value.name,
        companyName: this.FormGroup.value.companyName,
        companyCountryId: this.FormGroup.value.companyCountryId.id,
        // companyAddress: this.FormGroup.value.companyAddress,
        companyEmail: this.FormGroup.value.companyEmail,
        password: this.FormGroup.value.password,
        confirmPassword: this.FormGroup.value.confirmPassword,
        // userEmail: this.FormGroup.value.userEmail,
        userMobileCountryId:this.isCurrentCountry.id,
        userMobileNumber:this.FormGroup.value.userMobileNumber,
        // numberOfEmployees:this.FormGroup.value.numberOfEmployees,
        agreed: this.FormGroup.value.agreed ? this.FormGroup.value.agreed : false,
        // IsTrial:this.FormGroup.value.IsTrial

      };
      debugger;

      // if(this.subscription) {
      //   formatObject.subscriptionDurationInMonths = this.FormGroup.value.subscriptionDurationInMonths;
      // } else {
      //   formatObject.subscriptionDurationInMonths = null;
      // }

      this.authService.signup(formatObject).subscribe(
        {
          next: (res: any) => {
            this.toast.success(res.message);

            // this.authService.setToken(res.data.token);
            this.isLoading = false;
            this.loading = true;

            this.router.navigate(["/login"]);

            // this.loading = true;

          },
          error: err => {
            this.isLoading = false;

            this.loading = true;

            this.toast.error(err.error.message);
            // this.isLoading = false;

          }
        }
      )
    } else {
      this.isLoading = false;

      this.loading = true;

      // this.FormGroup.get("name")?.markAsDirty();
      this.FormGroup.get("companyName")?.markAsDirty();
      this.FormGroup.get("companyCountryId")?.markAsDirty();
      // this.FormGroup.get("companyAddress")?.markAsDirty();
      this.FormGroup.get("companyEmail")?.markAsDirty();
      this.FormGroup.get("password")?.markAsDirty();
      // this.FormGroup.get("numberOfEmployees")?.markAsDirty();
      // if(this.subscription) {
      //   this.FormGroup.get("subscriptionDurationInMonths")?.markAsDirty();
      // }
      this.FormGroup.get("confirmPassword")?.markAsDirty();
      // this.FormGroup.get("userEmail")?.markAsDirty();
      this.FormGroup.get("userMobileNumber")?.markAsDirty();
      this.FormGroup.get("agreed")?.markAsDirty();
      if(!this.FormGroup.value.agreed) {
        this.toast.error("برجاء اختيار الشروط والاحكام", '', {
          timeOut: 5000,
          onActivateTick: true
        });
      }

    }
  }
  requestTermsAndConditions() {
    const dialogRefAddCurrency = this.dialog.open(TermsAndConditionsComponent, {
      width: "50vw",
      data: {
        title: "الشروط والأحكام",
        setAsNecessary: "تعيين كضرورية",
        titleVacationTypeId: "نوع الاسنئذان <span class='color-red'>*</span>",
        titleName: "الأسم<span class='color-red'>*</span>",
        placeholdeName: "برجاء ادخال الأسم",
        validationtitleName: "الأسم مطلوب",
        buttonSend: "مقبول"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editJobTitle = false;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      this.FormGroup.get("agreed")?.setValue(result);
            dialogRefAddCurrency.close();

      dialogRefAddCurrency.componentInstance.submitted = true;
      // this.responsibilityService.createResponsibility(formData).subscribe(
      //   {
      //     next: (data: any) => {


      //       dialogRefAddCurrency.componentInstance.submitted = true;

      //       dialogRefAddCurrency.close();

      //       const succressDialog = this.dialog.open(ToastSuccessComponent, {
      //         width: "30vw",
      //         data: {
      //           title: "تم ارسال طلبك",
      //           message: data.message,
      //           buttonSend: "طلبات المسؤوليات"

      //         },
      //       });
      //       this.getResponsibility(this.filteration);

      //       setTimeout(() => {
      //         succressDialog.close();

      //       }, 2000);
      //       succressDialog.componentInstance.submitted = true;
      //       succressDialog.componentInstance.submitClicked.subscribe(result => {
      //         succressDialog.close();
      //       })

      //     },
      //     error: (err: any) => {

      //       dialogRefAddCurrency.componentInstance.submitted = true;

      //     }
      //   }
      // )
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {
        this.FormGroup.get("agreed")?.setValue(result);

      }
    });
  }
  getControl(FormControl: string) {
    return this.FormGroup.get(FormControl);
  }
}
