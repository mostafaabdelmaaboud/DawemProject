import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SchedulesService } from 'src/app/Presentation/user/tables/services/schedules.service';
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { GroupsService } from 'src/app/Presentation/user/groups/services/groups.service';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { SectionsService } from 'src/app/Presentation/user/sections/services/sections.service';

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
    private authService: AuthService,
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


                  data?.zoneIds?.forEach((zone: any) => {

                    let indexZones = this.listZones.findIndex(list => list.key === zone);


                    if (indexZones >= 0) {
                      if (Array.isArray(this.getControl("zoneIds")?.value)) {
                        this.getControl("zoneIds")?.patchValue(([{ name: this.listZones[indexZones].name, key: this.listZones[indexZones].key }, ...this.getControl("zoneIds")?.value]));
                      } else {
                        this.getControl("zoneIds")?.patchValue(([{ name: this.listZones[indexZones].name, key: this.listZones[indexZones].key }]));
                      }
                    }

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
  }
  nodeSelect(data: any) {
  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'groupEmployees':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.groupsService.GetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listGroupEmployees = [];
                this.lastSearchQuery = "";
                res.data?.forEach((day: any) => {
                  this.listGroupEmployees.push({ name: day.name, key: day.id });
                });
              });
          }

        }
        break;
      case 'groupManager':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.groupsService.GetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listGroupManager = [];
                this.lastSearchQuery = "";
                res.data?.forEach((day: any) => {
                  this.listGroupManager.push({ name: day.name, key: day.id });
                });
              });
          }

        }
        break;
      case 'deputyDirector':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.groupsService.GetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listDeputyDirector = [];
                this.lastSearchQuery = "";
                res.data?.forEach((day: any) => {
                  this.listDeputyDirector.push({ name: day.name, key: day.id });
                });
              });
          }

        }
        break;
      case 'zoneIds':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.sectionsService.GetForDropDownZones({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listZones = [];
                this.lastSearchQuery = "";
                res.data?.forEach((day: any) => {
                  this.listZones.push({ name: day.name, key: day.id });
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
