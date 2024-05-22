import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SettingsService } from './services/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';

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
  udpateSetting:any[] = [];
  private dialog = inject(MatDialog);

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
  filter() {
    this.getSettings();

  }
  resetFilteration() {

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
    this.getSettings();
 
  }
  createSettings() {
    // udpateSetting
    this.udpateSetting = [];
    

    if(this.getControlArray("gorup")?.controls?.length > 0) {
      

      if(this.getControlArray("gorup")?.dirty && this.getControlArray("gorup")?.valid) {
        

        this.getControlArray("gorup").controls.forEach(control => {
          

          if((control.get("settings") as FormArray)?.controls?.length >0) {
            
            (control.get("settings") as FormArray)?.controls.forEach(insideControl => {
              
  
                
                  
                  this.udpateSetting.push({
                    Id:insideControl.get("id")?.value,
                    settingType:insideControl.get("settingType")?.value,
                    value:insideControl.get("settingValue")?.value
                  })
                  console.log(this.getControlArray("gorup").controls);
  
  
            })
   
          }
        })
      } else {
        this.toast.error("برجاء تغير اي حقل لقبول طلبك");

      }
   

    };
    
    if(this.udpateSetting.length > 0) {
      

      this.loading = true;
      

      this.settingsService.updateSetting({Settings:this.udpateSetting}).subscribe({
        next:data => {
          this.loading = false;

          const succressDialog = this.dialog.open(ToastSuccessComponent, {
            width: "30vw",
            data: {
              title: "تم ارسال طلبك",
              message: data.message,
              buttonSend: "طلبات الإعدادات"

            },
          });
          // this.getResponsibility(this.filteration);
          // this.getSettings();
          this.getControlArray("gorup").markAsPristine();
          setTimeout(() => {
            succressDialog.close();

          }, 2000);
          succressDialog.componentInstance.submitted = true;
          succressDialog.componentInstance.submitClicked.subscribe(result => {
            succressDialog.close();
          })
        },
        error: err => {
          this.toast.error(err.error.message);

          this.loading = false;

        }
      });
    }
  }
  getSettings() {
    this.loading = true;

    this.formSettings.get("gorup")?.reset();
    this.settingsService.getSettings().subscribe({
      next:data => {
        
        if(data.length >0) {
          data.forEach((groupData:any, parentIndex:number) => {
            this.getControlArray("gorup").push(this.createGroup(groupData.groupType, groupData.groupTypeName));
            groupData.settings.forEach((setting:any, childIndex:number) => {
              (this.getControlArray("gorup").at(parentIndex).get('settings') as FormArray)
              .push(this.createSetting(setting.id, setting.settingType,setting.settingTypeName, setting.valueType, setting.value));

            });
          });
   
  
        }else {
          this.emptyData = true;
        }
        this.loading = false;
      },
      error:err => {
        
        this.emptyData = true;
        this.loading = false;

      }
    })
  }
 getControlArray(FormControl: string): FormArray<any> {
    return this.formSettings.get(FormControl) as FormArray;
  }
  get groups() {
    return this.formSettings.get("gorup") as FormArray;

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
    
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      

      const regex = new RegExp(`^\\d+(\\.\\d{0,${decimalPlaces}})?$`);
      

      if (value && regex.test(value)) {
        

        return { invalidDecimal: true };
      }
      

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
