import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TermsAndConditionsComponent } from 'src/app/shared/components/terms-and-conditions/terms-and-conditions.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
  selector: 'app-update-company',
  templateUrl: './update-company.component.html',
  styleUrls: ['./update-company.component.scss']
})
export class UpdateCompanyComponent {
  togglePassword = true;
  toggleConfirmPassword = true;
  private dialog = inject(MatDialog);

  FormGroup: FormGroup = this.fb.group({
    name: [""],
    companyName: [""],
    website: [""],
    companyCountryId: [""],
    headquarterAddress: [""],
    headquarterLocation:[""],
    numberOfEmployees: [""],
    totalNumberOfEmployees: [""],
    industries: [""],
    email: ["", [Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    userMobileNumber: [""],
    IsTrial: [false],
    code:[''],
    preferredLanguageId:[''],
    identityCode:[''],
    agreed: [],

  });
  subscription = true;
  code="+20";
  private authService = inject(AuthService);
  currentLang = localStorage.getItem("lang");
  countries!: any[];
  loading: boolean = true;
  isLoading = false;
  general: any[] = [];
  preferredLanguages: any[] = [];
  countriesPhone: any[] = [];
  isCurrentCountry;
  private router = inject(Router)
  selectedCountry: any = { name: 'عربي', code: 'AR' };
  imageChangedEvent: any;
  selectImage = false;
  userPicture: any;
  companyLogo:any;
  croppedImage: any;
  industries:any[] = [];
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
    this.getLanguages();
    this.getCountriesbyPhone();
    this.FormGroup.get("IsTrial")?.valueChanges.subscribe(data => {

      if (data) {
        this.subscription = false;

      } else {

        this.subscription = true;

      }
    })
  }
  addIndustries() {
    if(this.FormGroup.get("industries")?.value) {
      let valueText = this.FormGroup.get("industries")?.value;
      let findIndexIndustries = this.industries.findIndex(item => item.Name === valueText);
      if(findIndexIndustries <0) {
        this.industries.push({Id:0, Name:valueText});
        this.FormGroup.get("industries")?.reset();
      }
    }
  }
  removeIndustry(index) {
    this.industries.splice(index, 1);
  }
  getCountries() {
    this.authService.getCountries({ PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe({
      next: data => {
        this.general = [];
        data.forEach((country: any) => {
          this.general.push({ name: country.name, id: country.id })
        });
      },
      error: err => {
      }
    });
  }
  getLanguages() {
    this.authService.getLanguages({ PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe({
      next: data => {
        this.preferredLanguages = [];
        data.forEach((country: any) => {
          this.preferredLanguages.push({ name: country.name, id: country.id })
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
  getCountriesbyPhone() {
    this.authService.getCountries({ PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe({
      next: data => {
        this.countriesPhone = [];
        data.forEach((country: any) => {
          
          this.countriesPhone.push({ name: country.name,dial:country.dial,phoneLength:country.phoneLength, id: country.id, flagPath:country.flagPath });
          if(country.isCurrentCountry) {
            this.isCurrentCountry = { name: country.name,dial:country.dial,phoneLength:country.phoneLength, id: country.id, flagPath:country.flagPath };
            this.selectCountry();
          }
        });
      },
      error: err => {
      }
    });
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
        case 'preferredLanguageId':
          if (data || data === "") {
            if (data !== this.lastSearchQuery || data === "") {
              this.lastSearchQuery = data;
              this.authService.getLanguages({PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
                debounceTime(300),
                distinctUntilChanged()).subscribe((res: any) => {
                  this.preferredLanguages = [];
                  this.lastSearchQuery = "";
                  res.forEach((country: any) => {
                    this.preferredLanguages.push({ name: country.name, id: country.id })
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

    if (this.FormGroup.valid && this.loading && this.FormGroup.value.agreed) {
      this.loading = false;
      // this.isLoading = true;

      let formatObject:any = {
        name: this.FormGroup.value.name,
        companyName: this.FormGroup.value.companyName,
        companyCountryId: this.FormGroup.value.companyCountryId.id,
        email: this.FormGroup.value.email,
        userMobileCountryId:this.isCurrentCountry.id,
        userMobileNumber:this.FormGroup.value.userMobileNumber,
        numberOfEmployees:this.FormGroup.value.numberOfEmployees,
        totalNumberOfEmployees:this.FormGroup.value.totalNumberOfEmployees,
        agreed: this.FormGroup.value.agreed ? this.FormGroup.value.agreed[0] : false,
      };
 
      
      // this.authService.signup(formatObject).subscribe(
      //   {
      //     next: (res: any) => {
      //       this.toast.success(res.message);

    

      //       this.router.navigate(["/login"]);


      //     },
      //     error: err => {
      //       this.toast.error(err.error.message);

      //       this.loading = true;
      //     }
      //   }
      // )
    } else {
      this.FormGroup.get("name")?.markAsDirty();
      this.FormGroup.get("companyName")?.markAsDirty();
      this.FormGroup.get("companyCountryId")?.markAsDirty();
      this.FormGroup.get("email")?.markAsDirty();

      this.FormGroup.get("email")?.markAsDirty();
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
  profileImgChooseEvent(event: any) {
    this.imageChangedEvent = event;
    this.selectImage = true;
    this.userPicture = event.target.files[0];
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.objectUrl;
    const file = new File([new Blob([this.croppedImage])], this.userPicture.name, {type: event.blob?.type});
    this.userPicture = file;
    this.companyLogo = this.userPicture;
  }
  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
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
