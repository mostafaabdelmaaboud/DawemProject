import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from 'primeng/multiselect';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { CompaniesService } from '../../services/companies.service';
import { Router } from '@angular/router';
import { TermsAndConditionsComponent } from 'src/app/shared/components/terms-and-conditions/terms-and-conditions.component';
interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  setAsNecessary: string;

  titleName: string;
  placeholdeName: string;
  validationtitleName: string;

  title: string;
  buttonSend: string,
  buttonClose: string,
}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatProgressSpinnerModule,MultiSelectModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  @Input() list: any[] = [
  ];
  @Input() workTeamList: any[] = [
  ];
  @Input() id!: string;

  dateTaskMultiple = false;
  listEmployees: any[] = [
  ];
  loading = false;

  @Input() editPlane!: boolean;

 
  togglePassword = true;
  toggleConfirmPassword = true;
  private dialog = inject(MatDialog);

  FormGroup: FormGroup = this.fb.group({
    name: ["", Validators.required],
    companyName: ["", Validators.required],
    companyCountryId: ["", Validators.required],
    companyAddress: ["", Validators.required],
    companyEmail: ["", [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    password: ["", [Validators.required, Validators.minLength(5)]],
    confirmPassword: ["", [Validators.required, Validators.minLength(5), , this.passwordMatchValidator()]],
    numberOfEmployees: ["", Validators.required],
    userEmail: ["", [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    userMobileNumber: ["", [Validators.required]],
    IsTrial: [false],
    subscriptionDurationInMonths: ["", [Validators.required]],
    agreed: [, Validators.required],

  });
  subscription = true;
  code="+20";
  currentLang = localStorage.getItem("lang");
  countries!: any[];
  isLoading = false;
  general: any[] = [];
  countriesPhone: any[] = [];
  isCurrentCountry;
  private router = inject(Router)
  selectedCountry: any = { name: 'عربي', code: 'AR' };

  constructor(
    public dialogRef: MatDialogRef<SignupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private companiesService: CompaniesService,
    private toast: ToastrService,
    private fb: FormBuilder,
    public translate: TranslateService
  ) {
    this.dialogRef.disableClose = true;
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
    this.getCountriesbyPhone();
    this.FormGroup.get("IsTrial")?.valueChanges.subscribe(data => {

      if (data) {
        this.subscription = false;

        this.FormGroup.removeControl("subscriptionDurationInMonths");
      } else {
        this.FormGroup.addControl("subscriptionDurationInMonths", this.fb.control("", [Validators.required]));

        this.subscription = true;

      }
    })
  }
  getCountries() {
    this.companiesService.getCountries({ PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe({
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
  selectCountry() {
    const pattern = new RegExp(`^\\d{${this.isCurrentCountry.phoneLength}}$`);
    this.FormGroup.get("userMobileNumber")?.setValidators([Validators.required, Validators.pattern(pattern)])
    this.code= "+"+this.isCurrentCountry.phoneLength;
  }
  getCountriesbyPhone() {
    this.companiesService.getCountries({ PagingEnabled: true, PageSize: 5, PageNumber: 0 }).subscribe({
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
            this.companiesService.getCountries({PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
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

      default:
        break;
    }
  }
  submit() {
    
    if (this.FormGroup.valid &&  this.submitted && this.FormGroup.value.agreed) {
      this.loading = false;
      // this.isLoading = true;
      
      let formatObject:any = {
        name: this.FormGroup.value.name,
        companyName: this.FormGroup.value.companyName,
        companyCountryId: this.FormGroup.value.companyCountryId.id,
        companyAddress: this.FormGroup.value.companyAddress,
        companyEmail: this.FormGroup.value.companyEmail,
        password: this.FormGroup.value.password,
        confirmPassword: this.FormGroup.value.confirmPassword,
        userEmail: this.FormGroup.value.userEmail,
        userMobileCountryId:this.isCurrentCountry.id,
        userMobileNumber:this.FormGroup.value.userMobileNumber,
        numberOfEmployees:this.FormGroup.value.numberOfEmployees,
        agreed: this.FormGroup.value.agreed ? this.FormGroup.value.agreed : false,
        IsTrial:this.FormGroup.value.IsTrial
      };
      if(this.subscription) {
        formatObject.subscriptionDurationInMonths = this.FormGroup.value.subscriptionDurationInMonths;
      } else {
        formatObject.subscriptionDurationInMonths = null;
      }
          //   this.submitted = false;
          
      this.submitClicked.emit(formatObject);

    } else {
      this.FormGroup.get("name")?.markAsDirty();
      this.FormGroup.get("companyName")?.markAsDirty();
      this.FormGroup.get("companyCountryId")?.markAsDirty();
      this.FormGroup.get("companyAddress")?.markAsDirty();
      this.FormGroup.get("companyEmail")?.markAsDirty();
      this.FormGroup.get("password")?.markAsDirty();
      this.FormGroup.get("numberOfEmployees")?.markAsDirty();
      if(this.subscription) {
        this.FormGroup.get("subscriptionDurationInMonths")?.markAsDirty();
      }
      this.FormGroup.get("confirmPassword")?.markAsDirty();
      this.FormGroup.get("userEmail")?.markAsDirty();
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
  request() {
    

    // if (this.addBranchGroupForm.valid && this.submitted && this.getControlArray("NameTranslations").at(this.getControlArray("NameTranslations").controls.length - 1).valid) {
    //   
    //   this.submitted = false;
    //   this.submitClicked.emit(this.addBranchGroupForm.value);
    // } else {
    // }

  }

  
  close(): void {
    this.dialogRef.close(false);
  }
}
