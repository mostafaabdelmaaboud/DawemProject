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
import { ToastrService } from 'ngx-toastr';
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { DefaultLookupsService } from '../../services/default-lookups.service';
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
  selector: 'app-add-lookup',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatProgressSpinnerModule,MultiSelectModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-lookup.component.html',
  styleUrls: ['./add-lookup.component.scss']
})
export class AddLookupComponent {

  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  @Input() list: any[] = [
  ];
  @Input() workTeamList: any[] = [
  ];
  @Input() id!: string;
  @Input() typeGetById!: number;

  
  dateTaskMultiple = false;
  listEmployees: any[] = [
  ];
  loading = false;

  @Input() editLookup!: boolean;

  addBranchGroupForm: FormGroup = this.fb.group({
    IsActive: [false],
    NameTranslations: this.fb.array([this.createNewTranslate(0,[], false)]),


  });
  requiredCommercialRegFiles = false;
  private defaultLookupsService = inject(DefaultLookupsService);
  filterationLanguages = {PagingEnabled: true, PageSize: 5, PageNumber: 0 }
  constructor(
    public dialogRef: MatDialogRef<AddLookupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
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

    if (this.editLookup) {
      let lookupGetById:any;
      switch (this.typeGetById) {
        case 0:
          lookupGetById = this.defaultLookupsService.vacationTypeGetById({ vacationTypeId: this.id })
          break;
          case 1:
            lookupGetById = this.defaultLookupsService.jobTitlesGetById({ JobTitleId: this.id })
            break;
            case 2:
              lookupGetById = this.defaultLookupsService.departmentsGetById({ DepartmentId: this.id })
              break;
              case 3:
                lookupGetById = this.defaultLookupsService.officialHolidayGetById({ OfficialHolidayId: this.id })
                break;
                case 4:
                  lookupGetById = this.defaultLookupsService.taskTypeGetById({ TaskTypeId: this.id })
                  break;
                  case 5:
                  lookupGetById = this.defaultLookupsService.permissionTypeGetById({ PermissionTypeId: this.id })
                  break;
                  case 6:
                    lookupGetById = this.defaultLookupsService.justificationTypeGetById({ JustificationTypeId: this.id })
                    break;
                    case 6:
                      lookupGetById = this.defaultLookupsService.justificationTypeGetById({ JustificationTypeId: this.id })
                      break;
                      case 7:
                        lookupGetById = this.defaultLookupsService.shiftTypeGetById({ shiftTypeId: this.id })
                        break;
                        case 8:
                        lookupGetById = this.defaultLookupsService.penaltiesGetById({ PenaltiesId: this.id })
                        break;
                      
        default:
          break;
      }
      let getLanguages = this.defaultLookupsService.getLanguages(this.filterationLanguages);

      combineLatest({
        lookupGetById,
        getLanguages
        
      }).subscribe({
        next: data => {
          let planGetById:any = data.lookupGetById;
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
          this.getControl("IsActive")?.setValue(planGetById.isActive);
          this.loading = false;
        },
        error:err => {
          this.loading = false;
        }
      })
    }
    if (!this.editLookup) {
      let getLanguages = this.defaultLookupsService.getLanguages(this.filterationLanguages);
      combineLatest({
        getLanguages
      }).subscribe({
        next: data => {
          let getLanguage = data.getLanguages;
          

          getLanguage.forEach((country: any) => {
            
            this.languages.push({ name: country.name, id: country.id });
            this.copyLanguages.push({ name: country.name, id: country.id });
          });
          this.getControlArray("NameTranslations").at(0).get("languages")?.setValue(this.languages);

          
    

          this.loading = false;
        },
        error:err => {
          

          this.loading = false;

        }
      })
      // this.getLanguages();

    }


  }
  getLanguages() {

    this.defaultLookupsService.getLanguages(this.filterationLanguages).subscribe({
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
        if(findIdexLanguage >= 0) {
          // let deleteLanguages = [...this.copyLanguages];
          this.copyLanguages.splice(findIdexLanguage, 1);
          this.getControlArray("NameTranslations").push(this.createNewTranslate(0,this.copyLanguages, false));
        }
      } else {
        this.getControlArray("NameTranslations").at(index).get("name")?.markAsDirty();
        this.getControlArray("NameTranslations").at(index).get("LanguageId")?.markAsDirty();

        
      }
    } 
  }
  deleteLanguage(index:number) {
    
    this.copyLanguages.push(this.getControlArray("NameTranslations").at(index).get("LanguageId")?.value);
    this.getControlArray("NameTranslations").removeAt(index);
  }
  request() {
    if (this.addBranchGroupForm.valid && this.submitted && this.getControlArray("NameTranslations").at(this.getControlArray("NameTranslations").controls.length - 1).valid) {
      this.submitted = false;
      this.submitClicked.emit(this.addBranchGroupForm.value);
    } else {
      if(this.getControlArray("NameTranslations").at(this.getControlArray("NameTranslations").controls.length - 1).invalid) {
        this.getControlArray("NameTranslations").at(this.getControlArray("NameTranslations").controls.length - 1).get("name")?.markAsDirty();
        this.getControlArray("NameTranslations").at(this.getControlArray("NameTranslations").controls.length - 1).get("LanguageId")?.markAsDirty();
      }
    }
  }
  lastSearchQuery = "";
  searchDropdown(data: any, type: string) {
    switch (type) {
        case 'LanguageId':
          if (data.value || data.value === "") {
            if (data.value !== this.lastSearchQuery || data.value === "") {
              this.lastSearchQuery = data.value;
              this.defaultLookupsService.getLanguages({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data.value }).pipe(
                debounceTime(300),
                distinctUntilChanged()).subscribe((res: any) => {
                  let languages:any[] = [];
                  res.forEach((country: any) => {  
                    languages.push({ name: country.name, id: country.id });
                  });
                  this.getControlArray("NameTranslations").at(data.index).get("languages")?.setValue(languages);
                });
            }
          }
          break
      default:
        break;
    }
  }
  close(): void {
    this.dialogRef.close(false);
  }
}
