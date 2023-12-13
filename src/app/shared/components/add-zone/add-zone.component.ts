import { Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeesService } from 'src/app/Presentation/user/employees/services/employees.service';
import { EMPTY, Subject, combineLatest, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { GoogleMapsModule } from '@angular/google-maps';
import { GooglePlaceDirective, GooglePlaceModule } from 'ngx-google-places-autocomplete-esb';
import { Address } from 'ngx-google-places-autocomplete-esb/lib/objects/address';
import { ZonesService } from 'src/app/Presentation/user/zones/services/zones.service';

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


@Component({
  selector: 'app-add-zone',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, GooglePlaceModule, GoogleMapsModule, MatProgressSpinnerModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-zone.component.html',
  styleUrls: ['./add-zone.component.scss']
})
export class AddZoneComponent {
  loading = false;
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

  @Input() sectionList: any[] = [];
  @Input() workScheduleList: any[] = [];
  @Input() editEmployee!: boolean;
  @Input() id!: string;
  listDirectManager: any[] = [];

  zoom = 12;
  center!: google.maps.LatLngLiteral;
  optionsMap: google.maps.MapOptions = {
    mapTypeId: 'terrain',
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: false,
    maxZoom: 15,
    minZoom: 8,
  };
  markers: any[] = [];
  latitude!: number;
  longitude!: number;
  addBranchGroupForm: FormGroup = this.fb.group({
    isActive: [false],
    fieldDisabled: [''],

    name: ['', Validators.required],
    radius: ['', Validators.required],
    latitude: ['', Validators.required],
    longitude: ['', Validators.required]
  });
  constructor(
    public dialogRef: MatDialogRef<AddZoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.data?.code) {
      this.addBranchGroupForm.get("fieldDisabled")?.setValue(this.data?.code);
    }
    this.loading = true;



    if (this.editEmployee) {


      this.zonesService.ZoneGetById({ zoneId: this.id }).subscribe(
        {
          next: data => {



            this.addBranchGroupForm.get("isActive")?.setValue(data.isActive);

            this.addBranchGroupForm.get("name")?.setValue(data.name);
            this.addBranchGroupForm.get("radius")?.setValue(data.radius);
            this.latitude = data.latitude;
            this.longitude = data.longitude;
            this.center = { lat: this.latitude, lng: this.longitude };
            this.getControl("latitude")?.setValue(this.latitude);
            this.getControl("longitude")?.setValue(this.longitude);
            this.markers = [{
              position: {
                lat: this.latitude,
                lng: this.longitude,
              },
              label: {
                color: 'blue',
              },

              options: {
                animation: google.maps.Animation.BOUNCE,
              },
            }]
            this.loading = false;
          },
          error: err => {
            this.loading = false;
          }
        }
      )

    }
    if (!this.editEmployee) {
      this.loading = false;

    }

  }
  lastSearchQuery = "";



  handleAddressChange(address: Address) {
    // Do some stuff


    // console.log(this.placesRef)
  }
  ngAfterViewInit() {
    this.autoComplete = new google.maps.places.Autocomplete(this.searchMapRef.nativeElement)
    this.autoComplete.addListener("place_changed", () => {

      const place = this.autoComplete?.getPlace();

      console.log(place)
    })
  }
  clickMap(event: any) {

    this.latitude = event.latLng.lat();
    this.longitude = event.latLng.lng();
    this.center = { lat: this.latitude, lng: this.longitude };
    this.getControl("latitude")?.setValue(this.latitude);
    this.getControl("longitude")?.setValue(this.longitude);
    this.markers = [{
      position: {
        lat: this.latitude,
        lng: this.longitude,
      },
      label: {
        color: 'blue',
      },

      options: {
        animation: google.maps.Animation.BOUNCE,
      },
    }]

    console.log(event);
  }
  getControl(controlName: string) {
    return this.addBranchGroupForm?.get(controlName);
  }

  request() {
    if (this.addBranchGroupForm.valid && this.submitted) {
      this.submitted = false;
      this.submitClicked.emit({ ...this.addBranchGroupForm.value });
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
