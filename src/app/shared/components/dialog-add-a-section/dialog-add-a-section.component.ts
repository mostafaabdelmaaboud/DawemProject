import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MatRadioModule } from '@angular/material/radio';
import { MultiSelectModule } from 'primeng/multiselect';
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SectionsService } from 'src/app/Presentation/user/sections/services/sections.service';
import { TreeModule } from 'primeng/tree';

interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {

  titleClose: string;
  titleShift: string;
  placeholdeShift: string;
  validationtitleShift: string;
  entryTime: string;
  placeholderEntryTime: string;
  validationEntryTime: string;
  titletimeToGoOut: string;
  placeholdertimeToGoOut: string;
  validationtimeToGoOut: string;
  extraMinutes: string;
  placeholdeExtraMinutes: string;
  validationtitleExtraMinutes: string;
  titlePermanentType: string;
  placeholderPermanentType: string;
  validationtitlePermanentType: string;

  titleManagerId: string;
  placeholderManagerId: string;

  validationtitleManagerId: string;

  titleZone: string;
  placeholderZone: string;
  validationtitleZone: string;
  titleNotes: string;
  placeholdeNotes: string;
  validationtitleNotes: string;
  titleFieldDisabled: string;
  placeholdeieldDisabled: string;
  managerDelegatorIds: string;
  placeholdemanagerDelegatorIds: string;
  ValidationManagerDelegatorIds: string;
  setAsNecessary: string;
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
  selector: 'app-dialog-add-a-section',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, TreeModule, MatProgressSpinnerModule, MultiSelectModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './dialog-add-a-section.component.html',
  styleUrls: ['./dialog-add-a-section.component.scss']
})
export class DialogAddASectionComponent {

  loading = false;
  treeDepartment: any[] = [];
  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  @Input() listFirst: any[] = [];
  @Input() editSection!: boolean;
  @Input() id!: string;

  loadingTree = false;
  @Input() list: any[] = [];
  listZones: any[] = [];
  addBranchGroupForm: FormGroup = this.fb.group({
    isActive: [false],
    name: ['', Validators.required],
    parentId: ['', Validators.required],
    managerId: ['', Validators.required],
    managerDelegatorIds: ['', Validators.required],
    searchTree: [""],
    fieldDisabled: [''],
    zoneIds: ['', Validators.required],
    notes: ['', Validators.required],
  });
  listManager: any[] = [];
  listManagerDelegator: any[] = [];
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;

