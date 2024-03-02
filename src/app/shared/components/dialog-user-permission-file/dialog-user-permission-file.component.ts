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
import { UserPermissionsService } from 'src/app/Presentation/user/user-permissions/services/user-permissions.service';

@Component({
  selector: 'app-dialog-user-permission-file',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule,
    SharedModule], templateUrl: './dialog-user-permission-file.component.html',
  styleUrls: ['./dialog-user-permission-file.component.scss']
})
export class DialogUserPermissionFileComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  @Input() id!: any;
  private userPermissionsService = inject(UserPermissionsService);
  columns: any[] = [
    {
      name: "اسم الشاشة/اسم الصلاحية",
      field: "screenName",
    },
    {
      name: "عدد الشاشات المسموح بها",
      field: "permissionScreenActions",
    }
  ];
  permissions: any[] = [];

  isLoading = true;

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

  private _mobileQueryListener: () => void;
  constructor(
    public dialogRef: MatDialogRef<DialogUserPermissionFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog | null,
    private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.permissions = this.permissions;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.permissions = this.permissions;

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
    this.translate.get("userPermissions").subscribe(data => {
      this.columns = [
        {
          name: data.screenNamePermissionName,
          field: "screenName",
        },
        {
          name: data.numberOfScreensAllowed,
          field: "permissionScreenActions",
        }
      ];
    })
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

      this.userPermissionsService.permissionGetInfo({ permissionId: this.id }).subscribe(
        {
          next: data => {

            this.info = data;

            this.getPermissions(data.permissionScreens);




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
  getPermissions(permissionScreens: any) {
    this.permissions = [];


    permissionScreens.forEach((permission: any) => {
      this.permissions.push({
        screenName: permission.screenName ? permission.screenName : "لا يوجد",
        permissionScreenActions: permission.permissionScreenActions.map((per: any) => per.actionName)
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
    this.getPermissions(this.filteration)
  }

  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getPermissions(this.filteration)
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
