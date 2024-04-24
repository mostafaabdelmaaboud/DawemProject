import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SchedulesService } from 'src/app/Presentation/user/tables/services/schedules.service';
import { Subscription, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { GroupsService } from 'src/app/Presentation/user/groups/services/groups.service';
import { TreeModule } from 'primeng/tree';
import { PrimeNGConfig, TreeNode } from 'primeng/api';
import { SectionsService } from 'src/app/Presentation/user/sections/services/sections.service';
import { MatRadioModule } from '@angular/material/radio';
import { EmployeesService } from 'src/app/Presentation/user/employees/services/employees.service';
import { SchedualPlanService } from 'src/app/Presentation/user/schedual-plan/services/schedual-plan.service';
import { VacationBalanceService } from 'src/app/Presentation/user/vacation-balance/services/vacation-balance.service';
import { TableModule } from 'primeng/table';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginatorModule } from 'primeng/paginator';
import { AgmCoreModule } from '@agm/core';
import { EditBranchComponent } from '../edit-branch/edit-branch.component';

interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  titleClose: string;
  setAsActive: string;
  titleNotes: string,
  placeholdeNotes: string,
  ValidationNotes: string,
  Titlesaturday: string,

  labelRadioButton: string;
  firstRadio: string;
  secondRadio: string;
  thirdRadio: string;

  titleDepartmentId: string;
  placeholdeDepartmentId: string;
  ValidationDepartmentId: string;

  titleFieldDisabled: string;
  placeholdeieldDisabled: string;

  titleEmployeeId: string;
  placeholdeEmployeeId: string;
  ValidationEmployeeId: string;

  titleGroupId: string;
  placeholdeGroupId: string;
  ValidationGroupId: string;

  titleVacationType: string;
  placeholdeVacationType: string;
  ValidationVacationType: string;

  titleCalendar: string;
  placeholderCalendar: string;
  validationCalendar: string;

  titleBalance: string;
  placeholderBalance: string;
  validationBalance: string;


  message: string,
  title: string;
  buttonSend: string,
  buttonClose: string,

}
export interface MapMarker {
  latitude: number;
  longitude: number;
  label?: string;
  draggable: boolean;
}
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-add-branch',
  standalone: true,
  imports: [CommonModule,TableModule, FormsModule,AgmCoreModule,NgxPaginationModule,PaginatorModule, ReactiveFormsModule, MatRadioModule, MultiSelectModule, MatProgressSpinnerModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss']
})
export class AddBranchComponent {
  loading = false;

  private dialog = inject(MatDialog);
  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  
  list: any[] = [
  ];
  @Input() editVacation!: boolean;
  @Input() id!: string;
  RowsPerPage!: any[];

  listEmployeeId: any[] = [
  ];
  listGroupId: any[] = [
  ];
  listDepartmentId: any[] = [
  ];
  totalItems: number = 0;
  @ViewChild("searchMapRef") searchMapRef!: ElementRef;
  zoomLevel: number = 10;

  autoComplete!: google.maps.places.Autocomplete | undefined;
  latitude: number = -1.2921;
  radius = 0;
  editBranch = false;
  longitude: number = 36.8219;
  listVacationType: any[] = [];
  columns: any[] = [
    {
      name: "اسم الفرع",
      field: "name",
    },
    {
      name: "عنوان الفرع",
      field: "address",
    },
    {
      name: "رمز البريدي للفرع",
      field: "postalCode"
    },
    {
      name: "الإجراء",
      field: "actions"
    }
  ];
  branches: any[] = [];
  editAfterBranches: any[] = [];

  opened = false;

