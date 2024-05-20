import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  date!: Date;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  settings:any[] =[];
  opened = false;
  subscription!: Subscription;
  filterForm!: FormGroup;
  formSettings!:FormGroup;
  settingsService = inject(SettingsService);
  loading = false;
  emptyData = false;
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');
    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.settings = this.settings;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.settings = this.settings;
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
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.filterForm = this.fb.group({
      FreeText: [""],
      code: [""],
    });
    this.formSettings = this.fb.group({
      gorup:this.fb.array([])
    });
    this.loading = true;

    this.settingsService.getSettings().subscribe({
      next:data => {
        debugger;
        if(data.length >0) {
          data.forEach((groupData:any, parentIndex:number) => {
            this.getControlArray("gorup").push(this.createGroup(groupData.groupType, groupData.groupTypeName));
            groupData.settings.forEach((setting:any, childIndex:number) => {
              (this.getControlArray("gorup").at(parentIndex).get('settings') as FormArray)
              .push(this.createSetting(setting.id, setting.settingType,setting.settingTypeName, setting.valueType, setting.value));

            });
          });
          debugger;
          console.log(this.getControlArray("gorup").value);
          debugger;

        }else {
          this.emptyData = true;
        }
        this.loading = false;
      },
      error:err => {
        debugger;
        this.emptyData = true;
        this.loading = false;

      }
    })
  }
  getControlArray(FormControl: string): FormArray {
    return this.formSettings.get(FormControl) as FormArray;
  }
  createSetting(id:number,settingType:number, settingTypeName:string, valueType:number, value:any): FormGroup {
    if(valueType === 2) {
      return this.fb.group({
        id:[id],
        settingType:[settingType],
        settingTypeName:[settingTypeName],
        valueType:[valueType],
        settingValue:[value, [Validators.required, this.decimalValidator(0)]]
       
      }) as FormGroup
    } else {
      return this.fb.group({
        id:[id],
        settingType:[settingType],
        settingTypeName:[settingTypeName],
        valueType:[valueType],
        settingValue:[value, [Validators.required]]
       
      }) as FormGroup
    }


  }
  decimalValidator(decimalPlaces: number): ValidatorFn {
    debugger;
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      debugger;

      const regex = new RegExp(`^\\d+(\\.\\d{0,${decimalPlaces}})?$`);
      debugger;

      if (value && regex.test(value)) {
        debugger;

        return { invalidDecimal: true };
      }
      debugger;

      return null;
    };
  }
  createGroup(groupType:number, groupTypeName:string) {
    return this.fb.group({
      groupType:[groupType],
      
      groupTypeName:[groupTypeName],
      settings: this.fb.array([])
     
    }) as FormGroup
  }
  getChildFormArray(formConrtolName:any, parentIndex:any) {
    return (this.getControlArray("gorup").at(parentIndex).get(formConrtolName) as FormArray) as FormArray;
  }

}
