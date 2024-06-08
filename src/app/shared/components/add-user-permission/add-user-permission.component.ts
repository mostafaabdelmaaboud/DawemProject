import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription, combineLatest, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';

import { MatRadioModule } from '@angular/material/radio';
import { UserPermissionsService } from 'src/app/Presentation/user/user-permissions/services/user-permissions.service';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { NgxPaginationModule } from 'ngx-pagination';
import { PrimeNGConfig } from 'primeng/api';
import { MediaMatcher } from '@angular/cdk/layout';
import * as moment from 'moment';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastrService } from 'ngx-toastr';
import { AccordionModule } from 'primeng/accordion';

interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  titleClose: string;
  setAsActive: string;
  titleNotes: string,
  placeholdeNotes: string,
  ValidationNotes: string,
  Titlesaturday: string,

  labelRadioButton: string;
  firstRadio: string;
  secondRadio: string;
  thirdRadio: string;

  titleDepartmentId: string;
  placeholdeDepartmentId: string;
  ValidationDepartmentId: string;

  titleFieldDisabled: string;
  placeholdeieldDisabled: string;

  titleRoleId: string;
  placeholdeRoleId: string;
  ValidationRoleId: string;

  titleUserId: string;
  placeholdeUserId: string;
  ValidationUserId: string;

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
  selector: 'app-add-user-permission',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatRadioModule,
    TableModule,
    PaginatorModule,
    NgxPaginationModule,
    MultiSelectModule, MatProgressSpinnerModule, CheckboxModule, DropdownModule,AccordionModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-user-permission.component.html',
  styleUrls: ['./add-user-permission.component.scss']
})
export class AddUserPermissionComponent {
  loading = false;


  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  list: any[] = [
  ];
  @Input() editPermission!: boolean;
  @Input() id!: string;

  listRoleId: any[] = [
  ];
  listUserId: any[] = [
  ];
  permissions: any[] = [];

  defaultRowPerPage = { name: '5', code: 5 };

  private userPermissionsService = inject(UserPermissionsService);

  filteration: any = {
    PageSize: 40,
    PageNumber: 0,
    PagingEnabled: true
  };

  mobileQuery: MediaQueryList;
  subscription!: Subscription;
  isLoading = true;

