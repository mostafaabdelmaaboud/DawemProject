import { ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogCloseComponent } from 'src/app/shared/components/dialog-close/dialog-close.component';
import { AddGroupComponent } from 'src/app/shared/components/add-group/add-group.component';
import { ToastrService } from 'ngx-toastr';
import { GroupsService } from './services/groups.service';
import { DialogGroupFileComponent } from 'src/app/shared/components/dialog-group-file/dialog-group-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent {
  @ViewChild('lastTh', { static: false }) lastTh!: ElementRef;

  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  private groupsService = inject(GroupsService);


  columns: any[] = [
    {
      name: "كود المجموعة",
      field: "groupNumber",
    },
    {
      name: "اسم المجموعة",
      field: "groupName",
    },
    {
      name: "مدير المجموعة",
      field: "groupStaff"
    },
    {
      name: "عدد الموظفين بالمجموعة",
      field: "numberOfEmployeesInTheGroup"
    },

    {
      name: "الإجراء",
      field: "actions"
    }

  ];
  groups: any = [];
  groupsIsExport: any = [];
  isLoading = true;

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
  rows: number = 10;
  RowsPerPage!: any[];
  mobileQuery: MediaQueryList;
  opened = false;
  cards!: any;
  spinnerCards = false;
  private _mobileQueryListener: () => void;
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.groups = this.groups;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.groups = this.groups;

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
    this.filterForm = this.fb.group({
      FreeText: [""],
      code: [""],

    });
    this.categories.push({ name: "adasd", key: "adsas" });
    this.RowsPerPage = [
      { name: '5', code: 5 },
      { name: '10', code: 10 },
      { name: '25', code: 25 },

    ];
    this.getInformation();

    this.getGroups(this.filteration);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  filter() {
    let filteration = { ...this.filteration }
    Object.entries(this.filterForm?.value).forEach(([key, value]: any) => {
      if (typeof value  === 'string') {
        if(value != "") {
          filteration[key] = value.trim();
        }
      } else {
        if(value >=0) {
          filteration[key] = value;

        }

      }
    })
    this.getGroups(filteration);
  }
  exportTableToExcel() {
    let columns = [...this.columns];
    delete columns[4]
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'المجموعات',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };

    if(!this.isLoading) {
      this.isLoading = true;
      this.groupsIsExport = [];
      let filteration = {...this.filteration, isExport:true};

      this.groupsService.listGroups(filteration).subscribe(data => {

        data.data.forEach((group: any) => {
          this.groupsIsExport.push({
            id: group.id,
            groupNumber: group.code,
            groupName: group.name,
            isActive: group.isActive,
            groupStaff: {
              name: group.manager ? group.manager.managerName : "لا يوجد",
              alt: group.manager ? group.manager.managerName : "",
              img: group.manager ? group.manager.profileImagePath : "../../../../assets/img/5034901-200.png"
            },
            numberOfEmployeesInTheGroup: group.numberOfEmployees
  
  
          })
        });
        let formatTable = this.groupsIsExport.map(group => {
      
          return {
            groupNumber: group.groupNumber,
            groupName: group.groupName,
            groupStaff: group.groupStaff.name,
            numberOfEmployeesInTheGroup: group.numberOfEmployeesInTheGroup
          }
        })
        this.isLoading = false;
        new ngxCsv(formatTable, "sheet", options);
  
      })
    }  }
  exportTableToPDF() {

    if(!this.isLoading) {
      this.isLoading = true;
      let table: any = document.getElementById("tableGroupHidden");
      html2canvas(table,{
        scale: 5,
        width: table.offsetWidth,
        height: table.offsetHeight, 
    }).then((canvas) => {
      let fileWidth = 190;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, fileWidth, fileHeight); 
        pdf.save('ملف_PDF.pdf');
        this.isLoading = false;

      });

    }

  }
  resetFilteration() {
    this.filterForm.get("FreeText")?.setValue("");
    this.filterForm.get("code")?.setValue("");

    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getGroups(this.filteration);
  }
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 14, actionCode: data.actionCode })
  }
  getInformation() {
    this.spinnerCards = true;
    this.groupsService.getInformation().subscribe({
      next: data => {
        this.cards = {
          ...data
        };
        this.spinnerCards = false;

      },
      error: err => {
        this.spinnerCards = false;

      }
    })
  }
  getGroups(filteration: any) {
    this.groups = [];
    this.isLoading = true;

    this.groupsService.listGroups(filteration).subscribe(data => {

      data.data.forEach((group: any) => {
        this.groups.push({
          id: group.id,
          groupNumber: group.code,
          groupName: group.name,
          isActive: group.isActive,
          groupStaff: {
            name: group.manager ? group.manager.managerName : "لا يوجد",
            alt: group.manager ? group.manager.managerName : "",
            img: group.manager ? group.manager.profileImagePath : "../../../../assets/img/5034901-200.png"
          },
          numberOfEmployeesInTheGroup: group.numberOfEmployees


        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;

    })
  }
  addgroup() {
    const dialogRefAddCurrency = this.dialog.open(AddGroupComponent, {
      width: "70vw",
      data: {
        title: "اضافه مجموعة",
        setAsActive: "تعيين كنشط",

        groupEmployees: "موظفي المجموعة",
        placeholdeGroupEmployees: "موظفي المجموعة",
        ValidationGroupEmployees: "موظفي المجموعة مطلوب",

        groupManager: "مدير المجموعة",
        placeholdeGroupManager: "مدير المجموعة",
        ValidationGroupManager: "مدير المجموعة مطلوب",
        titleZone: "المناطق <span class='color-red'>*</span>",
        placeholderZone: "المناطق",
        validationtitleZone: "المناطق مطلوبه",

        deputyDirector: "نواب المدير",
        placeholdeDeputyDirector: "نواب المدير",
        ValidationDeputyDirector: "نواب المدير مطلوب",

        titleGroupName: "اسم المجموعة <span class='color-red'>*</span>",
        placeholdeGroupName: "اسم المجموعة",
        ValidationGroupName: "اسم المجموعة مطلوب",
        titleClose: "تراجع",
        buttonSend: "إضافة المجموعة"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editGroups = false;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};

      formData.name = result.groupName;
      formData.managerDelegatorIds = [];
      formData.employeeIds = [];
      formData.zoneIds = [];

      result?.deputyDirector?.forEach((direct: any) => {
        formData.managerDelegatorIds.push(direct.key);
      });
      result?.groupEmployees?.forEach((direct: any) => {
        formData.employeeIds.push(direct.key);
      });
      if (result?.zoneIds?.length > 0) {
        result?.zoneIds?.forEach((direct: any) => {
          formData.zoneIds.push(direct.key);
        });
      }
      formData.managerId = result.groupManager.key;
      formData.isActive = result.isActive;

      this.groupsService.createGroup(formData).subscribe(
        {
          next: data => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات المجموعات"
              },
            });
            this.getGroups(this.filteration);
            setTimeout(() => {
              succressDialog.close();

            }, 2000);

            succressDialog.componentInstance.submitted = true;
            succressDialog.componentInstance.submitClicked.subscribe(result => {
              succressDialog.close();

            })

          },
          error: err => {
            dialogRefAddCurrency.componentInstance.submitted = true;

          }
        }
      )
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  dialogGroupFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogGroupFileComponent, {
      width: "40vw",
      data: {
        title: "ملف المجموعة"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id
  }
  enabledRow(data: any) {

    this.groupsService.enabledEmployee({ groupId: data.id }).subscribe(
      {
        next: res => {

          this.toast.success(res.message);
          this.getGroups(this.filteration);
        },
        error: err => {

        }
      }
    )
  }
  editgroup(data: any) {
    const dialogRefAddCurrency = this.dialog.open(AddGroupComponent, {
      width: "70vw",
      data: {
        title: "تعديل المجموعة",
        setAsActive: "تعيين كنشط",
        titleFieldDisabled: "كود المجموعة",
        placeholdeieldDisabled: "كود المجموعة",
        groupEmployees: "موظفي المجموعة",
        placeholdeGroupEmployees: "موظفي المجموعة",
        ValidationGroupEmployees: "موظفي المجموعة مطلوب",
        groupManager: "مدير المجموعة",
        placeholdeGroupManager: "مدير المجموعة",
        ValidationGroupManager: "مدير المجموعة مطلوب",
        titleZone: "المناطق <span class='color-red'>*</span>",
        placeholderZone: "المناطق",
        validationtitleZone: "المناطق مطلوبه",
        deputyDirector: "نواب المدير",
        placeholdeDeputyDirector: "نواب المدير",
        ValidationDeputyDirector: "نواب المدير مطلوب",
        titleGroupName: "اسم المجموعة <span class='color-red'>*</span>",
        placeholdeGroupName: "اسم المجموعة",
        ValidationGroupName: "اسم المجموعة مطلوب",
        titleClose: "تراجع",
        buttonSend: "حفظ المجموعة"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editGroups = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    // dialogRefAddCurrency.componentInstance.list = this.categories;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {
      let formData: any = {};

      formData.id = data.id;
      formData.name = result.groupName;
      formData.managerDelegatorIds = [];
      formData.employeeIds = [];
      formData.zoneIds = [];

      result?.deputyDirector?.forEach((direct: any) => {
        formData.managerDelegatorIds.push(direct.key);
      });
      result?.groupEmployees?.forEach((direct: any) => {
        formData.employeeIds.push(direct.key);
      });
      if (result?.zoneIds?.length > 0) {
        result?.zoneIds?.forEach((direct: any) => {
          formData.zoneIds.push(direct.key);
        });
      }

      formData.managerId = result.groupManager.key;
      formData.isActive = result.isActive;
      this.groupsService.updateGroup(formData).subscribe(
        {
          next: data => {


            dialogRefAddCurrency.componentInstance.submitted = true;
            dialogRefAddCurrency.close();
            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات المجموعات"
              },
            });
            this.getGroups(this.filteration);
            setTimeout(() => {
              succressDialog.close();

            }, 2000);

            succressDialog.componentInstance.submitted = true;
            succressDialog.componentInstance.submitClicked.subscribe(result => {
              succressDialog.close();

            })

          },
          error: err => {
            dialogRefAddCurrency.componentInstance.submitted = true;

          }
        }
      )
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getGroups(this.filteration)
  }


  deleteRow(data: any) {

    const reasonOfRefuseDialog = this.dialog.open(DialogCloseComponent, {
      width: "30vw",
      data: {
        title: "متأكد من تعليق المجموعة؟",
        message: "برجاء توضيح السبب إن أمكن ليظهر للمجموعة عند محاولة تسجيل الدخول",
        titleReasonOfRefuse: "سبب التعليق",
        placeholdeReasonOfRefuse: "برجاء كتابة سبب الرفض ليظهر للمجموعة",
        titleClose: "تراجع",
        buttonSend: "تعليق المجموعة"
      },
    });
    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      this.groupsService.disabledGroup({ Id: data.id, DisableReason: result.notes }).subscribe(
        {
          next: res => {

            this.toast.success(res.message);
            reasonOfRefuseDialog.componentInstance.submitted = true;
            this.getGroups(this.filteration);
            reasonOfRefuseDialog.close();
          },
          error: err => {
            reasonOfRefuseDialog.componentInstance.submitted = true;

          }
        }
      )


    })










  }
  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getGroups(this.filteration)
  }
  minimumValidator(conInput: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      let checkMin = true;
      if (value != null) {

        if (this.filterForm.get(conInput)?.dirty && !this.filterForm.get(conInput)?.hasError('required')) {
          if (value > this.filterForm.get(conInput)?.value) {
            checkMin = false;
          }
        }
      }
      // const hasNumber = /\d/.test(value);
      return checkMin ? null : { numberIsBig: true };

    };
  }
  maximumValidator(conInput: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      let checkMin = true;

      if (value != null) {
        if (this.filterForm.get(conInput)?.dirty && !this.filterForm.get(conInput)?.hasError('required')) {
          if (value < this.filterForm.get(conInput)?.value) {
            checkMin = false;
          }
        }
      }
      // const hasNumber = /\d/.test(value);
      return checkMin ? null : { numberIsLess: true };
    };
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