  isLoading = true;
  filteration: any = {
    PageSize: 5,
    PageNumber: 0,
    PagingEnabled: true
  };
  private vacationBalanceService = inject(VacationBalanceService);
  employeeIdToggle = true;
  groupIdToggle = false;
  departmentIdToggle = false;
  weekDays: any[] = [];
  addBranchGroupForm: FormGroup = this.fb.group({
    Name: ["", Validators.required],
    Address: ["", Validators.required],
    Latitude:['', Validators.required],
    Longitude:['', Validators.required],
    PostalCode: ["", Validators.required]
  });
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  mobileQuery: MediaQueryList;
  subscription!: Subscription;
  indexIncrement = 1;
  private _mobileQueryListener: () => void;
  clonedProducts: { [s: string]: any } = {};
  defaultRowPerPage = { name: '5', code: 5 };
  markers: MapMarker[] = [
  ]
  constructor(
    public dialogRef: MatDialogRef<AddBranchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | any,
    private changeDetectorRef: ChangeDetectorRef,
    public translate: TranslateService,
    private authService: AuthService,
    private config: PrimeNGConfig,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private toast: ToastrService,
     media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.branches = this.branches;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.branches = this.branches;

        changeDetectorRef.detectChanges();

      }

      this.dialogRef.disableClose = true;


    };
    this.mobileQuery.addListener(this._mobileQueryListener);
    translate.addLangs(['ar', 'en']);
    translate.setDefaultLang('ar');
    const browserLang: any = translate.getBrowserLang();
    let lang = browserLang.match(/ar|en/) ? browserLang : 'ar';

    this.subscription = this.translate.stream('primeng').subscribe(data => {
      this.config.setTranslation(data);
    });
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loading = false;
    this.RowsPerPage = [
      { name: '2', code: 2 },
      { name: '5', code: 5 }

    ];
    this.getBranches(this.filteration);
    
  }
  onMarkerClickEvent(mapLabel: any, mapIndx: number) {
  }
  onMapClickEvent($event: any) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    
    this.getControl("Latitude")?.setValue(this.latitude);
    this.getControl("Longitude")?.setValue(this.longitude);
    this.markers = [{
      latitude: this.latitude,
      longitude: this.longitude,
      label: 'Point A',
      draggable: true
    }]
  }
  markerDragEnd(marker: any, $event: any) {
    this.getControl("Latitude")?.setValue(marker.latitude);
    this.getControl("Longitude")?.setValue(marker.longitude);
    this.latitude = marker.latitude;
    this.longitude = marker.longitude;
    // this.markers = [{
    //   latitude: marker.latitude,
    //   longitude: marker.longitude,
    //   label: marker.label,
    //   draggable: true
    // }];
  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getBranches(this.filteration)
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  ngAfterViewInit() {
    this.autoComplete = new google.maps.places.Autocomplete(this.searchMapRef.nativeElement)
    this.autoComplete.addListener("place_changed", () => {

      // const place = this.autoComplete?.getPlace();
      const place: any = this.autoComplete?.getPlace();
      if (place.geometry && place.geometry.location) {
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();
        this.getControl("Latitude")?.setValue(latitude);
        this.getControl("Longitude")?.setValue(longitude);

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
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getBranches(this.filteration)
  }
  reasonOfRefuse(data: any) {
    const reasonOfRefuseDialog = this.dialog.open(DialogDeleteComponent, {
      width: "30vw",
      data: {
        title: "هل متأكد من حذف الفرع؟",
        titleClose: "تراجع",
        buttonSend: "حذف"
      },
    });

    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
    
      let findIndexBranch = this.branches.findIndex((branch:any) =>branch.id === data.id)
    this.branches.splice(findIndexBranch, 1);
    this.branches = this.branches.map(branch => {
      return {...branch, editBranch:true}
    })
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.close();
    })
  }
  getBranches(filteration) {
this.isLoading = false;
this.totalItems = this.branches.length;

  }
  nodeSelect(data: any) {
  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'EmployeeId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.vacationBalanceService.GetForDropDownEmployee({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listEmployeeId = [];
                this.lastSearchQuery = "";
                res.data?.forEach((day: any) => {
                  this.listEmployeeId.push({ name: day.name, key: day.id });
                });
              });
          }

        }
        break;

      case 'GroupId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.vacationBalanceService.groupsForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listGroupId = [];
                this.lastSearchQuery = "";
                res.data?.forEach((day: any) => {
                  this.listGroupId.push({ name: day.name, key: day.id });
                });
              });
          }
        }
        break;
      case 'DepartmentId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.vacationBalanceService.departmentForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listDepartmentId = [];
                this.lastSearchQuery = "";
                res.data?.forEach((day: any) => {
                  this.listDepartmentId.push({ name: day.name, key: day.id });
                });
              });
          }

        }
        break;
      case 'VacationType':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.vacationBalanceService.vacationForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listVacationType = [];
                this.lastSearchQuery = "";
                res.data?.forEach((day: any) => {
                  this.listVacationType.push({ name: day.name, key: day.id });
                });
              });
          }

        }
        break;

      default:
        break;
    }
  }
  getControl(controlName: string) {
    return this.addBranchGroupForm?.get(controlName);
  }
  onRowEditInit(branch: any) {
    this.clonedProducts[branch.uniqId as string] = { ...branch };
}