  treeValue = "";
  private sectionsService = inject(SectionsService);
  constructor(
    public dialogRef: MatDialogRef<DialogAddASectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {

    this.loading = true;
    let parentIdDropdown = this.sectionsService.GetForDropDownDepartment({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let employeesDropdown = this.sectionsService.GetForDropDownEmployees({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });
    let GetForDropDownZones = this.sectionsService.GetForDropDownZones({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });

    let ForTree = this.sectionsService.getForTree({ PagingEnabled: true, PageSize: 5, PageNumber: 0, IsBaseParent: true });



    combineLatest({
      parentIdDropdown,
      employeesDropdown,
      GetForDropDownZones,
      ForTree
    }).subscribe(
      {
        next: data => {
          this.listFirst = [];
          this.listZones = [];
          this.listManager = [];
          this.listManagerDelegator = [];
          this.treeDepartment = [];
          data.parentIdDropdown?.data?.forEach((day: any) => {
            this.listFirst.push({ name: day.name, key: day.id });
          });

          data.GetForDropDownZones?.data?.forEach((day: any) => {
            this.listZones.push({ name: day.name, key: day.id });
          });

          data.employeesDropdown?.data?.forEach((day: any) => {
            this.listManager.push({ name: day.name, key: day.id });
            this.listManagerDelegator.push({ name: day.name, key: day.id });
          });

          data.ForTree?.data?.forEach((tree: any) => {

            if (tree.hasChildren) {
              this.treeDepartment.push({
                label: tree.name,
                id: tree.id,
                expanded: false,
                hasChildren: true,
                children: []
              })
            } else {
              this.treeDepartment.push({
                label: tree.name,
                id: tree.id,

                expanded: false,
                hasChildren: false,
                children: []
              })
            }
          });
          this.loading = false;

          if (this.editSection) {
            this.sectionsService.sectionGetById({ departmentid: this.id }).subscribe(
              {
                next: data => {


                  this.getControl("isActive")?.setValue(data.isActive);
                  this.getControl("fieldDisabled")?.setValue(data.code);

                  this.getControl("name")?.setValue(data.name);
                  this.getControl("notes")?.setValue(data.notes);

                  this.sectionsService.GetForDropDownDepartment({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.parentId }).subscribe(dataDropdown => {
                    this.listFirst = [];

                    dataDropdown.data?.forEach((list: any) => {
                      this.listFirst.push({ name: list.name, key: list.id });
                    });



                    let indexGroupManager = this.listFirst.findIndex(list => list.key === data.parentId);
                    if (indexGroupManager >= 0) {
                      this.getControl("parentId")?.setValue(this.listFirst[indexGroupManager]);

                    }

                  });
                  this.sectionsService.GetForDropDownEmployees({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.managerId }).subscribe(dataDropdown => {
                    this.listManager = [];

                    dataDropdown.data?.forEach((list: any) => {
                      this.listManager.push({ name: list.name, key: list.id });
                    });
                    let indexGroupManager = this.listManager.findIndex(list => list.key === data.managerId);
                    if (indexGroupManager >= 0) {
                      this.getControl("managerId")?.setValue(this.listManager[indexGroupManager]);

                    }

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

                  this.sectionsService.GetForDropDownEmployees({ PagingEnabled: true, PageSize: 5, PageNumber: 0, ids: data?.managerDelegatorIds }).subscribe(dataDropdown => {
                    this.listManagerDelegator = [];


                    dataDropdown.data?.forEach((list: any) => {
                      this.listManagerDelegator.push({ name: list.name, key: list.id });
                    });


                    data?.managerDelegatorIds?.forEach((employee: any) => {

                      let indexEmployees = this.listManagerDelegator.findIndex(list => list.key === employee);


                      if (indexEmployees >= 0) {
                        if (Array.isArray(this.getControl("managerDelegatorIds")?.value)) {
                          this.getControl("managerDelegatorIds")?.patchValue(([{ name: this.listManagerDelegator[indexEmployees].name, key: this.listManagerDelegator[indexEmployees].key }, ...this.getControl("managerDelegatorIds")?.value]));
                        } else {
                          this.getControl("managerDelegatorIds")?.patchValue(([{ name: this.listManagerDelegator[indexEmployees].name, key: this.listManagerDelegator[indexEmployees].key }]));
                        }
                      }

                    });

                  });







                  this.loading = false;
                },
                error: err => {
                  this.loading = false;
                }
              }
            )

          }
          if (!this.editSection) {
            this.loading = false;

          }

        },
        error: err => {
          this.loading = false;

        }
      }
    )
  }
  searchTree() {

    let formControleSearch = this.addBranchGroupForm.get("searchTree")?.value;
    this.loadingTree = true;
    this.sectionsService.getForTree({ PagingEnabled: true, PageSize: 5, PageNumber: 0, IsBaseParent: true, FreeText: formControleSearch }).subscribe(data => {

      this.treeDepartment = [];
      data.data.forEach((tree: any) => {
        if (tree.hasChildren) {
          this.treeDepartment.push({
            label: tree.name,
            id: tree.id,
            expanded: false,
            hasChildren: true,
            children: []
          })
        } else {
          this.treeDepartment.push({
            label: tree.name,
            id: tree.id,

            expanded: false,
            hasChildren: false,
            children: []
          })
        }
      });
      this.loadingTree = false
    })
  }
  nodeSelect(event: any) {

    const selectedNode = event.node;
    if (selectedNode.hasChildren && selectedNode.children.length === 0) {
      this.loadingTree = true
      this.sectionsService.getForTree({ PagingEnabled: true, PageSize: 5, PageNumber: 0, IsBaseParent: false, ParentId: selectedNode.id }).subscribe(data => {

        selectedNode.children = [];
        data.data.forEach((insideTree: any) => {
          if (insideTree.hasChildren) {
            selectedNode.children.push({
              label: insideTree.name,
              id: insideTree.id,
              expanded: false,
              hasChildren: true,
              children: []
            })
          } else {
            selectedNode.children.push({
              label: insideTree.name,
              id: insideTree.id,
              expanded: false,
              hasChildren: false,
              children: []
            })
          }
        });
        selectedNode.expanded = true;
        this.loadingTree = false
      })
    }

  }
  isPlusVisible(node: any): boolean {
    return node.hasChildren;
  }

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'parentId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.sectionsService.GetForDropDownDepartment({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listFirst = [];
                res.data?.forEach((day: any) => {


                  this.listFirst.push({ name: day.name, key: day.id });

                });


              });
          }

        }
        break;
      case 'managerId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.sectionsService.GetForDropDownEmployees({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listManager = [];
                res.data?.forEach((day: any) => {


                  this.listManager.push({ name: day.name, key: day.id });

                });


              });
          }

        }
        break;
      case 'managerDelegatorIds':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.sectionsService.GetForDropDownEmployees({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listManagerDelegator = [];
                res.data?.forEach((day: any) => {


                  this.listManagerDelegator.push({ name: day.name, key: day.id });

                });


              });
          }

        }
        break;
      case 'zoneIds':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.sectionsService.GetForDropDownZones({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listZones = [];
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
  onRemoveCommercialReg(event: any) {

    let indexFile = this.uploadedCommercialRegFiles.findIndex(item => item.fileUpload.lastModified === event.lastModified);
    this.uploadedCommercialRegFiles.splice(indexFile, 1)
    this.uploadedCommercialRegFiles.length === 0 ? this.requiredCommercialRegFiles = true : this.requiredCommercialRegFiles = false;
    // this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
  lastSearchQuery = "";


  onUploadCommercialReg(event: UploadEvent) {

    for (let file of event.files) {
      var reader = new FileReader();

      let thisParent = this;
      reader.readAsDataURL(file);
      reader.onload = (function (file) {
        return function (e: any) {

          // Render thumbnail.
          thisParent.uploadedCommercialRegFiles.push({ imageSrc: e.target.result, fileUpload: file });

        };

      })(file);



      // this.uploadedCommercialRegFiles.push({ imageSrc: src, fileUpload: file });


    }
    // this.uploadedCommercialRegFiles.length === 0 ? this.requiredCommercialRegFiles = true : this.requiredCommercialRegFiles = false;

    // this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
  request() {
    this.submitClicked.emit(this.addBranchGroupForm.value);

    if (this.addBranchGroupForm.valid) {
      this.submitted = false;
      this.submitClicked.emit(this.addBranchGroupForm.value);
      // this.dialogRef.close(true);
    } else {
      this.getControl("name")?.markAsDirty();
      this.getControl("parentId")?.markAsDirty();
      this.getControl("managerId")?.markAsDirty();
      this.getControl("managerDelegatorIds")?.markAsDirty();
      this.getControl("zoneIds")?.markAsDirty();

      
      this.getControl("notes")?.markAsDirty();


    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
