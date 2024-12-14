import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, NgZone, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeesService } from 'src/app/Presentation/user/employees/services/employees.service';
import { EMPTY, Subject, combineLatest, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { GoogleMap, GoogleMapsModule, MapCircle } from '@angular/google-maps';
import { GooglePlaceDirective, GooglePlaceModule } from 'ngx-google-places-autocomplete-esb';
import { Address } from 'ngx-google-places-autocomplete-esb/lib/objects/address';
import { ZonesService } from 'src/app/Presentation/user/zones/services/zones.service';
import { AgmCircle, AgmCoreModule } from '@agm/core';
import { ToastrService } from 'ngx-toastr';

interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  addBranchesInputsProps: addBranchesInputsProps[],
  setAsNecessary: string;
  titleDropdownSecond: string;

  titleClose: string;
  titleFieldDisabled: string;
  placeholdeieldDisabled: string;
  placeholderDropdown: string;
  fieldFirst: string;
  placeholdefieldFirst: string;
  validationtitlefieldFirst: string;


  titleNotes: string;
  placeholdeNotes: string;
  titleDropdownFirst: string;
  placeholderDropdownFirst: string;
  validationtitleDropdownFirst: string;

  labelRadioButtonSecond: string;
  validationtitleDropdownSecond: string;
  validationtitleNotes: string;
  titleWorkSchedule: string
  placeholderWorkSchedule: string;
  validationtitleWorkSchedule: string;
  directManager: string;
  placeholdeDirectManager: string;
  validationtitleDirectManager: string;
  address: string;
  placeholdeAddress: string;
  validationtitleAddress: string;
  email: string;

  placeholdeEmail: string;

  validationtitleEmail: string;
  mobileNumber: string;

  placeholdeMobileNumber: string;
  validationtitleEmailPattern: string;
  validationtitleMobileNumber: string;
  radiusNumber: string;
  placeholdeRadius: string;
  validationtitleRadius: string;

  message: string,
  title: string;
  type: string,
  buttonSend: string,
  code: string;
  buttonClose: string,
  refrenceId?: string,
  subTitle?: string
}

export interface MapMarker {
  latitude: number;
  longitude: number;
  label?: string;
  draggable: boolean;
}
@Component({
  selector: 'app-add-zone',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, AgmCoreModule, MatProgressSpinnerModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  providers: [GooglePlaceDirective],
  templateUrl: './add-zone.component.html',
  styleUrls: ['./add-zone.component.scss']
})
export class AddZoneComponent {
  loading = true;
  private zonesService = inject(ZonesService);
  options: any = {
    types: [],
    componentRestrictions: { country: 'UA' }
  }
  @ViewChild("searchMapRef") searchMapRef!: ElementRef;
  autoComplete!: google.maps.places.Autocomplete | undefined;

  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  @Input() jobTitleFirst: any[] = [];
  companyBranchesList:any[] = [];
  // zoom level of our Google maps
  zoomLevel: number = 15;

  // initial center position for the map of Nairobi city, kenya
  latitude: number = -1.2921;
  longitude: number = 36.8219;
  private searchSubject = new Subject<{ value: any; type: any }>();

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

  markers: MapMarker[] = [
  ]
  @Input() sectionList: any[] = [];
  @Input() workScheduleList: any[] = [];
  @Input() editEmployee!: boolean;
  @Input() id!: string;
  listDirectManager: any[] = [];
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
  // latitude!: number;
  // longitude!: number;
  addBranchGroupForm: FormGroup = this.fb.group({
    isActive: [false],
    fieldDisabled: [''],
    name: ['', Validators.required],
    radius: ['', [Validators.required, Validators.min(0)]],
    latitude: ['', Validators.required],
    companyBranches:[],
    searchOnMap:[],
    longitude: ['', Validators.required]
  });
  constructor(
    public dialogRef: MatDialogRef<AddZoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    public translate: TranslateService,
    private toast: ToastrService,

    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.checkLocationPermission();
    if (this.data?.code) {
      this.addBranchGroupForm.get("fieldDisabled")?.setValue(this.data?.code);
    }
    if (this.editEmployee) {
      let zoneGetById = this.zonesService.ZoneGetById({ zoneId: this.id });
      let companyBranch =  this.zonesService.CompanyBranch({  PagingEnabled: true, PageSize: 5, PageNumber: 0}); 
      combineLatest({
        zoneGetById,
        companyBranch
      }).subscribe({
          next:data => {
            this.addBranchGroupForm.get("isActive")?.setValue(data?.zoneGetById?.isActive);
            this.addBranchGroupForm.get("name")?.setValue(data?.zoneGetById?.name);
            this.addBranchGroupForm.get("radius")?.setValue(data?.zoneGetById?.radius);
            this.radius = data?.zoneGetById?.radius;
            this.latitude = data?.zoneGetById?.latitude;
            this.longitude = data?.zoneGetById?.longitude;
            this.getControl("latitude")?.setValue(this.latitude);
            this.getControl("longitude")?.setValue(this.longitude);
            this.markers = [{
              latitude: this.latitude,
              longitude: this.longitude,
              label: 'Point A',
              draggable: true
            }]
            data.companyBranch.data?.forEach((branch: any) => {
              this.companyBranchesList.push({ name: branch.name, key: branch.id })
            });
            this.loading = false;
          },
          error:err => {
            this.loading = false;
      }})
    }
    if (!this.editEmployee) {
      this.zonesService.CompanyBranch({  PagingEnabled: true, PageSize: 5, PageNumber: 0}).subscribe({
        next:res => {
          res.data?.forEach((branch: any) => {
            this.companyBranchesList.push({ name: branch.name, key: branch.id })
          });
          this.loading = false;

        },
        error:err => {
          this.loading = false;

        }
      })

    }
    this.addBranchGroupForm.get("companyBranches")?.valueChanges.subscribe(data => {
      
      this.loading = true;

      this.zonesService.CompanyBranchGetById({branchId:data.key}).subscribe({
        next:res => {
          
          this.addBranchGroupForm.get("name")?.setValue(res.data.name);

          this.latitude = res.data?.latitude;
          this.longitude = res.data?.longitude;
          this.getControl("latitude")?.setValue(this.latitude);
          this.getControl("longitude")?.setValue(this.longitude);
          this.markers = [{
            latitude: this.latitude,
            longitude: this.longitude,
            label: 'Point A',
            draggable: true
          }]
          this.loading = false;

        },
        error:err => {
          this.loading = false;

        }
      })
    })
    this.addBranchGroupForm.get("radius")?.valueChanges.subscribe(data => {
      if (this.markers.length > 0) {
        this.radius = data;

      }
    });
    this.searchSubject
    .pipe(
      debounceTime(500),
      distinctUntilChanged((prev, curr) =>  prev.value === curr.value && prev.type === curr.type
    ) 
    )
    .subscribe(({ value, type }) => {
      this.searchDropdown(value, type, true);
    });
  }
  
