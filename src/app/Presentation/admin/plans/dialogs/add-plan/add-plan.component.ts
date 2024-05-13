import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from 'primeng/multiselect';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PlansService } from '../../services/plans.service';
import { ToastrService } from 'ngx-toastr';
import { combineLatest } from 'rxjs';
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
  selector: 'app-add-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatProgressSpinnerModule,MultiSelectModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss']
})
export class AddPlanComponent {

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

  @Input() editPlane!: boolean;
  addBranchGroupForm: FormGroup = this.fb.group({
    IsActive: [false],
    IsTrial: [false],
    NameTranslations: this.fb.array([this.createNewTranslate(0,[], false)]),
    MinNumberOfEmployees:["", [Validators.required]],
    MaxNumberOfEmployees:["", [Validators.required]],
    EmployeeCost:["", [Validators.required]],
    Notes:["", [Validators.required]]

  });
  AttachmentsFiles: any[] = [];
  requiredCommercialRegFiles = false;
  toggleForEmployee = false;
  private plansService = inject(PlansService);
  filterationLanguages = {PagingEnabled: true, PageSize: 5, PageNumber: 0 }
  constructor(
    public dialogRef: MatDialogRef<AddPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
  }
  languages:any[]= [];
  copyLanguages:any[]= []

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loading = true;
    if (this.editPlane) {
      let planGetById = this.plansService.planGetById({ planId: this.id });
      let getLanguages = this.plansService.getLanguages(this.filterationLanguages);
      combineLatest({
        planGetById,
        getLanguages
      }).subscribe({
        next: data => {
          let planGetById = data.planGetById;
          let getLanguage = data.getLanguages;
          
          getLanguage.forEach((country: any) => {
            this.languages.push({ name: country.name, id: country.id });
            this.copyLanguages.push({ name: country.name, id: country.id });
          });
          planGetById.nameTranslations?.forEach((translate, i) => {
            
            if(i === 0) {
              
              this.getControlArray("NameTranslations").at(i).get("languages")?.setValue([...this.copyLanguages]);
              this.getControlArray("NameTranslations").at(i).get("id")?.setValue(translate.id);
              
              let findIndexLanguages = this.copyLanguages.findIndex(language => language.id === translate.languageId);
              if(findIndexLanguages >=0) {
                
                this.getControlArray("NameTranslations").at(i).get("LanguageId")?.setValue(this.copyLanguages[findIndexLanguages]);
              }
              this.getControlArray("NameTranslations").at(i).get("name")?.setValue(translate.name);

            } else {
              let findIndexLanguagesRemove = this.copyLanguages.findIndex(language => language.id === planGetById.nameTranslations[i-1].languageId);
              let findIndexLanguages = this.languages.findIndex(language => language.id === translate.languageId);
              if(findIndexLanguages >=0) {
                let languages = this.copyLanguages.filter(language => language.id != planGetById.nameTranslations[i-1].languageId);
                this.getControlArray("NameTranslations").push(this.createNewTranslate(translate.id,languages, false));
                this.getControlArray("NameTranslations").at(i).get("LanguageId")?.setValue(this.languages[findIndexLanguages]);
                this.copyLanguages.splice(findIndexLanguagesRemove, 1)
                this.getControlArray("NameTranslations").at(i - 1).get("readOnly")?.setValue(true);
                this.getControlArray("NameTranslations").at(i).get("name")?.setValue(translate.name);
              }
            }
          });
          // let nameTranslations =  planGetById.nameTranslations.map(translate => translate.languageId);
          // let languages = this.copyLanguages.filter(language => !nameTranslations.includes(language.id));
          // let selectLanguage = languages.findIndex(lang => lang.id === planGetById.nameTranslations[planGetById.nameTranslations.length -1].languageId);
          // console.log(languages);
          // this.getControlArray("NameTranslations").at(this.getControlArray("NameTranslations").controls.length - 1).get("languages")?.setValue(languages);
          // this.getControlArray("NameTranslations").at(this.getControlArray("NameTranslations").controls.length - 1).get("LanguageId")?.setValue(languages[selectLanguage]);

          this.getControl("IsActive")?.setValue(planGetById.isActive);
          this.getControl("IsTrial")?.setValue(planGetById.isTrial);
          this.getControl("MaxNumberOfEmployees")?.setValue(planGetById.maxNumberOfEmployees);
          this.getControl("MinNumberOfEmployees")?.setValue(planGetById.minNumberOfEmployees);
          this.getControl("Notes")?.setValue(planGetById.notes);
          this.getControl("EmployeeCost")?.setValue(planGetById.employeeCost);

          this.loading = false;
        },
        error:err => {
          this.loading = false;

        }
      })
      // this.plansService.planGetById({ planId: this.id }).subscribe(
      //   {
      //     next: data => {
      //       
      //       this.addBranchGroupForm.get("IsNecessary")?.setValue(data.isActive);
      //       this.addBranchGroupForm.get("name")?.setValue(data.name);
      //       this.getLanguages();

      //     },
      //     error: err => {
      //       this.loading = false;
      //     }
      //   }
      // )

    }
    if (!this.editPlane) {
      this.loading = true;
      this.getLanguages();

    }


  }
  getLanguages() {

    this.plansService.getLanguages(this.filterationLanguages).subscribe({
      next:res => {
        
        res.forEach((country: any) => {
          this.languages.push({ name: country.name, id: country.id });
          this.copyLanguages.push({ name: country.name, id: country.id });
        });
        this.getControlArray("NameTranslations").at(0).get("languages")?.setValue(this.languages);
        this.loading = false;
      },
      error: err => {
        this.loading = false;

      }
    });
  }
  getControl(controlName: string) {
    return this.addBranchGroupForm?.get(controlName);
  }
  getControlArray(controlName: string) {
    return this.addBranchGroupForm?.get(controlName) as FormArray;
  }


  createNewTranslate(id:number,languages:any[], readOnly:boolean): FormGroup {
    return this.fb.group({
      id:[id],
      LanguageId: ["", [Validators.required]],
      name: ["", [Validators.required]],
      languages:[languages],
      readOnly:[readOnly]
    }) as FormGroup

  }
  newLanguage(index:number) {
    
    if(this.copyLanguages.length >0) {
      if(this.getControlArray("NameTranslations").at(index).valid) {
        this.getControlArray("NameTranslations").at(index).get("readOnly")?.setValue(true);
  
        let findIdexLanguage = this.copyLanguages.findIndex(language => language.id === this.getControlArray("NameTranslations").at(index).get("LanguageId")?.value?.id);
        if(findIdexLanguage => 0) {
          // let deleteLanguages = [...this.copyLanguages];
          this.copyLanguages.splice(findIdexLanguage, 1);
          this.getControlArray("NameTranslations").push(this.createNewTranslate(0,this.copyLanguages, false));
    
        }
      } else {
        this.getControlArray("NameTranslations").at(index).get("name")?.markAsDirty();
        this.getControlArray("NameTranslations").at(index).get("LanguageId")?.markAsDirty();

        
      }
    } else {

    }
   

    // console.log(this.getControlArray("NameTranslations").at(index).get("LanguageId").value)
    // this.getControlArray("NameTranslations").push(this.createNewTranslate())
  }
  deleteLanguage(index:number) {
    
    this.copyLanguages.push(this.getControlArray("NameTranslations").at(index).get("LanguageId")?.value);
    this.getControlArray("NameTranslations").removeAt(index);
  }
  request() {
    

    if (this.addBranchGroupForm.valid && this.submitted && this.getControlArray("NameTranslations").at(this.getControlArray("NameTranslations").controls.length - 1).valid) {
      this.submitted = false;
      this.submitClicked.emit(this.addBranchGroupForm.value);
      // this.dialogRef.close(true);
    } else {
      

      if(this.getControlArray("NameTranslations").at(this.getControlArray("NameTranslations").controls.length - 1).invalid) {
        this.getControlArray("NameTranslations").at(this.getControlArray("NameTranslations").controls.length - 1).get("name")?.markAsDirty();
        this.getControlArray("NameTranslations").at(this.getControlArray("NameTranslations").controls.length - 1).get("LanguageId")?.markAsDirty();
      }
    
      // addBranchGroupForm: FormGroup = this.fb.group({
      //   IsActive: [false],
      //   IsTrial: [false],
      //   NameTranslations: this.fb.array([this.createNewTranslate([], false)]),
      //   MinNumberOfEmployees:["", [Validators.required]],
      //   MaxNumberOfEmployees:["", [Validators.required]],
      //   EmployeeCost:["", [Validators.required]],
      //   Notes:["", [Validators.required]]
    
      // });
      this.getControl("MinNumberOfEmployees")?.markAsDirty();
      this.getControl("MaxNumberOfEmployees")?.markAsDirty();
      this.getControl("EmployeeCost")?.markAsDirty();
      this.getControl("Notes")?.markAsDirty();

    }

  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'JobTitleId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            // this.employeesService.getJobTitles({ employeesService: true, PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
            //   debounceTime(300),
            //   distinctUntilChanged()).subscribe((res: any) => {
            //     this.jobTitleFirst = [];
            //     this.lastSearchQuery = "";

            //     res?.data?.forEach((jobTitle: any) => {
            //       this.jobTitleFirst.push({ name: jobTitle.name, key: jobTitle.id })
            //     });
            //   });
          }

        }
        break;
     
      default:
        
        break;
    }
  }
  close(): void {
    this.dialogRef.close(false);
  }
}
