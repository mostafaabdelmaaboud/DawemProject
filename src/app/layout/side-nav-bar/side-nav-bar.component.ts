import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PermissionsService } from 'src/app/Presentation/user/services/permission.service';
import { TranslateService } from '@ngx-translate/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from 'src/app/shared/components/logout/logout.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import { DashboardService } from 'src/app/Presentation/user/dashboard/services/dashboard.service';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent {
  items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);
  currentLang = localStorage.getItem("lang");
  Newlang: string = '';
  opened = true;
  position = "start"
  mobileQuery: MediaQueryList;
  localization: boolean = true;
  today: number = Date.now();
  numNotification: null | string = "";
  notificationCount = 0;
  usersMe!: any;
  isAdmin = true;
  private dialog = inject(MatDialog);
  private _mobileQueryListener: () => void;
  listComponents:any[] = []
  // private dialog = inject(MatDialog);
  public permissionsService = inject(PermissionsService);
  public dashboardService = inject(DashboardService);
  profile:any = {}
  
  constructor(private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public translateService: TranslateService,
    public authService: AuthService,
    private permissionsUserService: PermissionsUserService) {
    this.mobileQuery = media.matchMedia('(max-width: 1050px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = false;

        changeDetectorRef.detectChanges();
      } else {
        this.opened = true;
      }



    };
    this.mobileQuery.addListener(this._mobileQueryListener);
    setInterval(() => { this.today = Date.now() }, 1);

  }
  getPermissions(): any {
    const permissionsString = localStorage.getItem('permissions') as string;

    try {
      // حاول تحويل القيمة إلى كائن JSON
      return JSON.parse(permissionsString);
    } catch (error) {
      // إذا كان هناك أي خطأ، فقط أرجع القيمة النصية
      return permissionsString;
    }
  }
  showComponent(data: any) {
    return this.permissionsUserService.checkPermission({ type: "component", screenCode: data.screenCode })
  }
  componentName(data: any): string {
    let findIndexPermission = (this.getPermissions()?.availablePermissions as any[]).findIndex(permission => permission.screenCode === data.screenCode);
    return this.getPermissions()?.availablePermissions[findIndexPermission]?.screenName

  }
  numberNotification() {
    this.numNotification = "";
  }

  ngOnInit(): void {
    let permission = JSON.parse(localStorage.getItem('permissions') as string)
    this.isAdmin = permission?.isAdmin;

    if (!this.getPermissions()) {
      this.authService.logout();
    }
    if (this.mobileQuery.matches) {
      this.opened = false;
    } else {
      this.opened = true;

    }
    let usersMe: any = JSON.parse(localStorage.getItem("usersMe") as string);
    if (usersMe) {
      this.usersMe = usersMe;
    }
    if (this.currentLang === undefined || this.currentLang === null) {
      document.documentElement.setAttribute('lang', 'ar');

    } else {
      if (this.currentLang == "ar") {
        document.documentElement.setAttribute('lang', 'ar');
        this.localization = false;
      }
      else {
        document.documentElement.setAttribute('lang', 'en');
        this.localization = true;
      }
    }
    if(!this.isAdmin) {
      this.listComponents = [
        {
          name: this.componentName({screenCode:1}),
          routerLink:'/user/dashboard',
          showComponent: this.showComponent({screenCode:1})
        },
        {
          name: this.componentName({screenCode:22}),
          routerLink:'/user/requests',
          showComponent: this.showComponent({screenCode:22})
        },
        {
          name: this.componentName({screenCode:3}),
          routerLink:'/user/employees',
          showComponent: this.showComponent({screenCode:3})
        },
        {
          name: this.componentName({screenCode:4}),
          routerLink:'/user/employment',
          showComponent: this.showComponent({screenCode:4})
        },
        {
          name: this.componentName({screenCode:24}),
          routerLink:'/user/justifications',
          showComponent: this.showComponent({screenCode:24})
        },
        {
          name: this.componentName({screenCode:37}),
          routerLink:'/user/zones',
          showComponent: this.showComponent({screenCode:37})
        },
        {
          name: this.componentName({screenCode:27}),
          routerLink:'/user/vacations',
          showComponent: this.showComponent({screenCode:27})
        },
        {
          name: this.componentName({screenCode:34}),
          routerLink:'/user/users',
          showComponent: this.showComponent({screenCode:34})
        },
        {
          name: this.componentName({screenCode:35}),
          routerLink:'/user/vacationBalance',
          showComponent: this.showComponent({screenCode:35})
        },
        {
          name: this.componentName({screenCode:31}),
          routerLink:'/user/scheduleLogs',
          showComponent: this.showComponent({screenCode:31})
        },
        {
          name: this.componentName({screenCode:25}),
          routerLink:'/user/permissions',
          showComponent: this.showComponent({screenCode:25})
        },
        {
          name: this.componentName({screenCode:19}),
          routerLink:'/user/userPermissions',
          showComponent: this.showComponent({screenCode:19})
        },
        {
          name: this.componentName({screenCode:26}),
          routerLink:'/user/tasks',
          showComponent: this.showComponent({screenCode:26})
        },
        {
          name: this.componentName({screenCode:15}),
          routerLink:'/user/holidays',
          showComponent: this.showComponent({screenCode:15})
        },
        {
          name: this.componentName({screenCode:23}),
          routerLink:'/user/assignments',
          showComponent: this.showComponent({screenCode:23})
        },
        {
          name: this.componentName({screenCode:30}),
          routerLink:'/user/schedualPlan',
          showComponent: this.showComponent({screenCode:30})
        },
        {
          name: this.componentName({screenCode:29}),
          routerLink:'/user/tables',
          showComponent: this.showComponent({screenCode:29})
        },
        {
          name: this.componentName({screenCode:32}),
          routerLink:'/user/shifts',
          showComponent: this.showComponent({screenCode:32})
        },
        {
          name: this.componentName({screenCode:2}),
          routerLink:'/user/sections',
          showComponent: this.showComponent({screenCode:2})
        },
        {
          name: this.componentName({screenCode:14}),
          routerLink:'/user/groups',
          showComponent: this.showComponent({screenCode:14})
        },
        {
          name: this.componentName({screenCode:17}),
          routerLink:'/user/jobTitles',
          showComponent: this.showComponent({screenCode:17})
        },
        {
          name: this.componentName({screenCode:13}),
          routerLink:'/user/fingerPrintDevice',
          showComponent: this.showComponent({screenCode:13})
        },
        {
          name: this.componentName({screenCode:0}),
          routerLink:'/user/assignmentType',
          showComponent: this.showComponent({screenCode:0})
        },
        {
          name: this.componentName({screenCode:18}),
          routerLink:'/user/justificationsType',
          showComponent: this.showComponent({screenCode:18})
        },
        {
          name: this.componentName({screenCode:36}),
          routerLink:'/user/vacationType',
          showComponent: this.showComponent({screenCode:36})
        },
        {
          name: this.componentName({screenCode:21}),
          routerLink:'/user/permissionType',
          showComponent: this.showComponent({screenCode:21})
        },
        {
          name: this.componentName({screenCode:33}),
          routerLink:'/user/taskType',
          showComponent: this.showComponent({screenCode:33})
        },
        {
          name: this.componentName({screenCode:33}),
          routerLink:'/user/summons',
          showComponent: this.showComponent({screenCode:33})
        },
        {
          name: this.componentName({screenCode:33}),
          routerLink:'/user/sanctions',
          showComponent: this.showComponent({screenCode:33})
        }
      ]
      this.cloneArrayComponents = [...this.listComponents];
    } else {
      this.listComponents = [
        {
          name: 'لوحة التحكم',
          routerLink:'/user/dashboard',
          showComponent: true
        },
        {
          name: 'الطلبات',
          routerLink:'/user/requests',
          showComponent: true
        },
        {
          name: 'الموظفين',
          routerLink:'/user/employees',
          showComponent: true
        },
        {
          name: 'الحضور والانصراف',
          routerLink:'/user/employment',
          showComponent: true
        },
        {
          name: 'طلبات التبريرات',
          routerLink:'/user/justifications',
          showComponent: true
        },
        {
          name: 'المناطق',
          routerLink:'/user/zones',
          showComponent: true
        },
        {
          name: 'طلبات الأجازات',
          routerLink:'/user/vacations',
          showComponent: true
        },
        {
          name: 'المستخدمين',
          routerLink:'/user/users',
          showComponent: true
        },
        {
          name: 'أرصدة الأجازات',
          routerLink:'/user/vacationBalance',
          showComponent: true
        },
        {
          name: 'سجلات خطط الجدولة',
          routerLink:'/user/scheduleLogs',
          showComponent: true
        },
        {
          name: 'طلبات الأزونات',
          routerLink:'/user/permissions',
          showComponent: true
        },
        {
          name: 'الصلاحيات',
          routerLink:'/user/userPermissions',
          showComponent: true
        },
        {
          name: 'طلبات المهمات',
          routerLink:'/user/tasks',
          showComponent: true
        },
        {
          name: 'العطلات الرسمية',
          routerLink:'/user/holidays',
          showComponent: true
        },
        {
          name: 'طلبات التكليفات',
          routerLink:'/user/assignments',
          showComponent: true
        },
        {
          name: 'خطط الجدولة',
          routerLink:'/user/schedualPlan',
          showComponent: true
        },
        {
          name: 'الجدولة',
          routerLink:'/user/tables',
          showComponent: true
        },
        {
          name: 'الورديات',
          routerLink:'/user/shifts',
          showComponent: true
        },
        {
          name: 'الأقسام',
          routerLink:'/user/sections',
          showComponent: true
        },
        {
          name: 'المجموعات',
          routerLink:'/user/groups',
          showComponent: true
        },
        {
          name: 'المسميات الوظيفية',
          routerLink:'/user/jobTitles',
          showComponent: true
        },
        {
          name: "أجهزة البصمة",
          routerLink:'/user/fingerPrintDevice',
          showComponent: true
        },
      
        {
          name: 'أنواع التكليفات',
          routerLink:'/user/assignmentType',
          showComponent: true
        },
        {
          name: 'أنواع التبريرات',
          routerLink:'/user/justificationsType',
          showComponent: true
        },
        {
          name: 'أنواع الأجازات',
          routerLink:'/user/vacationType',
          showComponent: true
        },
        {
          name: 'أنواع الأذونات',
          routerLink:'/user/permissionType',
          showComponent: true
        },
        {
          name: 'أنواع المهمات',
          routerLink:'/user/taskType',
          showComponent: true
        },
          {
          name: "الاستدعاءات",
          routerLink:'/user/summons',
          showComponent: true
        },
        {
          name: "الجزاءات",
          routerLink:'/user/sanctions',
          showComponent: true
        }
      ]
      this.cloneArrayComponents = [...this.listComponents];

    }
    this.dashboardService.getInformationProfile().subscribe(data => {
      this.profile = data;
    })
  }
  searchInput = "";
  showListSearch = false;
  cloneArrayComponents:any = [];
  search() {
    
    this.listComponents = [...this.cloneArrayComponents];
    if(typeof this.searchInput === "string") {
      if(this.searchInput.trim() === "") {
        this.showListSearch = false;

      } else {
        const selectedItem = this.listComponents.find(item => item.name.includes(this.searchInput));

        if (selectedItem) {
          let filterComponents =this.listComponents.filter(component => component.name.includes(this.searchInput.trim()));
          
          this.listComponents = filterComponents;
          console.log(filterComponents);
          this.showListSearch = true;
    
        } else {
          this.showListSearch = false;
    
        }
      }
   
    }
 
  }

  SelectedLang(event: any) {
    this.Newlang = event.target.value;
    this.translateService.use(this.Newlang);
    localStorage.setItem('lang', this.Newlang);
    if (this.Newlang == "ar") {
      document.documentElement.setAttribute('lang', 'ar');
      this.localization = false;
    }
    else {
      document.documentElement.setAttribute('lang', 'en');
      this.localization = true;
    }
  }
  changePassword(): void {
    // const dialogRef = this.dialog.open(DialogChangePasswordComponent, {
    //   width: "30vw",
    //   data: null,
    // });
  }

  logout() {

    const logoutDialog = this.dialog.open(LogoutComponent, {
      width: "30vw",
      data: {
        title: "متأكد من تسجيل الخروج؟",
        titleClose: "تراجع",
        buttonSend: "تاكيد"
      },
    });
    logoutDialog.componentInstance.submitted = true;
    logoutDialog.componentInstance.submitClicked.subscribe(result => {
      this.authService.logout();
      logoutDialog.close();

    })
  }
}
