import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { combineLatest, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { GroupsService } from 'src/app/Presentation/user/groups/services/groups.service';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { SectionsService } from 'src/app/Presentation/user/sections/services/sections.service';
import { ToastrService } from 'ngx-toastr';

interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  titleClose: string;
  setAsActive: string;
  titleGroupName: string,
  placeholdeGroupName: string,
  ValidationGroupName: string,
  Titlesaturday: string,

  groupEmployees: string;
  placeholdeGroupEmployees: string;
  ValidationGroupEmployees: string;
  titleFieldDisabled: string;
  placeholdeieldDisabled: string;
  groupManager: string;
  placeholdeGroupManager: string;
  ValidationGroupManager: string;

  deputyDirector: string;
  placeholdeDeputyDirector: string;
  ValidationDeputyDirector: string;
  titleZone: string;
  placeholderZone: string;
  validationtitleZone: string;

  validationtitleNotes: string;

  message: string,
  title: string;
  buttonSend: string,
  buttonClose: string,

}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-add-group',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TreeModule, MultiSelectModule, MatProgressSpinnerModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent {
  loading = false;
  treeDepartment: TreeNode[] = [];

  private groupsService = inject(GroupsService);

  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  list: any[] = [
  ];
  @Input() editGroups!: boolean;
  @Input() id!: string;
  listZones: any[] = [];

  listGroupManager: any[] = [
  ];
  listDeputyDirector: any[] = [
  ];
  listGroupEmployees: any[] = [
  ];
  private sectionsService = inject(SectionsService);
  private searchSubject = new Subject<{ value: any; type: any }>();

  weekDays: any[] = [];
  addBranchGroupForm: FormGroup = this.fb.group({
    isActive: [false],
    fieldDisabled: [""],
    groupName: ['', Validators.required],
    groupEmployees: ['', Validators.required],
    groupManager: ["", Validators.required],
    zoneIds: ['', Validators.required],

    deputyDirector: ["", Validators.required],

  });
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  constructor(
    public dialogRef: MatDialogRef<AddGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    public translate: TranslateService,
    private toast: ToastrService,

    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loading = true;
    let groupsDropdown = this.groupsService.GetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let GetForDropDownZones = this.sectionsService.GetForDropDownZones({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });

    this.treeDepartment = [
      {
        label: 'Data Structures',
        icon: 'pi pi-folder',
        children: [
          {
            label: 'List',
            icon: 'pi pi-folder',

            children: [
              {
                label: 'Singly List',
              },
              {
                label: 'Doubly List',
              },
              {
                label: 'Circularly List',
              },
            ],
          },
          {
            label: 'Queue',
            icon: 'pi pi-folder',

            children: [
              {
                label: 'Simple Queue',
                icon: 'pi pi-code',
              },
              {
                label: 'Doubly ended Queue',
                icon: 'pi pi-code',
              },
            ],
          },
        ],
      }

    ]


    combineLatest({
      groupsDropdown,
      GetForDropDownZones
    }).subscribe(
      {
        next: data => {



          this.listGroupEmployees = [];
          this.listGroupManager = [];
          this.listDeputyDirector = [];
          this.listZones = [];

          data.groupsDropdown?.data?.forEach((day: any) => {


            this.listGroupEmployees.push({ name: day.name, key: day.id });
            this.listGroupManager.push({ name: day.name, key: day.id })
            this.listDeputyDirector.push({ name: day.name, key: day.id })

          });
          data.GetForDropDownZones?.data?.forEach((day: any) => {
            this.listZones.push({ name: day.name, key: day.id });
          });

          this.loading = false;

          if (this.editGroups) {
            this.groupsService.groupGetById({ groupId: this.id }).subscribe(
              {
                next: data => {
                  this.getControl("isActive")?.setValue(data.isActive);
                  this.getControl("fieldDisabled")?.setValue(data.code);
                  this.getControl("groupName")?.setValue(data.name);
                  this.groupsService.GetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.managerId }).subscribe(dataDropdown => {
                    this.listGroupManager = [];
                    dataDropdown.data?.forEach((list: any) => {
                      this.listGroupManager.push({ name: list.name, key: list.id });
                    });
                    let indexGroupManager = this.listGroupManager.findIndex(list => list.key === data.managerId);
                    if (indexGroupManager >= 0) {
                      this.getControl("groupManager")?.setValue(this.listGroupManager[indexGroupManager]);

                    }

                  });

                  this.groupsService.GetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, ids: data?.employeeIds }).subscribe(dataDropdown => {

                    this.listGroupEmployees = [];
                    dataDropdown.data?.forEach((list: any) => {
                      this.listGroupEmployees.push({ name: list.name, key: list.id });
                    });
                    data?.employeeIds?.forEach((employee: any) => {


                      let indexEmployees = this.listGroupEmployees.findIndex(list => list.key === employee);


                      if (indexEmployees >= 0) {
                        if (Array.isArray(this.getControl("groupEmployees")?.value)) {
                          this.getControl("groupEmployees")?.patchValue(([{ name: this.listGroupEmployees[indexEmployees].name, key: this.listGroupEmployees[indexEmployees].key }, ...this.getControl("groupEmployees")?.value]));
                        } else {
                          this.getControl("groupEmployees")?.patchValue(([{ name: this.listGroupEmployees[indexEmployees].name, key: this.listGroupEmployees[indexEmployees].key }]));
                        }
                      }

                    });

                  });

                  this.groupsService.GetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, ids: data?.managerDelegatorIds }).subscribe(dataDropdown => {

                    this.listDeputyDirector = [];
                    dataDropdown.data?.forEach((list: any) => {
                      this.listDeputyDirector.push({ name: list.name, key: list.id });
                    });

                    data?.managerDelegatorIds?.forEach((employee: any) => {

                      let indexDeputyDirector = this.listDeputyDirector.findIndex(list => list.key === employee);
                      if (indexDeputyDirector >= 0) {
                        if (Array.isArray(this.getControl("deputyDirector")?.value)) {
                          this.getControl("deputyDirector")?.patchValue(([{ name: this.listDeputyDirector[indexDeputyDirector].name, key: this.listDeputyDirector[indexDeputyDirector].key }, ...this.getControl("deputyDirector")?.value]));
                        } else {
                          this.getControl("deputyDirector")?.patchValue(([{ name: this.listDeputyDirector[indexDeputyDirector].name, key: this.listDeputyDirector[indexDeputyDirector].key }]));
                        }
                      }

                    });

                  });
                  this.sectionsService.GetForDropDownZones({ PagingEnabled: true, PageSize: 5, PageNumber: 0, ids: data?.zoneIds  }).subscribe(dataDropdown => {
                    this.listZones = [];
                    dataDropdown.data?.forEach((day: any) => {
                      this.listZones.push({ name: day.name, key: day.id });
                    });
                    data?.zoneIds?.forEach(zone => {
                      let indexZones = this.listZones.findIndex(list => list.key === zone);
                      if (indexZones >= 0) {
                        if (Array.isArray(this.getControl("zoneIds")?.value)) {
                          this.getControl("zoneIds")?.patchValue(([{ name: this.listZones[indexZones].name, key: this.listZones[indexZones].key }, ...this.getControl("zoneIds")?.value]));
                        } else {
                          this.getControl("zoneIds")?.patchValue(([{ name: this.listZones[indexZones].name, key: this.listZones[indexZones].key }]));
                        }
                      }
                    })
                  });
                  this.loading = false;
                },
                error: err => {
                  this.loading = false;
                }
              }
            )

          }
          if (!this.editGroups) {
            this.loading = false;

          }

        },
        error: err => {
          this.loading = false;

        }
      }
    )
    this.searchSubject
    .pipe(
      debounceTime(500),
      distinctUntilChanged((prev, curr) =>  prev.value === curr.value && prev.type === curr.type
    ) 
    )
    .subscribe(({ value, type }) => {
      this.searchDropdown(value, type, true);
    });
  }
  nodeSelect(data: any) {
  }
  searchList(target:any, type:any) {
    let value = target.value;

    this.searchSubject.next({ value, type }); 

  }
  sortArrayBySearchTerm(
    array: { name: string; key: number }[],
    searchTerm: string
  ): { name: string; key: number }[] {
    return array.sort((a, b) => {
      const aIndex = a.name.indexOf(searchTerm);
      const bIndex = b.name.indexOf(searchTerm);
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });
  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string, searchInput?) {

    switch (type) {
      case 'groupEmployees':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.groupsService.GetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              distinctUntilChanged()).subscribe((res: any) => {
        
                let newArray:any[]= [];
                this.lastSearchQuery = "";
                res?.data?.forEach((jobTitle: any) => {
                  newArray.push({ name: jobTitle.name, key: jobTitle.id })
                });
                newArray = newArray.filter(newItem => 
                  !this.listGroupEmployees.some(oldItem => oldItem.key === newItem.key || oldItem.name === newItem.name)
                );
                const searchTerm = data;

                if(res?.data?.length > 0 || searchInput){
                  if(newArray?.length >0) {
                    this.listGroupEmployees = [...this.listGroupEmployees, ...newArray]
                  }
                  let formatSearch = this.sortArrayBySearchTerm(this.listGroupEmployees, searchTerm);
                  this.listGroupEmployees = [...formatSearch];

                } else {
                  if(!res?.data?.length) {
                    this.toast.error("لا يوجد بيانات");
                  }
                }

              });
          }

        }
        break;
      case 'groupManager':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.groupsService.GetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              distinctUntilChanged()).subscribe((res: any) => {
           
                let newArray:any[]= [];
                this.lastSearchQuery = "";
                res?.data?.forEach((jobTitle: any) => {
                  newArray.push({ name: jobTitle.name, key: jobTitle.id })
                });
                newArray = newArray.filter(newItem => 
                  !this.listGroupManager.some(oldItem => oldItem.key === newItem.key || oldItem.name === newItem.name)
                );
                const searchTerm = data;

                if(res?.data?.length > 0 || searchInput){
                  if(newArray?.length >0) {
                    this.listGroupManager = [...this.listGroupManager, ...newArray]
                  }
                  let formatSearch = this.sortArrayBySearchTerm(this.listGroupManager, searchTerm);
                  this.listGroupManager = [...formatSearch];

                } else {
                  if(!res?.data?.length) {
                    this.toast.error("لا يوجد بيانات");
                  }
                }
              });
          }

        }
        break;
      case 'deputyDirector':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.groupsService.GetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              distinctUntilChanged()).subscribe((res: any) => {
      
                let newArray:any[]= [];
                this.lastSearchQuery = "";
                res?.data?.forEach((jobTitle: any) => {
                  newArray.push({ name: jobTitle.name, key: jobTitle.id })
                });
                newArray = newArray.filter(newItem => 
                  !this.listDeputyDirector.some(oldItem => oldItem.key === newItem.key || oldItem.name === newItem.name)
                );
                const searchTerm = data;

                if(res?.data?.length > 0 || searchInput){
                  if(newArray?.length >0) {
                    this.listDeputyDirector = [...this.listDeputyDirector, ...newArray]
                  }
                  let formatSearch = this.sortArrayBySearchTerm(this.listDeputyDirector, searchTerm);
                  this.listDeputyDirector = [...formatSearch];

                } else {
                  if(!res?.data?.length) {
                    this.toast.error("لا يوجد بيانات");
                  }
                }
              });
          }

        }
        break;
      case 'zoneIds':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.sectionsService.GetForDropDownZones({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              distinctUntilChanged()).subscribe((res: any) => {
     
                let newArray:any[]= [];
                this.lastSearchQuery = "";
                res?.data?.forEach((jobTitle: any) => {
                  newArray.push({ name: jobTitle.name, key: jobTitle.id })
                });
                newArray = newArray.filter(newItem => 
                  !this.listZones.some(oldItem => oldItem.key === newItem.key || oldItem.name === newItem.name)
                );
                const searchTerm = data;

                if(res?.data?.length > 0 || searchInput){
                  if(newArray?.length >0) {
                    this.listZones = [...this.listZones, ...newArray]
                  }
                  let formatSearch = this.sortArrayBySearchTerm(this.listZones, searchTerm);
                  this.listZones = [...formatSearch];

                } else {
                  if(!res?.data?.length) {
                    this.toast.error("لا يوجد بيانات");
                  }
                }
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

  request() {

    if (this.addBranchGroupForm.valid && this.submitted) {
      this.submitted = false;
      this.submitClicked.emit(this.addBranchGroupForm.value);
      // this.dialogRef.close(true);
    } else {
      this.getControl("groupName")?.markAsDirty();
      this.getControl("groupEmployees")?.markAsDirty();
      this.getControl("groupManager")?.markAsDirty();
      this.getControl("deputyDirector")?.markAsDirty();
      this.getControl("zoneIds")?.markAsDirty();

      


    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
