import { SharedModule } from 'src/app/shared/shared.module';
import { ChangeDetectorRef, Component, Inject, Input, LOCALE_ID, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, map } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { CompaniesService } from 'src/app/Presentation/admin/companies/services/companies.service';
import { AgmCoreModule } from '@agm/core';
import { DialogViewBranchComponent } from '../dialog-view-branch/dialog-view-branch.component';
export interface MapMarker {
  latitude: number;
  longitude: number;
  label?: string;
  draggable: boolean;
}
@Component({
  selector: 'app-dialog-company-file-admin',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule,
    AgmCoreModule,
    SharedModule],
  templateUrl: './dialog-company-file-admin.component.html',
  styleUrls: ['./dialog-company-file-admin.component.scss']
})
export class DialogCompanyFileAdminComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  @Input() id!: any;
  private companiesService = inject(CompaniesService);
  latitude: number = -1.2921;
  longitude: number = 36.8219;
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
      field: "postalCode",
    },
    {
      name: "الإجراء",
      field: "actions",
    }
  ];
  branches: any[] = [];

  isLoading = true;
  markers: MapMarker[] = [
  ]
  filteration: any = {
    PageSize: 5,
    PageNumber: 0,
    PagingEnabled: true
  };

  services: any[] = [
    { name: 'Cash in', key: 'cashIn' },
    { name: 'Cash out', key: 'cashOut' }
  ];
  page = 0;
  categories: any[] = [
  ];
  public configs: PaginationInstance = {
    id: "custom",
    itemsPerPage: 10,
    currentPage: 1,
  };
  totalItems: number = 0;
  first: number = 0;
  rows: number = 5;
  RowsPerPage!: any[];
  mobileQuery: MediaQueryList;
  opened = false;
  info!: any;
  loading = false;
  zoomLevel: number = 10;
  radius = 0;

  private _mobileQueryListener: () => void;
  constructor(
    public dialogRef: MatDialogRef<DialogCompanyFileAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog | null,
    private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService) {
    this.date = new Date();
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



    };
    this.mobileQuery.addListener(this._mobileQueryListener);
    translate.addLangs(['ar', 'en']);
    translate.setDefaultLang('ar');
    const browserLang: any = translate.getBrowserLang();
    let lang = browserLang.match(/ar|en/) ? browserLang : 'ar';

    this.subscription = this.translate.stream('primeng').subscribe(data => {
      this.config.setTranslation(data);
    });
  }
  ngOnInit(): void {

    if (this.mobileQuery.matches) {
      this.opened = true;
    } else {
      this.opened = false;

    }
    this.filterForm = this.fb.group({
      date: [],
      type: this.fb.group({

      }),
      currencyCode: this.fb.group({
      }),
      minimum: [null, this.minimumValidator("maxmimum")
      ],
      maxmimum: [null, this.maximumValidator("minimum")]
    });
    this.categories.push({ name: "adasd", key: "adsas" });
    this.RowsPerPage = [
      { name: '5', code: 5 },
      { name: '10', code: 10 },
      { name: '25', code: 25 },

    ];

    if (this.id >= 0) {
      this.loading = true;

      this.companiesService.CompanyInfo({ companyId: this.id }).subscribe(
        {
          next: data => {

            this.info = data;
            this.latitude = this.info?.headquarterLocationLatitude;
            this.longitude = this.info?.headquarterLocationLongtude;
            this.markers = [{
              latitude: this.info?.headquarterLocationLatitude,
              longitude: this.info?.headquarterLocationLongtude,
              label: 'Point A',
              draggable: true
            }];
            this.getBranches(data.branches);




          }, error: err => {
            this.loading = false;


          }
        }
      )

    }
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  close(): void {
    this.dialogRef.close(false);
  }
  getBranches(branches: any) {
    this.branches = [];
    branches.forEach((branch: any) => {
      this.branches.push({
        name: branch.name ? branch.name : "لا يوجد",
        address: branch.address ? branch.address : "لا يوجد",
        postalCode: branch.postalCode ? branch.postalCode : "لا يوجد",
        latitude: branch.latitude,
        longitude: branch.longitude
      })
    });
    this.isLoading = false;
    this.loading = false;
  }


  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getBranches(this.filteration)
  }

  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getBranches(this.filteration)
  }
  minimumValidator(conInput: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      let checkMin = true;
      if (value != null) {

        if (this.filterForm.get(conInput)?.dirty && !this.filterForm.get(conInput)?.hasError('required')) {
          if (value > this.filterForm.get(conInput)?.value) {
            checkMin = false;
          }
        }
      }
      // const hasNumber = /\d/.test(value);
      return checkMin ? null : { numberIsBig: true };

    };
  }

  viewDetailsRow(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogViewBranchComponent, {
      width: "80vw",
      maxWidth:"80vw",
      data: {
        title: "ملف الشركة"
      },
    });
    dialogRefAddCurrency.componentInstance.dataRow = data

  }
  maximumValidator(conInput: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      let checkMin = true;

      if (value != null) {
        if (this.filterForm.get(conInput)?.dirty && !this.filterForm.get(conInput)?.hasError('required')) {
          if (value < this.filterForm.get(conInput)?.value) {
            checkMin = false;
          }
        }
      }
      // const hasNumber = /\d/.test(value);
      return checkMin ? null : { numberIsLess: true };
    };
  }
  changePage(even: number) {
    this.filteration.page = even;
    let filteration = { ...this.filteration, page: even - 1 };
    // this.getListTransaction(filteration)

  }
  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