onRowEditSave(branch: any) {
    // if (branch.price > 0) {
    //     delete this.clonedProducts[branch.uniqId as string];
    //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'branch is updated' });
    // } else {
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    // }
    let dialogRefAddCurrency = this.dialog.open(EditBranchComponent, {
      width: "80vw",
      maxWidth:"80vw",
      data: {
        title: "تعديل فرع",
        titleClose:"أغلاق",
        buttonSend: "تعديل الفرع"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editBranch = true;
    

    dialogRefAddCurrency.componentInstance.objectBranch = branch;

    
    dialogRefAddCurrency.componentInstance.branches = this.branches;
    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      
      
      let findIndexBranches = this.branches.findIndex(branch => branch.uniqId === result.uniqId);
      let editAfteFindIndexBranches = this.editAfterBranches.findIndex(branch => branch.uniqId === result.uniqId);

      
      if(findIndexBranches >=0) {
        this.branches[findIndexBranches] = {...result,editBranch:true};

      }
      if(editAfteFindIndexBranches >=0) {
        this.editAfterBranches[editAfteFindIndexBranches] =  {...result,editBranch:true};
      }
      this.editBranch = true;
      

      

      dialogRefAddCurrency.componentInstance.submitted = true;
      dialogRefAddCurrency.close();
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {
      }
    });

}

onRowEditCancel(branch: any, index: number) {
    this.branches[index] = this.clonedProducts[branch.uniqId as string];
    delete this.clonedProducts[branch.uniqId as string];

}
addBranch() {
  
  if (this.addBranchGroupForm.valid && this.submitted) {
    // this.submitted = false;
    

    let formatObject = {
      id:0,
      uniqId:`${this.indexIncrement}AddBranch`,
      name:this.addBranchGroupForm.get("Name")?.value,
      address: this.addBranchGroupForm.get("Address")?.value,
      latitude:this.addBranchGroupForm.get("Latitude")?.value,
      longitude:this.addBranchGroupForm.get("Longitude")?.value,
      postalCode: this.addBranchGroupForm.get("PostalCode")?.value,
      editBranch:true
    }
    

    this.branches.push(formatObject);
    this.editAfterBranches.push(formatObject);
    this.indexIncrement++;
    this.getBranches(this.filteration);
    this.addBranchGroupForm.reset();

    // this.dialogRef.close(true);
  } else {

    this.getControl("Name")?.markAsDirty();
    this.getControl("Address")?.markAsDirty();
    this.getControl("PostalCode")?.markAsDirty();
    if(this.addBranchGroupForm.get("Latitude")?.invalid && this.addBranchGroupForm.get("Longitude")?.invalid ) {
      this.toast.error("Latitude and Longitude required");
    } else {
      if(this.addBranchGroupForm.get("Latitude")?.invalid) {
        this.toast.error("Latitude is required");
      }
      if(this.addBranchGroupForm.get("Longitude")?.invalid) {
        this.toast.error("Longitude is required");
      }
    }

  }
}
  request() {
    
    if ((this.editAfterBranches.length > 0 || this.editBranch) && this.submitted) {
      this.submitted = false;
      let formatBranches = this.branches.map((branch:any) => {
        return {
          id:branch.id,
          name:branch.name,
          address: branch.address,
          Latitude:branch.Latitude,
          Longitude:branch.Longitude,
          postalCode: branch.postalCode
        }
      })
      this.submitClicked.emit(this.branches);
      // this.dialogRef.close(true);
    } else {
      this.toast.error("من فضلك ادخل الفرع");

    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