  RoleToggle = true;
  userIdToggle = false;
  itemsPerPage = 5;
  page = 0;
  columns: any[] = [
    {
      name: "اسم الشاشة/اسم الصلاحية",
      field: "screenName",
    },
    {
      name: "اضافة",
      field: "0",
    },
    {
      name: "تعديل",
      field: "1"
    },
    {
      name: "حذف",
      field: "2"
    },
    {
      name: "المشاهدة",
      field: "3"
    },
    {
      name: "القبول",
      field: "4"
    },
    {
      name: "الرفض",
      field: "5"
    },
    {
      name: "التفعيل",
      field: "6"
    },
    {
      name: "التعطيل",
      field: "7"
    },
  ];
  RowsPerPage!: any[];
  first: number = 0;
  rows: number = 10;
  weekDays: any[] = [];
  addBranchGroupForm: FormGroup = this.fb.group({
    isActive: [true],
    fieldDisabled: [""],
    ForType: ['0', Validators.required],
    ResponsibilityId: ['', Validators.required],
  });
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  opened = false;
  totalItems: number = 0;
  permissionScreens = [];
  private _mobileQueryListener: () => void;
  constructor(public dialogRef: MatDialogRef<AddUserPermissionComponent>,
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,

    private fb: FormBuilder, private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, public translate: TranslateService, media: MediaMatcher) {
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

      this.dialogRef.disableClose = true;


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
    this.translate.get("userPermissions").subscribe(data => {
      this.columns = [
        {
          name: data.screenNamePermissionName,
          field: "name",
        },
        {
          name: data.addition,
          field: "0",
        },
        {
          name: data.edit,
          field: "1"
        },
        {
          name: data.delete,
          field: "2"
        },
        {
          name: data.watching,
          field: "3"
        },
        {
          name: data.admissions,
          field: "4"
        },
        {
          name: data.rejection,
          field: "5"
        },
        {
          name: data.activation,
          field: "6"
        },
        {
          name: data.disruption,
          field: "7"
        },
      ];
    })
    this.loading = true;
    
    let RoleDropdown = this.userPermissionsService.GetForDropDownRole({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });

    let usersForDropdown = this.userPermissionsService.usersForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });





    combineLatest({
      RoleDropdown,
      usersForDropdown
    }).subscribe(
      {
        next: data => {



          this.listRoleId = [];
          this.listUserId = [];


          data.RoleDropdown?.data?.forEach((day: any) => {
            this.listRoleId.push({ name: day.name, key: day.id });

          });
          data.usersForDropdown?.data?.forEach((day: any) => {
            this.listUserId.push({ name: day.name, key: day.id });

          });



          if (this.editPermission) {
            this.userPermissionsService.permissionGetById({ permissionId: this.id }).subscribe(
              {
                next: data => {


                  this.getControl("isActive")?.setValue(data.isActive);


                  this.getControl("ForType")?.setValue(data.forType.toString());
                  this.getControl("fieldDisabled")?.setValue(data.code);



                  if (data.responsibilityId != null) {
                    this.userPermissionsService.GetForDropDownRole({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.responsibilityId }).subscribe(dataDropdown => {
                      this.listRoleId = [];
                      dataDropdown.data?.forEach((list: any) => {
                        this.listRoleId.push({ name: list.name, key: list.id });
                      });
                      let indexRoleId = this.listRoleId.findIndex(list => list.key === data.responsibilityId);
                      if (indexRoleId >= 0) {
                        this.getControl("ResponsibilityId")?.setValue(this.listRoleId[indexRoleId]);

                      }

                    });
                  }
                  if (data.userId != null) {
                    this.userPermissionsService.usersForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.userId }).subscribe(dataDropdown => {
                      this.listUserId = [];
                      dataDropdown.data?.forEach((list: any) => {
                        this.listUserId.push({ name: list.name, key: list.id });
                      });
                      let indexUserId = this.listUserId.findIndex(list => list.key === data.userId);
                      if (indexUserId >= 0) {
                        this.getControl("UserId")?.setValue(this.listUserId[indexUserId]);

                      }

                    });
                  }
                  this.permissionScreens = data?.screens;
                  this.getPermissions(this.filteration, this.permissionScreens);

                },
                error: err => {
                  this.loading = false;
                }
              }
            )

          }
          if (!this.editPermission) {
            this.getPermissions(this.filteration, this.permissionScreens);


          }

        },
        error: err => {
          this.loading = false;

        }
      }
    )
    this.addBranchGroupForm.get("ForType")?.valueChanges.subscribe(data => {

      if (data === "0") {
        this.addBranchGroupForm.removeControl("UserId");

        this.addBranchGroupForm.addControl("ResponsibilityId", this.fb.control("", [Validators.required]));
        this.RoleToggle = true;
        this.userIdToggle = false;





      } else if (data === "1") {

        this.addBranchGroupForm.removeControl("ResponsibilityId");

        this.addBranchGroupForm.addControl("UserId", this.fb.control("", [Validators.required]));

        this.RoleToggle = false;
        this.userIdToggle = true;

      }


    })



    this.RowsPerPage = [
      { name: '2', code: 2 },
      { name: '5', code: 5 }

    ];

  }
  dropdownChangedUserId(userId: any) {

    this.userPermissionsService.checkAndGetPermission({ UserId: userId.value.key }).subscribe({
      next: role => {
        
        this.translate.get("userPermissions").subscribe(translate => {
          this.data!['titleClose'] = translate.toRetreat;
          this.data!['title'] = translate.modifyPermission;
          this.data!['buttonSend'] = translate.modifyPermission;
        });

        this.editPermission = true;
        this.id = role.id
        this.getControl("isActive")?.setValue(role.isActive);
        this.getControl("ForType")?.setValue(role.forType.toString());
        this.getControl("fieldDisabled")?.setValue(role.code);
        if (role.roleId != null) {
          this.userPermissionsService.GetForDropDownRole({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: role.roleId }).subscribe(dataDropdown => {
            this.listRoleId = [];
            dataDropdown.data?.forEach((list: any) => {
              this.listRoleId.push({ name: list.name, key: list.id });
            });
            let indexRoleId = this.listRoleId.findIndex(list => list.key === role.roleId);
            if (indexRoleId >= 0) {
              this.getControl("ResponsibilityId")?.setValue(this.listRoleId[indexRoleId]);

            }

          });
        }
        if (role.userId != null) {
          this.userPermissionsService.usersForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: role.userId }).subscribe(dataDropdown => {
            this.listUserId = [];
            dataDropdown.data?.forEach((list: any) => {
              this.listUserId.push({ name: list.name, key: list.id });
            });
            let indexUserId = this.listUserId.findIndex(list => list.key === role.userId);
            if (indexUserId >= 0) {
              this.getControl("UserId")?.setValue(this.listUserId[indexUserId]);

            }

          });
        }
        
        this.permissionScreens = role?.permissionScreens;
        this.getPermissions(this.filteration, this.permissionScreens);
        this.translate.get("userPermissions").subscribe(translate => {
          this.toast.success(translate.unifiesPreviousUserPermissions);
        });

      },
      error: err => {
        this.translate.get("userPermissions").subscribe(translate => {
          this.data!['buttonSend'] = translate.addPermission;
          this.data!['title'] = translate.addPermission;
        });
        
        this.toast.error(err.error.message);

        this.editPermission = false;
        this.permissionScreens = [];
        this.getPermissions(this.filteration, this.permissionScreens);

      }
    })
  }
  dropdownChangedRoleId(RoleId: any) {

    this.userPermissionsService.checkAndGetPermission({ ResponsibilityId: RoleId.value.key }).subscribe({
      next: role => {
        this.translate.get("userPermissions").subscribe(translate => {
          this.data!['titleClose'] = translate.toRetreat;
          this.data!['title'] = translate.modifyPermission;
          this.data!['buttonSend'] = translate.modifyPermission;
        });
  

        this.editPermission = true;
        this.id = role.id
        this.getControl("isActive")?.setValue(role.isActive);
        this.getControl("ForType")?.setValue(role.forType.toString());
        this.getControl("fieldDisabled")?.setValue(role.code);
        if (role.responsibilityId != null) {
          this.userPermissionsService.GetForDropDownRole({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: role.responsibilityId }).subscribe(dataDropdown => {
            this.listRoleId = [];
            dataDropdown.data?.forEach((list: any) => {
              this.listRoleId.push({ name: list.name, key: list.id });
            });
            let indexRoleId = this.listRoleId.findIndex(list => list.key === role.responsibilityId);
            if (indexRoleId >= 0) {
              this.getControl("RoleId")?.setValue(this.listRoleId[indexRoleId]);

            }

          });
        }
        if (role.userId != null) {
          this.userPermissionsService.usersForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: role.userId }).subscribe(dataDropdown => {
            this.listUserId = [];
            dataDropdown.data?.forEach((list: any) => {
              this.listUserId.push({ name: list.name, key: list.id });
            });
            let indexUserId = this.listUserId.findIndex(list => list.key === role.userId);
            if (indexUserId >= 0) {
              this.getControl("UserId")?.setValue(this.listUserId[indexUserId]);

            }

          });
        }
        this.translate.get("userPermissions").subscribe(translate => {
          this.toast.success(translate.thereArePreExistingPowersForThePosition);
        });

        this.permissionScreens = role?.permissionScreens;
        this.getPermissions(this.filteration, this.permissionScreens);

      },
      error: err => {
        this.translate.get("userPermissions").subscribe(translate => {
          this.data!['buttonSend'] = translate.addPermission;
          this.data!['title'] = translate.addPermission;
        });
        

        this.toast.error(err.error.message);

        this.editPermission = false;
        this.permissionScreens = [];
        this.getPermissions(this.filteration, this.permissionScreens);
      }
    })
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getPermissions(this.filteration, this.permissionScreens)
  }

  nodeSelect(data: any) {
  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getPermissions(this.filteration, this.permissionScreens)
  }
  lastSearchQuery = "";
  searchNodes(nodes: any[]): any[] {
    let result: any[] = [];
  
    function recursiveSearch(node: any,parentIndex, i, status) {
      if (node?.groupOrScreenType === 0 && node?.children?.length) {
        node.children.forEach((child:any, childIndex:number) => {
          node.children[childIndex] = child;
          recursiveSearch(child, parentIndex, childIndex, "child");
        });
      } else if (node.groupOrScreenType === 1) {
        if(status === "child") {
          node.changes = {
            "0": {
              readoOnly: node.availableActions.includes(0) ? false : true,
              checkbox: false
            },
            "1": {
              readoOnly: node.availableActions.includes(1) ? false : true,
              checkbox: false
            },
            "2": {
              readoOnly: node.availableActions.includes(2) ? false : true,
              checkbox: false
            },
            "3": {
              readoOnly: node.availableActions.length > 0 ? false : true,
              checkbox: false
            },
            "4": {
              readoOnly: node.availableActions.includes(4) ? false : true,
              checkbox: false
            },
            "5": {
              readoOnly: node.availableActions.includes(5) ? false : true,
              checkbox: false
            },
            "6": {
              readoOnly: node.availableActions.includes(6) ? false : true,
              checkbox: false
            },
            "7": {
              readoOnly: node.availableActions.includes(7) ? false : true,
              checkbox: false
            }
          }
          // node = 
        } else {
          node.changes = {
            "0": {
              readoOnly: node.availableActions.includes(0) ? false : true,
              checkbox: false
            },
            "1": {
              readoOnly: node.availableActions.includes(1) ? false : true,
              checkbox: false
            },
            "2": {
              readoOnly: node.availableActions.includes(2) ? false : true,
              checkbox: false
            },
            "3": {
              readoOnly: node.availableActions.length > 0 ? false : true,
              checkbox: false
            },
            "4": {
              readoOnly: node.availableActions.includes(4) ? false : true,
              checkbox: false
            },
            "5": {
              readoOnly: node.availableActions.includes(5) ? false : true,
              checkbox: false
            },
            "6": {
              readoOnly: node.availableActions.includes(6) ? false : true,
              checkbox: false
            },
            "7": {
              readoOnly: node.availableActions.includes(7) ? false : true,
              checkbox: false
            }
          }
        
        }
   
        // result.push({
         
        // });
      }
    }
  
    nodes.forEach((node, i:number) => {
      recursiveSearch(node, i, null, "parent");
    });

    return nodes;
  }
  searchChildren(nodes:any[]) {
    let result: any[] = [];
  
    function recursiveSearch(node: any,parentIndex) {
      if (node?.groupOrScreenType === 0 && node?.children?.length) {
        node.children.forEach((child:any) => {
          recursiveSearch(child, parentIndex);
        });
      } else if (node.groupOrScreenType === 1) {
        result.push(node);
   
        // result.push({
         
        // });
      }
    }
  
    nodes.forEach((node, i:number) => {
      recursiveSearch(node, i);
    });

    return result;
  }
  searchByActionId(nodes:any[], actions) {
    function recursiveSearch(node: any,parentIndex) {
      if (node?.groupOrScreenType === 0 && node?.children?.length) {
        node.children.forEach((child:any) => {
          recursiveSearch(child, parentIndex);
        });
      } else if (node.groupOrScreenType === 1) {
        let findIndexActions = actions.findIndex(action => action.id === node.id);
        if(findIndexActions >= 0) {
          actions[findIndexActions].actions.forEach(actionInside => {
            node.changes[actionInside].checkbox = true
          });
        }
      }
    }
  
    nodes.forEach((node, i:number) => {
      recursiveSearch(node, i);
    });
  }
  getPermissions(filteration: any, permissionScreens: any) {
    this.permissions = [];
    this.isLoading = true;

    this.userPermissionsService.getAllScreensWithAvailableActions(filteration).subscribe({
      next: data => {

        data.data.menuItemsTypes.forEach((screen: any, i:number) => {

          let formatObject = this.searchNodes(screen.menuItems);
          console.log(formatObject)
          this.permissions.push({...screen, menuItems: formatObject});
          
        });

        this.totalItems = data.totalCount

        if (this.editPermission) {
          if (permissionScreens.length > 0) {
            
            this.permissions.forEach(permission => {
              this.searchByActionId(permission.menuItems, permissionScreens)
            })
            // permissionScreens.forEach((permission: any) => {
            
            //   let indexPermission = this.permissions.findIndex((per: any) => per.screenId == permission.screenId);
            //   if (indexPermission >= 0) {
            //     permission.actions.forEach((action: any) => {
            //       this.permissions[indexPermission][action.ScreenId.toString()].checkbox = true;
            //       this.permissions[indexPermission][action.ScreenId.toString()].readoOnly = false;

            //     });

            //   }
            // });
          }
          this.isLoading = false;
          this.loading = false;
        } else {
          this.isLoading = false;
          this.loading = false;
        }

      },
      error: err => {
        this.isLoading = false;
        this.loading = false;
      }
    }
    )
  }
  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'RoleId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.userPermissionsService.GetForDropDownRole({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listRoleId = [];
                this.lastSearchQuery = "";

                res.data?.forEach((day: any) => {


                  this.listRoleId.push({ name: day.name, key: day.id });

                });


              });
          }

        }
        break;

      case 'UserId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.userPermissionsService.usersForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listUserId = [];
                this.lastSearchQuery = "";
                res.data?.forEach((day: any) => {
                  this.listUserId.push({ name: day.name, key: day.id });
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
    let formatObject: any = {};
    let childrenOnly:any[] = [];
    this.permissions.forEach(item => {
      let child:any = this.searchChildren(item.menuItems);
      childrenOnly.push(...child)
    });


    let filterPermission = childrenOnly.filter((permission: any) => {
      let changeCechbox = false;
 
          for (let perInsie in permission.changes) {

            if (permission.changes[perInsie].readoOnly === false && permission.changes[perInsie].checkbox === true) {

              changeCechbox = true
            }
          }
     
      return changeCechbox;


    });
    formatObject.Screens = filterPermission.map((permission: any, i:number) => {
      let filterObject: any = {};
      for (let perInsie in permission.changes) {

        if (permission.changes[perInsie].readoOnly === false && permission.changes[perInsie].checkbox === true) {
          filterObject[perInsie] = permission;
        }
      }
      let arrayChange: any = Object.keys(filterObject);
      arrayChange = arrayChange.map((changeCheck: any) => {
        return  Number(changeCheck)
      })
      return { ScreenId: permission.id, Actions: arrayChange };
    });
    //  && this.submitted
    console.log(formatObject);
    if (this.addBranchGroupForm.valid && this.submitted && formatObject.Screens.length > 0) {
      this.submitted = false;
      formatObject.ForType = Number(this.addBranchGroupForm.value.ForType);
      formatObject.ResponsibilityId = formatObject.ForType === 0 ? this.addBranchGroupForm.value.ResponsibilityId.key : null;
      formatObject.UserId = formatObject.ForType === 1 ? this.addBranchGroupForm.value.UserId.key : null;
      formatObject.IsActive = this.addBranchGroupForm.get("isActive")?.value;
      this.submitClicked.emit(formatObject);
    } else {
      this.getControl("UserId")?.markAsDirty();
      this.getControl("ResponsibilityId")?.markAsDirty();
      if (formatObject.Screens.length == 0) {
        this.translate.get("userPermissions").subscribe(translate => {
          this.toast.error(translate.pleaseSelectApermissionPeriod);
        });
      }
    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
