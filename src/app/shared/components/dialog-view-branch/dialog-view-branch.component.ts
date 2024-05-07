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
export interface MapMarker {
  latitude: number;
  longitude: number;
  label?: string;
  draggable: boolean;
}
@Component({
  selector: 'app-dialog-view-branch',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule,
    AgmCoreModule,
    SharedModule],  
    templateUrl: './dialog-view-branch.component.html',
    styleUrls: ['./dialog-view-branch.component.scss']
})
export class DialogViewBranchComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  @Input() dataRow!: any;
  latitude: number = -1.2921;
  longitude: number = 36.8219;

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
    public dialogRef: MatDialogRef<DialogViewBranchComponent>,
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
   
    this.latitude = this.dataRow?.latitude;
    this.longitude = this.dataRow?.longitude;
    this.markers = [{
      latitude: this.dataRow?.latitude,
      longitude: this.dataRow?.longitude,
      label: 'Point A',
      draggable: true
    }];
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  close(): void {
    this.dialogRef.close(false);
  }





}
