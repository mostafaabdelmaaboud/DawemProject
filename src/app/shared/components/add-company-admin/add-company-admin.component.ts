import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from 'primeng/multiselect';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SharedModule } from '../../shared.module';
import { AgmCoreModule } from '@agm/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AddBranchComponent } from '../add-branch/add-branch.component';
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { UpdateCompanyService } from 'src/app/Presentation/user/update-company/services/update-company.service';
import { ToastSuccessComponent } from '../toast-success/toast-success.component';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions.component';
import { CompaniesService } from 'src/app/Presentation/admin/companies/services/companies.service';
export interface MapMarker {
  latitude: number;
  longitude: number;
  label?: string;
  draggable: boolean;
}
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
  selector: 'app-add-company-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatProgressSpinnerModule, 
    MatRadioModule, MultiSelectModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule,
    ImageCropperModule,
    InputTextareaModule,
  
    SharedModule,
    AgmCoreModule,
    MatDialogModule
  ],
  templateUrl: './add-company-admin.component.html',
  styleUrls: ['./add-company-admin.component.scss']
})
export class AddCompanyAdminComponent {

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

  @Input() editCompany!: boolean;
  addBranchGroupForm: FormGroup = this.fb.group({
    IsNecessary: [false],
    name: ["", Validators.required]
  });
  AttachmentsFiles: any[] = [];
  requiredCommercialRegFiles = false;
  toggleForEmployee = false;
  private companiesService = inject(CompaniesService);
  togglePassword = true;
  toggleConfirmPassword = true;
  private dialog = inject(MatDialog);
  loadingData=false;
  FormGroup: FormGroup = this.fb.group({
    isActive:[false],
    name: ["", Validators.required],
    website: [""],
    companyCountryId: ["", Validators.required],
    headquarterAddress: [""],
    headquarterPostalCode:[""],
    numberOfEmployees: [""],
    totalNumberOfEmployees: [""],
    industries: [""],
    email: ["", [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    // code:[''],
    ImportDefaultData:[false],
    HeadquarterLocationLatitude: [''],
    HeadquarterLocationLongitude: [''],
    // identityCode:[''],
  });
  branches:any[]= []
  subscription = true;
  showPreferredLanguage = false;
  code="+20";
  private authService = inject(AuthService);
  currentLang = localStorage.getItem("lang");
  countries!: any[];
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
  userPictureCopy: any;

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
  AttachmentsNames:any[] = [];
  removeArrachementsName = false;
  errorUploadFileIdCopy!: string;
  public viewImage: any[] = [];
  viewImagesIdCopy: any[] = [];
  imageArray: any[] = [];
  editBefore:any = {};

  constructor(
    public dialogRef: MatDialogRef<AddCompanyAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private fb: FormBuilder,
   public translate: TranslateService, private toast: ToastrService,
   private updateCompanyService:UpdateCompanyService,
    private cd: ChangeDetectorRef
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

    }
   this.getInformation();
    this.FormGroup.get("ImportDefaultData")?.valueChanges.subscribe(data => {

      if (data) {
        this.showPreferredLanguage = true;
        this.FormGroup.addControl("preferredLanguageId", this.fb.control("", [Validators.required]));

      } else {
        this.FormGroup.removeControl("preferredLanguageId");

        this.showPreferredLanguage = false;

      }
    })
  }
  onMarkerClickEvent(mapLabel: any, mapIndx: number) {
    
  }
  getInformation() {
    let countries = this.authService.getCountries({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let getLanguages = this.authService.getLanguages({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    this.loadingData = true;

    combineLatest({
      countries,
      getLanguages
    }).subscribe({
      next:data => {

        this.general = [];
        this.preferredLanguages = [];
        this.AttachmentsFiles = [];
        data.countries?.forEach((country: any) => {
          this.general.push({ name: country.name, id: country.id })
        });
        data.getLanguages?.forEach((country: any) => {
          this.preferredLanguages.push({ name: country.name, id: country.id })
        }); 
        if(this.editCompany) {

          this.companiesService.getCompanyById({companyId:this.id}).subscribe({
            next:data => {
              
              this.editBefore = data;
              this.FormGroup.get("name")?.setValue(this.editBefore?.name);
              this.FormGroup.get("website")?.setValue(this.editBefore?.webSite);
              let findIndexCountry = this.general.findIndex((country:any) => country.id === this.editBefore?.countryId);
              if(findIndexCountry >=0) {
                this.FormGroup.get("companyCountryId")?.setValue(this.general[findIndexCountry]);
              }
              this.FormGroup.get("headquarterAddress")?.setValue(this.editBefore?.headquarterAddress);
              this.FormGroup.get("headquarterPostalCode")?.setValue(this.editBefore?.headquarterPostalCode);
              this.FormGroup.get("numberOfEmployees")?.setValue(this.editBefore?.numberOfEmployees);
              this.FormGroup.get("totalNumberOfEmployees")?.setValue(this.editBefore?.totalNumberOfEmployees);
              this.FormGroup.get("email")?.setValue(this.editBefore?.email);
              // this.FormGroup.get("code")?.setValue(this.editBefore?.code);
              let findIndexPreferredLanguages = this.preferredLanguages.findIndex((language:any) => language.id === this.editBefore?.preferredLanguageId);
              if(findIndexPreferredLanguages >=0) {
                this.FormGroup.get("ImportDefaultData")?.setValue(true);
                this.FormGroup.get("preferredLanguageId")?.setValue(this.preferredLanguages[findIndexPreferredLanguages]);
                this.editBefore.preferredLanguageId = this.preferredLanguages[findIndexPreferredLanguages];
              }
              
              if(this.editBefore?.headquarterLocationLatitude != null &&this.editBefore?.headquarterLocationLongtude  != null) {
                this.getControl("HeadquarterLocationLatitude")?.setValue(this.editBefore?.headquarterLocationLatitude);
                this.getControl("HeadquarterLocationLongitude")?.setValue(this.editBefore?.headquarterLocationLongtude);
        
                this.latitude = this.editBefore?.headquarterLocationLatitude;
                this.longitude = this.editBefore?.headquarterLocationLongtude;
                this.markers = [{
                  latitude: this.editBefore?.headquarterLocationLatitude,
                  longitude: this.editBefore?.headquarterLocationLongtude,
                  label: 'Point A',
                  draggable: true
                }];
                // this.markers = [{
                //   latitude: this.editBefore?.headquarterLocationLatitude,
                //   longitude: this.editBefore?.headquarterLocationLongtude,
                //   label: 'Point A',
                //   draggable: true
                // }]
              }
         
              // this.FormGroup.get("identityCode")?.setValue(this.editBefore?.identityCode);
              this.FormGroup.get("isActive")?.setValue(this.editBefore?.isActive);
              this.industries =this.editBefore?.industries.map(industry => {
                return {...industry , editIndustries:false}
              });
              this.branches =  this.editBefore?.branches.map((branch:any) => {
                return{...branch, uniqId:`${branch.id}editBranch`, editBranch:false}
              });  
              const img = new Image();
              // إضافة معالج حدث للتحقق مما إذا تم تحميل الصورة بنجاح
              img.onload = () => {
                if (this.editBefore?.logoImagePath) {
                  var validExts = new Array(".xlsx", ".xls", ".pdf", ".png", ".jpeg",".gif", ".jpg");
                  let fileExt = this.editBefore?.logoImageName.substring(this.editBefore?.logoImageName.lastIndexOf('.'));
                  if(validExts.indexOf(fileExt?.toLowerCase()) >= 0) {
                    let file!:File;
                    if(fileExt?.toLowerCase().includes("xlsx") || fileExt?.toLowerCase().includes("xls")) {
                      this.updateCompanyService.downloadFile(this.editBefore?.logoImagePath).subscribe(blob => {
                        const reader = new FileReader();
                    reader.onload = (e: any) => {
                      
                      file = this.base64ToFile(e.target.result, this.editBefore?.logoImageName);
                    };
                    reader.readAsDataURL(blob);
                    })
                      this.defaultImage = "assets/img/excel.png";
                      this.userPicture = {name:this.editBefore?.logoImageName};
                    } else if(fileExt?.toLowerCase().includes("pdf")) {
                      this.updateCompanyService.downloadFile(this.editBefore?.logoImagePath).subscribe(blob => {
                        const reader = new FileReader();
                    reader.onload = (e: any) => {
                      
                      file = this.base64ToFile(e.target.result, this.editBefore?.logoImageName);
      
                    };
                    reader.readAsDataURL(blob);
                    })
                      this.defaultImage="assets/img/pdf.png";
                      this.userPicture =  {name:this.editBefore?.logoImageName};
                    } else if(fileExt?.toLowerCase().includes("png") || fileExt?.toLowerCase().includes("jpeg") || fileExt?.toLowerCase().includes("jpg") || fileExt?.toLowerCase().includes("gif")) {
                      
      
                      this.updateCompanyService.downloadFile(this.editBefore?.logoImagePath).subscribe(blob => {
                          const reader = new FileReader();
                      reader.onload = (e: any) => {
                        
                        file = this.base64ToFile(e.target.result, this.editBefore?.logoImageName);
      
                      };
                      reader.readAsDataURL(blob);
                      })
                      this.defaultImage=this.editBefore?.logoImagePath;
                      this.userPicture =  {name:this.editBefore?.logoImageName};
                    }
                    
                    this.companyLogo = file;  
                  }
      
                }
                // هنا يمكنك إضافة منطق إذا كانت الصورة تم تحميلها بنجاح
              };
              
              // إضافة معالج حدث للتحقق مما إذا كان هناك خطأ في تحميل الصورة
              img.onerror = () => {
                this.defaultImage = 'assets/img/old_logo.png';
                console.log(`Failed to load image from path: ${this.editBefore?.logoImagePath}`);
                // هنا يمكنك إضافة منطق إذا كانت هناك مشكلة في تحميل الصورة
              };
              img.src = this.editBefore?.logoImagePath;
              // checkImagePath(imagePath: string): void {
            
              // }
              if (this.editBefore?.attachments.length) {
                this.editBefore?.attachments.forEach((attachment: any) => {
                  var validExts = new Array(".xlsx", ".xls", ".pdf", ".png", ".jpeg",".gif", ".jpg",".xlsx", ".xls", ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                  let fileExt = attachment.fileName.substring(attachment.fileName.lastIndexOf('.'));
                  
      
                  if(validExts.indexOf(fileExt?.toLowerCase()) >= 0) {
                    let file!:File;
                    if(fileExt?.toLowerCase().includes("xlsx") || fileExt?.toLowerCase().includes("xls")) {
                       file = new File([attachment.filePath], attachment.fileName, {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      });
                      this.viewImagesIdCopy.push("assets/img/excel.png");
                      this.AttachmentsFiles.push({ fileUpload: file, detailsImage: true });
      
                    } else if(fileExt?.toLowerCase().includes("pdf")) {
                       file = new File([attachment.filePath], attachment.fileName, {
                        type: 'application/pdf',
                      });
                      this.viewImagesIdCopy.push("assets/img/pdf.png");
                      this.AttachmentsFiles.push({ fileUpload: file, detailsImage: true });
      
                    } else if(fileExt.toLowerCase().includes("docx") || fileExt.toLowerCase().includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
                      file = new File([attachment.filePath], attachment.fileName, {
                        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                      });
                      this.viewImagesIdCopy.push("assets/img/word.png");
                      this.AttachmentsFiles.push({ fileUpload: file, detailsImage: true });
      
                    } else if(fileExt?.toLowerCase().includes("png") || fileExt?.toLowerCase().includes("jpeg") || fileExt?.toLowerCase().includes("jpg") || fileExt?.toLowerCase().includes("gif")) {
                      //  file = new File([new Blob([attachment.filePath])],attachment.fileName, {
                      //   type: 'image/' +fileExt.slice(fileExt.indexOf('.') + 1, fileExt.length).toLowerCase(),
                      // });
      
                      const img = new Image();
                
                      // إضافة معالج حدث للتحقق مما إذا تم تحميل الصورة بنجاح
                      img.onload = () => {
                        this.updateCompanyService.downloadFile(attachment.filePath).subscribe(blob => {
                          const reader = new FileReader();
                          reader.onload = (e: any) => {
                            
                            file = this.base64ToFile(e.target.result, attachment.fileName);
                            this.AttachmentsFiles.push({ fileUpload: file, detailsImage: true });
      
                          };
                          reader.readAsDataURL(blob);
                        })
                        
                        // هنا يمكنك إضافة منطق إذا كانت الصورة تم تحميلها بنجاح
                      };
                      
                      // إضافة معالج حدث للتحقق مما إذا كان هناك خطأ في تحميل الصورة
                      img.onerror = () => {
                        
                        console.log(`Failed to load image from path: ${attachment.filePath}`);
                        // هنا يمكنك إضافة منطق إذا كانت هناك مشكلة في تحميل الصورة
                      };
                      
        
                      // محاولة تحميل الصورة من المسار المحدد
                      img.src = attachment.filePath;
                      this.viewImagesIdCopy.push(attachment.filePath);
                    }
                    // const file = new File([new Blob([this.croppedImage])], this.userPicture.name, {type: event.blob?.type});
      
                    // const file = new File([new Blob([this.croppedImage])], this.userPicture.name, {type: event.blob?.type});
              
                  
      
                  }
                });
              }
              this.loadingData = false;

            },
            error:err => {
              this.loadingData = false;

            }
          })
        } else {
          this.loadingData = false;

        }

      },
      error:err=> {
        this.loadingData = false;
      }
    })
  }
  onMapClickEvent($event: any) {
    
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    
    this.getControl("HeadquarterLocationLatitude")?.setValue(this.latitude);
    this.getControl("HeadquarterLocationLongitude")?.setValue(this.longitude);
    this.markers = [{
      latitude: this.latitude,
      longitude: this.longitude,
      label: 'Point A',
      draggable: true
    }]
  }
  markerDragEnd(marker: any, $event: any) {
    
    this.getControl("HeadquarterLocationLatitude")?.setValue(marker.latitude);
    this.getControl("HeadquarterLocationLongitude")?.setValue(marker.longitude);
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
        this.getControl("HeadquarterLocationLatitude")?.setValue(latitude);
        this.getControl("HeadquarterLocationLongitude")?.setValue(longitude);

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
    this.industries = this.industries.map(industry => {
     return  {...industry, editIndustries:true}
    })
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

    let indexFile = this.AttachmentsFiles.findIndex(item => item.fileUpload.name === event.name);
    
    let indexFileAttachmentsNames = this.AttachmentsNames.findIndex(item => item === event.name);
    if(indexFile >=0) {
      this.viewImagesIdCopy.splice(indexFile, 1);
      this.AttachmentsFiles.splice(indexFile, 1);    
      this.removeArrachementsName = true;

    }

    this.AttachmentsFiles.length === 0 ? this.requiredCommercialRegFiles = true : this.requiredCommercialRegFiles = false;
    

    if(indexFileAttachmentsNames >=0) {
      this.AttachmentsNames.splice(indexFileAttachmentsNames, 1);
  this.removeArrachementsName = true;
  
    }
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
              this.AttachmentsNames.push(pFileList.files[index].name);
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
          for (let index = 0; index < this.AttachmentsFiles.length; index++) {
            let filereaderTwo = new FileReader();
            const fileSize = this.AttachmentsFiles[index]?.fileUpload;
            if (fileSize?.size > (2 * 1024 * 1024)) {
              this.errorUploadFileIdCopy = "The file size must be less than 2MB";
              return;
            } else {
              this.imageArray = [];
              this.errorUploadFileIdCopy = "";
              var validExts = new Array(".xlsx", ".xls", ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
              let fileExt = this.AttachmentsFiles[index]?.fileUpload?.name.substring(this.AttachmentsFiles[index]?.fileUpload?.name.lastIndexOf('.'));
              await filereaderTwo.readAsDataURL(this.AttachmentsFiles[index]?.fileUpload);
              filereaderTwo.onload = () => {
                
                if(fileExt.toLowerCase().includes("pdf")) {
                  this.imageArray.push("assets/img/pdf.png");
                } else if(fileExt.toLowerCase().includes("xlsx") || fileExt.toLowerCase().includes("xls")) {
                  this.imageArray.push("assets/img/excel.png");
                } else if(fileExt.toLowerCase().includes("docx") || fileExt.toLowerCase().includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
                  this.imageArray.push("assets/img/word.png")
                }  else {
                  this.imageArray.push(filereaderTwo.result);
                }
                this.viewImagesIdCopy = this.imageArray;

              }
              
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
      

      this.branches =result;
      

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
    
    this.userPictureCopy = event.target.files[0];
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    // const file = new File([new Blob([this.croppedImage])], this.userPicture.name, {type: event.blob?.type});
    const fileToReturn = this.base64ToFile(
      event.base64,
      this.userPictureCopy.name,
    );
    
    this.userPicture = fileToReturn;
    this.companyLogo = this.userPicture;
    
  }
  base64ToFile(data, filename) {

    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
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

  submit() {
    
    if (this.FormGroup.valid && !this.loadingData) {
      

      let formData = new FormData();
      let filterEditBranch = this.branches.filter((branch:any) => {
        return branch.editBranch === true
      });
      let filterEditIndustries = this.branches.filter((Industry:any) => {
        return Industry.editIndustries === true
      });
      

      if(
        (this.showPreferredLanguage && this.FormGroup?.value?.preferredLanguageId?.id && this.editBefore?.preferredLanguageId != this.FormGroup?.value?.preferredLanguageId?.id) ||
        (this.FormGroup?.value?.website && this.FormGroup?.value?.website != this.editBefore.webSite) ||
        (this.FormGroup?.value?.companyCountryId?.id && this.editBefore?.countryId != this.FormGroup?.value?.companyCountryId?.id) ||
        (this.FormGroup?.value?.headquarterAddress && this.FormGroup?.value?.headquarterAddress != this.editBefore.headquarterAddress) ||
        (this.FormGroup?.value?.headquarterPostalCode && this.FormGroup?.value?.headquarterPostalCode != this.editBefore.headquarterPostalCode) ||
        (this.FormGroup?.value?.email && this.FormGroup?.value?.email != this.editBefore.email) ||
        (this.FormGroup?.value?.totalNumberOfEmployees && this.FormGroup?.value?.totalNumberOfEmployees != this.editBefore.totalNumberOfEmployees) ||
        this.FormGroup?.value?.HeadquarterLocationLatitude != this.editBefore.headquarterLocationLatitude ||
        this.FormGroup?.value?.HeadquarterLocationLongitude != this.editBefore.headquarterLocationLongtude ||
        filterEditIndustries.length > 0 ||
        this.removeArrachementsName ||
        this.AttachmentsNames.length > 0 ||
        this.companyLogo ||
        filterEditBranch.length > 0
      ) {
        

        let formatKeyFormData = "";
        if(this.editCompany) {
          formatKeyFormData = "UpdateCompanyModelString";

        } else {
          formatKeyFormData = "CreateCompanyModelString";

          
        }
        

        formData.append(formatKeyFormData, JSON.stringify({
          CountryId:this.FormGroup?.value?.companyCountryId?.id ? this.FormGroup?.value?.companyCountryId?.id : null,
          PreferredLanguageId: this.FormGroup?.value?.preferredLanguageId?.id ? this.FormGroup?.value?.preferredLanguageId?.id : null,
          WebSite: this.FormGroup?.value?.website ? this.FormGroup?.value?.website : null,
          HeadquarterAddress: this.FormGroup?.value?.headquarterAddress ? this.FormGroup?.value?.headquarterAddress : null,
          HeadquarterPostalCode:this.FormGroup?.value?.headquarterPostalCode? this.FormGroup?.value?.headquarterPostalCode : null,
          Email: this.FormGroup?.value?.email,
          TotalNumberOfEmployees: this.FormGroup?.value?.totalNumberOfEmployees ?  this.FormGroup?.value?.totalNumberOfEmployees: null,
          LogoImageName:this.userPicture ? this.userPicture.name : null,
          HeadquarterLocationLatitude:this.FormGroup?.value?.HeadquarterLocationLatitude ? this.FormGroup?.value?.HeadquarterLocationLatitude  : null,
          HeadquarterLocationLongitude:this.FormGroup?.value?.HeadquarterLocationLongitude ? this.FormGroup?.value?.HeadquarterLocationLongitude : null,
          AttachmentsNames:this.AttachmentsNames.length >0 ? this.AttachmentsNames : null,
          ImportDefaultData: this.FormGroup?.value?.ImportDefaultData,
          NumberOfEmployees:this.FormGroup?.value?.numberOfEmployees,
          Industries:this.industries.length > 0 ? this.industries : null,
          Branches:this.branches.length > 0 ?this.branches.map((branch:any) => {
            return {
              Id:branch.id,
              Name:branch.name, 
              Address:branch.address, 
              Latitude:branch.latitude,
              Longitude:branch.longitude,
              PostalCode:branch.postalCode
            }
          }) : null,
        }));
        
        if(this.companyLogo) {
          

            formData.append("LogoImageFile", this.companyLogo, this.companyLogo.name);
        } else {
          formData.append("LogoImageFile", JSON.stringify(null));
        }
        
        if(this.AttachmentsFiles.length > 0) {
          this.AttachmentsFiles.forEach((file: any) => {
              formData.append("Attachments", file.fileUpload, file.fileUpload.name);
          });
        } else {
          formData.append("Attachments", JSON.stringify(null));
        }
        this.loading = false;
        this.loadingData = true;
        
        let companyRequest:any;
        if(this.editCompany) {
          companyRequest = this.companiesService.updateCompany(formData)
        } else {
          companyRequest = this.companiesService.createCompany(formData)

        }
        companyRequest.subscribe({
          next:data => {
            
            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: this.editCompany ? 'تم تعديل الشركة': 'تم اضافة الشركة',
                message: data.message,
                buttonSend: "ملف الشركة"
              },
            });
            this.dialogRef.close(false);
            this.loadingData = false;
            setTimeout(() => {
              succressDialog.close();
            }, 2000);
            succressDialog.componentInstance.submitted = true;
            succressDialog.componentInstance.submitClicked.subscribe(result => {
              succressDialog.close();
            })
          },
          error:err => {
            

            this.loadingData = false;

          }
        })
      } else {
        this.loadingData = false;

        this.toast.error("لم يتم تغير حقل");
      }
    } else {
      this.getControl("preferredLanguageId")?.markAsDirty();
      this.getControl("email")?.markAsDirty();
      this.getControl("name")?.markAsDirty();
      this.getControl("companyCountryId")?.markAsDirty();

      
    
    }
  }

  request() {

    if (this.addBranchGroupForm.valid && this.submitted) {
      this.submitted = false;
      this.submitClicked.emit(this.addBranchGroupForm.value);
      // this.dialogRef.close(true);
    } else {
      this.getControl("name")?.markAsDirty();
    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
