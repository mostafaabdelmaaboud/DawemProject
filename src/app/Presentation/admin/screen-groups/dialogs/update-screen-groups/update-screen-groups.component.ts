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
import { ScreenGroupsService } from '../../services/screen-groups.service';
import { RadioButtonModule } from 'primeng/radiobutton';
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
  selector: 'app-update-screen-groups',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatProgressSpinnerModule,MultiSelectModule,RadioButtonModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './update-screen-groups.component.html',
  styleUrls: ['./update-screen-groups.component.scss']
})
export class UpdateScreenGroupsComponent {
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
  listParent: any[] = [
  ];
  @Input() editScreen!: boolean;
  addBranchGroupForm: FormGroup = this.fb.group({
    AuthenticationType:["1"],
    ParentId:[""],
    IsActive: [false],
    Notes:["", [Validators.required]],
    Order:["", [Validators.required]],
    Icon:["", [Validators.required]],
    NameTranslations: this.fb.array([this.createNewTranslate(0,[], false)]),
  });
  AttachmentsFiles: any[] = [];
  requiredCommercialRegFiles = false;
  toggleForEmployee = false;
  private screenGroupsService = inject(ScreenGroupsService);
  filterationLanguages = {PagingEnabled: true, PageSize: 5, PageNumber: 0 }
  constructor(
    public dialogRef: MatDialogRef<UpdateScreenGroupsComponent>,
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
 
    this.addBranchGroupForm.get("AuthenticationType")?.valueChanges.subscribe(data => {
      if(data != null) {
        if(!this.editScreen)
        this.screenGroupsService.screenGroupGetForDropDown({PagingEnabled: true, PageSize: 5, PageNumber: 0, LocalAuthenticationType:data }).subscribe({
          next:data => {
            this.listParent = [];
            data.forEach((screen: any) => {
              this.listParent.push({ name: screen.name, id: screen.id });
            });
          },
          error:err => {
  
          }
        })
      }


    })
    if (this.editScreen) {
      let ScreenGetById = this.screenGroupsService.ScreenGetById({ screenGroupId: this.id });
      let getLanguages = this.screenGroupsService.getLanguages(this.filterationLanguages);

      combineLatest({
        ScreenGetById,
        getLanguages
      }).subscribe({
        next: data => {
          let ScreenGetById = data.ScreenGetById;
          let getLanguage = data.getLanguages;
          
          getLanguage.forEach((country: any) => {
            this.languages.push({ name: country.name, id: country.id });
            this.copyLanguages.push({ name: country.name, id: country.id });
          });
   
          

       

          

          ScreenGetById.nameTranslations?.forEach((translate, i) => {
            
            if(i === 0) {
              
              this.getControlArray("NameTranslations").at(i).get("languages")?.setValue([...this.copyLanguages]);
              this.getControlArray("NameTranslations").at(i).get("id")?.setValue(translate.id);
              
              let findIndexLanguages = this.copyLanguages.findIndex(language => language.id === translate.languageId);
              if(findIndexLanguages >=0) {
                
                this.getControlArray("NameTranslations").at(i).get("LanguageId")?.setValue(this.copyLanguages[findIndexLanguages]);
              }
              this.getControlArray("NameTranslations").at(i).get("name")?.setValue(translate.name);

            } else {
              let findIndexLanguagesRemove = this.copyLanguages.findIndex(language => language.id === ScreenGetById.nameTranslations[i-1].languageId);
              let findIndexLanguages = this.languages.findIndex(language => language.id === translate.languageId);
              if(findIndexLanguages >=0) {
                let languages = this.copyLanguages.filter(language => language.id != ScreenGetById.nameTranslations[i-1].languageId);
                this.getControlArray("NameTranslations").push(this.createNewTranslate(translate.id,languages, false));
                this.getControlArray("NameTranslations").at(i).get("LanguageId")?.setValue(this.languages[findIndexLanguages]);
                this.copyLanguages.splice(findIndexLanguagesRemove, 1)
                this.getControlArray("NameTranslations").at(i - 1).get("readOnly")?.setValue(true);
                this.getControlArray("NameTranslations").at(i).get("name")?.setValue(translate.name);
              }
            }
          });

     
          this.getControl("IsActive")?.setValue(ScreenGetById.isActive);
          this.getControl("Notes")?.setValue(ScreenGetById.notes);
          this.getControl("AuthenticationType")?.setValue(ScreenGetById.authenticationType.toString());
          

          if(ScreenGetById.parentId != null) {
            this.screenGroupsService.screenGroupGetForDropDown({PagingEnabled: true, PageSize: 5, PageNumber: 0,LocalAuthenticationType:ScreenGetById.authenticationType, id: ScreenGetById.parentId }).subscribe(dataDropdown => {
              
              this.listParent = [];
              dataDropdown?.forEach((screen: any) => {
                this.listParent.push({ name: screen.name, key: screen.id });
              });
              let indexParentId = this.listParent.findIndex(list => list.key === ScreenGetById.parentId);
              if (indexParentId >= 0) {
                this.getControl("ParentId")?.setValue(this.listParent[indexParentId]);

              }
            })
       

          } else {
            this.screenGroupsService.screenGroupGetForDropDown({PagingEnabled: true, PageSize: 5, PageNumber: 0,LocalAuthenticationType:ScreenGetById.authenticationType }).subscribe(dataDropdown => {
              

              this.listParent = [];
              dataDropdown?.forEach((screen: any) => {
                this.listParent.push({ name: screen.name, key: screen.id });
              });
              let indexParentId = this.listParent.findIndex(list => list.key === ScreenGetById.parentId);
              if (indexParentId >= 0) {
                this.getControl("ParentId")?.setValue(this.listParent[indexParentId]);

              }
            })
          }
          this.getControl("Icon")?.setValue(ScreenGetById.icon);
          this.getControl("Order")?.setValue(ScreenGetById.order);

          this.loading = false;
        },
        error:err => {
          

          this.loading = false;

        }
      })


    }
    if (!this.editScreen) {
      let getLanguages = this.screenGroupsService.getLanguages(this.filterationLanguages);
      let screenGroupGetForDropDown  = this.screenGroupsService.screenGroupGetForDropDown({PagingEnabled: true, PageSize: 5, PageNumber: 0, LocalAuthenticationType:this.addBranchGroupForm.get("AuthenticationType")?.value });
       
      combineLatest({
        getLanguages,
        screenGroupGetForDropDown
      }).subscribe({
        next: data => {
          let getLanguage = data.getLanguages;
          getLanguage.forEach((country: any) => {
            this.languages.push({ name: country.name, id: country.id });
            this.copyLanguages.push({ name: country.name, id: country.id });
          });
          this.getControlArray("NameTranslations").at(0).get("languages")?.setValue(this.languages);
        
          data.screenGroupGetForDropDown.forEach((screen: any) => {
            this.listParent.push({ name: screen.name, id: screen.id });
          });
          this.loading = false;
        },
        error:err => {
          this.loading = false;
        }
      })
    }
  }
  getLanguages() {

    this.screenGroupsService.getLanguages(this.filterationLanguages).subscribe({
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
      this.getControl("Notes")?.markAsDirty();
      this.getControl("Order")?.markAsDirty();
      this.getControl("Icon")?.markAsDirty();
      this.getControl("ParentId")?.markAsDirty();

      
    }

  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {
    switch (type) {
   
        case 'LanguageId':
        if (data.value || data.value === "") {
          if (data.value !== this.lastSearchQuery || data.value === "") {
            this.lastSearchQuery = data.value;
            this.screenGroupsService.getLanguages({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data.value }).pipe(
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
        case 'ParentId':
          if (data.value || data.value === "") {
            if (data.value !== this.lastSearchQuery || data.value === "") {
              this.lastSearchQuery = data.value;
              this.screenGroupsService.screenGroupGetForDropDown({PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data.value }).subscribe({
                next:data => {
                  this.listParent = [];
                  data.forEach((screen: any) => {
                    this.listParent.push({ name: screen.name, id: screen.id });
                  });
                },
                error:err => {
        
                }
              })
    
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