  private checkLocationPermission() {
    
    if (navigator.permissions) {
      

      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        

        if (result.state === 'granted') {
          

          this.getCurrentLocation();
        } else if (result.state === 'prompt') {
          

          this.requestLocation();
        } else {
          console.log('Geolocation permission denied.');
        }

        result.onchange = () => {
          if (result.state === 'granted') {
            this.getCurrentLocation();
          }
        };
      });
    } else {
      this.requestLocation();
    }
  }

  private requestLocation() {
    
    this.loading = true;

    if ('geolocation' in navigator) {
      

      navigator.geolocation.getCurrentPosition(
        (position) => {
          

          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.getControl("latitude")?.setValue(this.latitude);
          this.getControl("longitude")?.setValue(this.longitude);
          this.markers = [{
            latitude: this.latitude,
            longitude: this.longitude,
            label: 'Point A',
            draggable: true
          }];
          this.loading = false;

        },
        (error) => {
          this.loading = false;

          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not available in this browser.');
    }
  }
  private getCurrentLocation() {
    this.loading = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.getControl("latitude")?.setValue(this.latitude);
        this.getControl("longitude")?.setValue(this.longitude);
        this.markers = [{
          latitude: this.latitude,
          longitude: this.longitude,
          label: 'Point A',
          draggable: true
        }];
        this.loading = false;

      },
      (error) => {
            this.loading = false;

        console.error('Error getting location', error);
      }
    );
  }
  searchList(target:any, type:any) {
    let value = target.value;

    this.searchSubject.next({ value, type }); 

  }
  sortArrayBySearchTerm(
    array: { name: string; key: number }[],
    searchTerm: string
  ): { name: string; key: number }[] {
    return array.sort((a, b) => {
      const aIndex = a.name.indexOf(searchTerm);
      const bIndex = b.name.indexOf(searchTerm);
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });
  }
  lastSearchQuery = "";
  searchDropdown(data: any, type: string, searchInput?) {

    switch (type) {
      case 'companyBranches':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.zonesService.CompanyBranch({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
          
                let newArray:any[]= [];
                this.lastSearchQuery = "";
                res?.data?.forEach((jobTitle: any) => {
                  newArray.push({ name: jobTitle.name, key: jobTitle.id })
                });
                newArray = newArray.filter(newItem => 
                  !this.companyBranchesList.some(oldItem => oldItem.key === newItem.key || oldItem.name === newItem.name)
                );
                const searchTerm = data;

                if(res?.data?.length > 0 || searchInput){
                  if(newArray?.length >0) {
                    this.companyBranchesList = [...this.companyBranchesList, ...newArray]
                  }
                  let formatSearch = this.sortArrayBySearchTerm(this.companyBranchesList, searchTerm);
                  this.companyBranchesList = [...formatSearch];

                } else {
                  if(!res?.data?.length) {
                    this.toast.error("لا يوجد بيانات");
                  }
                }
              });
          }

        }
        break;
      default:
        break;
    }
  }

  handleAddressChange(address: Address) {

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

  getControl(controlName: string) {
    return this.addBranchGroupForm?.get(controlName);
  }

  request() {
    if (this.addBranchGroupForm.valid && this.submitted) {
      this.submitted = false;
      this.submitClicked.emit(this.addBranchGroupForm.value);
      // this.dialogRef.close(true);
    } else {

      this.getControl("name")?.markAsDirty();
      this.getControl("radius")?.markAsDirty();
      this.getControl("latitude")?.markAsDirty();
      this.getControl("longitude")?.markAsDirty();

    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
