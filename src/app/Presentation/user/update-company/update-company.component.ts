import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { TermsAndConditionsComponent } from 'src/app/shared/components/terms-and-conditions/terms-and-conditions.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { AddBranchComponent } from 'src/app/shared/components/add-branch/add-branch.component';
import { UpdateCompanyService } from './services/update-company.service';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
export interface MapMarker {
  latitude: number;
  longitude: number;
  label?: string;
  draggable: boolean;
}
@Component({
  selector: 'app-update-company',
  templateUrl: './update-company.component.html',
  styleUrls: ['./update-company.component.scss']
})
export class UpdateCompanyComponent {
  togglePassword = true;
  toggleConfirmPassword = true;
  private dialog = inject(MatDialog);
  loadingData=false;
  FormGroup: FormGroup = this.fb.group({
    isActive:[false],
    name: [""],
    website: [""],
    companyCountryId: [""],
    headquarterAddress: [""],
    headquarterLocation:[""],
    headquarterPostalCode:[""],
    numberOfEmployees: [""],
    totalNumberOfEmployees: [""],
    industries: [""],
    email: ["", [Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    code:[''],
    preferredLanguageId:[''],
    latitude: [''],
    longitude: [''],
    identityCode:[''],
  });
  branches:any[]= []
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
  zoomLevel: number = 10;
  defaultImage = 'assets/img/old_logo.png';
  @ViewChild("searchMapRef") searchMapRef!: ElementRef;
  autoComplete!: google.maps.places.Autocomplete | undefined;
  latitude: number = -1.2921;
  longitude: number = 36.8219;

  markers: MapMarker[] = [
  ]
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 4;

  circleCenter: google.maps.LatLngLiteral = { lat: 10, lng: 15 };
  radius = 0;
  optionsMap: google.maps.MapOptions = {
    mapTypeId: 'terrain',
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: false,
    maxZoom: 15,
    minZoom: 8,
  };
  circleOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  };
  errorUploadFileIdCopyIsRequired!: string;
  AttachmentsFiles: any[] = [];
  errorUploadFileIdCopy!: string;
  public viewImage: any[] = [];
  viewImagesIdCopy: any[] = [];
  imageArray: any[] = [];
  requiredCommercialRegFiles = false;
  editBefore:any = {};
  constructor(private fb: FormBuilder, public translate: TranslateService, private toast: ToastrService,
    private updateCompanyService:UpdateCompanyService,
    private cd: ChangeDetectorRef
  ) {
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
    let countries = this.authService.getCountries({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let getLanguages = this.authService.getLanguages({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let company = this.updateCompanyService.getCompany();

    this.loadingData = true;
    combineLatest({
      countries,
      getLanguages,
      company
    }).subscribe({
      next:data => {
        this.general = [];
        this.preferredLanguages = [];
        data.countries?.forEach((country: any) => {
          this.general.push({ name: country.name, id: country.id })
        });
        data.getLanguages?.forEach((country: any) => {
          this.preferredLanguages.push({ name: country.name, id: country.id })
        });
        this.editBefore = data.company;
        this.FormGroup.get("name")?.setValue(this.editBefore?.name);
        this.FormGroup.get("website")?.setValue(this.editBefore?.webSite);
        let findIndexCountry = this.general.findIndex((country:any) => country.id === this.editBefore?.countryId);
        if(findIndexCountry >=0) {
          this.FormGroup.get("companyCountryId")?.setValue(this.general[findIndexCountry]);
        }
        this.FormGroup.get("headquarterAddress")?.setValue(this.editBefore?.headquarterAddress);
        this.FormGroup.get("headquarterLocation")?.setValue(this.editBefore?.headquarterLocation);
        this.FormGroup.get("headquarterPostalCode")?.setValue(this.editBefore?.headquarterPostalCode);
        this.FormGroup.get("numberOfEmployees")?.setValue(this.editBefore?.numberOfEmployees);
        this.FormGroup.get("totalNumberOfEmployees")?.setValue(this.editBefore?.totalNumberOfEmployees);
        this.FormGroup.get("email")?.setValue(this.editBefore?.email);
        this.FormGroup.get("code")?.setValue(this.editBefore?.code);
        let findIndexPreferredLanguages = this.preferredLanguages.findIndex((language:any) => language.id === this.editBefore?.preferredLanguageId);
        if(findIndexCountry >=0) {
          this.FormGroup.get("preferredLanguageId")?.setValue(this.preferredLanguages[findIndexPreferredLanguages]);
          this.editBefore.preferredLanguageId = this.preferredLanguages[findIndexPreferredLanguages];
        }
        this.FormGroup.get("identityCode")?.setValue(this.editBefore?.identityCode);
        this.FormGroup.get("isActive")?.setValue(this.editBefore?.isActive);
        this.industries =this.editBefore?.industries.map(industry => {
          return {...industry, editIndustries:false}
        });
        this.branches =  this.editBefore?.branches.map((branch:any) => {
          return{...branch, uniqId:branch.id, editBranch:false}
        });
        this.defaultImage = this.editBefore?.logoImagePath;
        if (this.editBefore?.attachments.length) {
          this.editBefore?.attachments.forEach((attachment: any) => {
            var validExts = new Array(".xlsx", ".xls", ".pdf", ".png", ".jpeg",".gif");
            let fileExt = attachment.fileName.substring(attachment.fileName.lastIndexOf('.'));
            if(validExts.indexOf(fileExt?.toLowerCase()) >= 0) {
              let file!:File;
              if(fileExt?.toLowerCase().includes("xlsx") || fileExt?.toLowerCase().includes("xls")) {
                 file = new File([attachment.filePath], `excel-file${validExts}`, {
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                this.viewImagesIdCopy.push("assets/img/excel.png");
              } else if(fileExt?.toLowerCase().includes("pdf")) {
                 file = new File([attachment.filePath], `pdf-file${validExts}`, {
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                this.viewImagesIdCopy.push("assets/img/pdf.png");
              } else if(fileExt?.toLowerCase().includes("png") || fileExt?.toLowerCase().includes("jpeg") || fileExt?.toLowerCase().includes("gif")) {
                 file = new File([attachment.filePath],`img-file${validExts}`, {
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                this.viewImagesIdCopy.push(attachment.filePath);
              }
              this.AttachmentsFiles.push({ fileUpload: {
                ...file,
                lastModified:file.lastModified,
                size:file.size,
                type:file.type,
                name:attachment.fileName,
              }, detailsImage: true });

            }
          });
        }
        this.loadingData = false;
      },
      error:err=> {
        this.loadingData = false;
      }
    })
  }
  onMarkerClickEvent(mapLabel: any, mapIndx: number) {
  }
  onMapClickEvent($event: any) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getControl("latitude")?.setValue(this.latitude);
    this.getControl("longitude")?.setValue(this.longitude);
    this.markers = [{
      latitude: this.latitude,
      longitude: this.longitude,
      label: 'Point A',
      draggable: true
    }]
  }
  markerDragEnd(marker: any, $event: any) {
    this.getControl("latitude")?.setValue(marker.latitude);
    this.getControl("longitude")?.setValue(marker.longitude);
    this.latitude = marker.latitude;
    this.longitude = marker.longitude;
    // this.markers = [{
    //   latitude: marker.latitude,
    //   longitude: marker.longitude,
    //   label: marker.label,
    //   draggable: true
    // }];
  }
  ngAfterViewInit() {
    this.autoComplete = new google.maps.places.Autocomplete(this.searchMapRef.nativeElement)
    this.autoComplete.addListener("place_changed", () => {
      
      // const place = this.autoComplete?.getPlace();
      const place: any = this.autoComplete?.getPlace();
      if (place.geometry && place.geometry.location) {
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();
        this.getControl("latitude")?.setValue(latitude);
        this.getControl("longitude")?.setValue(longitude);

        this.latitude = latitude;
        this.longitude = longitude;
        this.markers = [{
          latitude: latitude,
          longitude: longitude,
          label: 'Point A',
          draggable: true
        }];
        this.cd.detectChanges();
      }

    })
  }
  addIndustries() {
    if(this.FormGroup.get("industries")?.value) {
      let valueText = this.FormGroup.get("industries")?.value;
      let findIndexIndustries = this.industries.findIndex(item => item.Name === valueText);
      if(findIndexIndustries <0) {
        this.industries.push({id:0, name:valueText, editIndustries:true});
        this.FormGroup.get("industries")?.reset();
      }
    }
  }
  removeIndustry(index) {
    this.industries.splice(index, 1);
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
  onRemoveCommercialReg(event: any) {

    let indexFile = this.AttachmentsFiles.findIndex(item => item.fileUpload.lastModified === event.lastModified);
    this.AttachmentsFiles.splice(indexFile, 1)
    this.AttachmentsFiles.length === 0 ? this.requiredCommercialRegFiles = true : this.requiredCommercialRegFiles = false;

  }
  async onFileChange(pFileList: any, stepIndex: number) {
    
    if (pFileList.files?.length <= 5 || pFileList.length <= 5) {
      this.errorUploadFileIdCopyIsRequired = "";
      let indexidCopyFiles = [...this.AttachmentsFiles];
      if (indexidCopyFiles.length <= 5) {
        let idCopyFiles = [...this.AttachmentsFiles, ...Object.keys(pFileList.files).map(key => pFileList.files[key])];
        let findIndexFileName:any[] = [];
        for (let index = 0; index < pFileList.files.length; index++) {
          const fileSize = pFileList.files[index];
          findIndexFileName = idCopyFiles.filter(file => file.name == pFileList.files[index].name);
          if(findIndexFileName.length < 2) {
            if(fileSize?.size < (2 * 1024 * 1024)) {
              this.viewImage.push(pFileList.files[index]);
              this.AttachmentsFiles.push({fileUpload:pFileList.files[index], detailsImage: false});
              this.errorUploadFileIdCopy = "";
            } else {
              this.errorUploadFileIdCopy = "The file size must be less than 2MB";
            }
          } else {
            if(fileSize?.size > (2 * 1024 * 1024)) {
              this.errorUploadFileIdCopy = "The file size must be less than 2MB";
            } else {
              this.errorUploadFileIdCopy = "The file is duplicate";
            }
          }
        }
        if(this.errorUploadFileIdCopy === "" && findIndexFileName.length < 2 && this.viewImage.length > 0) {
          for (let index = 0; index < this.viewImage.length; index++) {
            let filereaderTwo = new FileReader();
            const fileSize = this.viewImage[index];
            if (fileSize?.size > (2 * 1024 * 1024)) {
              this.errorUploadFileIdCopy = "The file size must be less than 2MB";
              return;
            } else {
              this.imageArray = [];
              this.errorUploadFileIdCopy = "";
              var validExts = new Array(".xlsx", ".xls");
              let fileExt = this.viewImage[index]?.name.substring(this.viewImage[index]?.name.lastIndexOf('.'));
              await filereaderTwo.readAsDataURL(this.viewImage[index]);
              filereaderTwo.onload = () => {
                if((filereaderTwo.result as string).includes("application/pdf")) {
                  this.imageArray.push("assets/img/pdf.png");
                } else if(validExts.indexOf(fileExt) >= 0) {
                  this.imageArray.push("assets/img/excel.png");
                } else {
                  this.imageArray.push(filereaderTwo.result);
                }
              }
              this.viewImagesIdCopy = this.imageArray;
              this.errorUploadFileIdCopyIsRequired = "";
            }
          }
          if(findIndexFileName.length > 1) {
            this.errorUploadFileIdCopy = "The file is duplicate";
          }
        }
        if(this.errorUploadFileIdCopy === "") {
          this.toast.success("Successfully upload!", '', {
            timeOut: 5000,
            onActivateTick: true
          });        
        }

      } else {
        this.errorUploadFileIdCopyIsRequired = "You can only select up to 5 files.";
      }
    } else {
      this.errorUploadFileIdCopyIsRequired = "You can only select up to 5 files.";
    }
  }
  submit() {
    if (this.FormGroup.valid && this.loading) {
      let formData = new FormData();
      let formDataObject: any = {};
      let filterIndustriesEdit = this.industries.filter((industry:any) => {
        return industry.editIndustries === true
      });
      let filterEditBranch = this.branches.filter((branch:any) => {
        return branch.editBranch === true
      });
      let filterAttachmentsFiles = this.AttachmentsFiles.filter((attachement:any) => attachement.detailsImage === false);
      if(filterAttachmentsFiles.length > 0) {
        filterAttachmentsFiles.forEach((file: any) => {
          if (file.detailsImage === false) {
            formData.append("Attachments", file.fileUpload, file.fileUpload.name);
          }
        });
      }
      
      if(
        (this.FormGroup?.value?.preferredLanguageId?.id && this.editBefore.preferredLanguageId?.id != this.FormGroup?.value?.preferredLanguageId?.id) ||
        (this.FormGroup?.value?.website && this.FormGroup?.value?.website != this.editBefore.webSite) ||
        (this.FormGroup?.value?.headquarterAddress && this.FormGroup?.value?.headquarterAddress != this.editBefore.headquarterAddress) ||
        (this.FormGroup?.value?.headquarterLocation && this.FormGroup?.value?.headquarterLocation != this.editBefore.headquarterLocation) ||
        (this.FormGroup?.value?.headquarterPostalCode && this.FormGroup?.value?.headquarterPostalCode != this.editBefore.headquarterPostalCode) ||
        (this.FormGroup?.value?.email && this.FormGroup?.value?.email != this.editBefore.email) ||
        (this.FormGroup?.value?.totalNumberOfEmployees && this.FormGroup?.value?.totalNumberOfEmployees != this.editBefore.totalNumberOfEmployees) ||
        this.companyLogo != undefined ||
        filterIndustriesEdit.length > 0 ||
        filterEditBranch.length > 0 ||
        filterAttachmentsFiles.length > 0
      ) {
        
        formData.append("UpdateCompanyModelString", JSON.stringify({
          PreferredLanguageId: (this.FormGroup?.value?.preferredLanguageId?.id &&this.editBefore.preferredLanguageId?.id != this.FormGroup?.value?.preferredLanguageId?.id) ? this.FormGroup?.value?.preferredLanguageId?.id : null,
          WebSite: (this.FormGroup?.value?.website && this.FormGroup?.value?.website != this.editBefore.webSite) ? this.FormGroup?.value?.website : null,
          HeadquarterAddress: (this.FormGroup?.value?.headquarterAddress && this.FormGroup?.value?.headquarterAddress != this.editBefore.headquarterAddress) ? this.FormGroup?.value?.headquarterAddress : null,
          HeadquarterLocation:  (this.FormGroup?.value?.headquarterLocation && this.FormGroup?.value?.headquarterLocation != this.editBefore.headquarterLocation) ? this.FormGroup?.value?.headquarterLocation : null,
          HeadquarterPostalCode:(this.FormGroup?.value?.headquarterPostalCode && this.FormGroup?.value?.headquarterPostalCode != this.editBefore.headquarterPostalCode) ? this.FormGroup?.value?.headquarterPostalCode : null,
          Email: (this.FormGroup?.value?.email && this.FormGroup?.value?.email != this.editBefore.email) ? this.FormGroup?.value?.email : null,
          TotalNumberOfEmployees: (this.FormGroup?.value?.totalNumberOfEmployees && this.FormGroup?.value?.totalNumberOfEmployees != this.editBefore.totalNumberOfEmployees) ?  this.FormGroup?.value?.totalNumberOfEmployees: null,
          LogoImageName:this.companyLogo ? this.companyLogo.name : null,
          ImportDefaultData: null,
          Industries:filterIndustriesEdit.length > 0 ? filterIndustriesEdit.map((Industry:any) => {
            return {id:Industry.id,name:Industry.name}
          }) : null,
          Branches:filterEditBranch.length > 0 ?filterEditBranch.map((branch:any) => {
            return {id:branch.id,name:branch.name, address:branch.address, location:branch.location,postalCode:branch.postalCode}
          }) : null,
        }));
        if(this.companyLogo) {
            formData.append("ProfileImageFile", this.companyLogo, this.companyLogo.name);
        }
        this.loading = false;
        this.updateCompanyService.updateCompany(formData).subscribe({
          next:data => {
            this.loading = true;
  
            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم تحديث الملف الشخصي",
                message: data.message,
                buttonSend: "الملف الشخصي"
              },
            });
            setTimeout(() => {
              succressDialog.close();
            }, 2000);
            succressDialog.componentInstance.submitted = true;
            succressDialog.componentInstance.submitClicked.subscribe(result => {
              succressDialog.close();
            })
          },
          error:err => {
            this.loading = true;

          }
        })
      } else {
        this.loading = true;

        this.toast.error("لم يتم تغير حقل");
      }
    }
  }
  addBranch() {
    let dialogRefAddCurrency = this.dialog.open(AddBranchComponent, {
      width: "90vw",
      maxWidth:"90vw",
      data: {
        title: "اضافة فرع",
        titleClose:"أغلاق",
        buttonSend: "ارسال الفروع"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editVacation = false;
    dialogRefAddCurrency.componentInstance.branches = this.branches;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      this.branches = {...result, editBranch:true};
      dialogRefAddCurrency.componentInstance.submitted = true;
      dialogRefAddCurrency.close();
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {
      }
    });
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

      }
    });
  }
  getControl(FormControl: string) {
    return this.FormGroup.get(FormControl);
  }
}
