import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { PermissionsService } from 'src/app/Presentation/user/services/permission.service';
import { TranslateService } from '@ngx-translate/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from 'src/app/shared/components/logout/logout.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import { DashboardService } from 'src/app/Presentation/user/dashboard/services/dashboard.service';
import { MatTabChangeEvent } from "@angular/material/tabs";
import { NotificationService } from 'src/app/service/notification.service';
import { FormatDateService } from 'src/app/shared/services/format-date.service';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { getMessaging, onMessage } from 'firebase/messaging';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  
  items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);
  currentLang = localStorage.getItem("lang");
  Newlang: string = '';
  opened = true;
  position = "start"
  mobileQuery: MediaQueryList;
  localization: boolean = true;
  today: number = Date.now();
  numNotification:any;
  usersMe!: any;
  isAdmin = true;
  private dialog = inject(MatDialog);
  private _mobileQueryListener: () => void;
  listComponents:any[] = [];
  router = inject(Router);
  // private dialog = inject(MatDialog);
  public permissionsService = inject(PermissionsService);
  public dashboardService = inject(DashboardService);
  profile:any = {}
  countries!: any[];
  selectedCountry: any;
  sideNavPosition: "start" | "end" = 'end';
  notificationFilter: any = {
    PageNumber: 0,
    PageSize: 5,
    PagingEnabled:true

  };
  formGroupUnRead:FormGroup = this.fb.group({
    unRead:[false]
  });
  AllnotificationList: any[] = [];
  checked = false;

  notificationCount = 0;
  unReadView = false;
  notificationCountRequests = 0;
  loadingNotification = false;
  notificationList: any[] = [];
  selectedTabIndex = 1;

  isSidebarExpanded: boolean = false;
  step:any = null;
  setStep(index: number) {
    this.step = index;
  }
  onSidebarMouseEnter() {
    this.isSidebarExpanded = true;
  }

  onSidebarMouseLeave() {
    this.isSidebarExpanded = false;
  }
  constructor(private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private toast: ToastrService,
    public translate: TranslateService,
    public authService: AuthService,
    private notificationService: NotificationService,
    private fb:FormBuilder,
    private formatDateService: FormatDateService,
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
  onLinkClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
  onScrollDown() {
    let totalCountPages = Math.ceil(this.notificationCount / 5);
    if(totalCountPages > (this.notificationFilter.PageNumber + 1)) {
      this.notificationFilter.PageNumber++;
      this.numberNotification(false, this.unReadView);
    }
    // numberNotification
  }
  onScrollUp() {
  }
  isToday(dateToCheck: any): boolean {
    const today = new Date();

    const isSameDate =
      new Date(dateToCheck).getDate() === today.getDate() &&
      new Date(dateToCheck).getMonth() === today.getMonth() &&
      new Date(dateToCheck).getFullYear() === today.getFullYear();

    return isSameDate;
  }
  showAll(matGroupIndex: any) {
    this.notificationFilter.pageSize = this.notificationCount;

    this.tabChanged({ index: matGroupIndex } as MatTabChangeEvent);
  }
  notificationTrack(index: any, hero: any) {
    return hero ? hero.id : undefined;
  }
  notificationTrackRequests(index: any, irem: any) {
    return irem ? irem.id : undefined;
  }
  tabChanged(tabChangeEvent: any): void {
    if (tabChangeEvent.index === 0) {

      delete this.notificationFilter.type;
      // this.webSocketService
      //   .notificationList(this.notificationFilter)
      //   .subscribe((data) => {
      //     this.notificationCount = data.count;
      //     this.AllnotificationList = data.rows;
      //     this.changeDetectorRef.detectChanges();
      //   });
      this.notificationCount = 22;
      this.AllnotificationList = [
        {
          titleEn:"dsadas",
          id:"asddas4sad545450",
          body:{
            descriptionEn:"dsadsadsasadsa sadas a",
            createdAt:"22/10/2010"
          }
        }
      ];
      this.changeDetectorRef.detectChanges();

    } else {
      this.loadingNotification = true;

      this.notificationFilter.type = "request";
      // this.webSocketService
      //   .notificationList(this.notificationFilter)
      //   .subscribe((data) => {
      //     this.notificationCountRequests = data.count;
      //     this.RequestnotificationList = data.rows;
      //     this.loadingNotification = false;
      //     this.changeDetectorRef.detectChanges();
      //   });
      this.notificationCountRequests = 22;
  
      this.loadingNotification = false;
      this.changeDetectorRef.detectChanges();
    }
  }
  componentName(data: any): string {
    let findIndexPermission = (this.getPermissions()?.availablePermissions as any[])?.findIndex(permission => permission.screenCode === data.screenCode);
    return findIndexPermission >=0 ? this.getPermissions()?.availablePermissions[findIndexPermission]?.screenName : ''

  }
  numberNotification(showFirstOnly:boolean, unread:boolean) {
    // .pipe(takeUntil(this.destroy$));
    if(showFirstOnly) {
      this.notificationService.markAsViewed().subscribe(data => {
        this.numNotification = "";

      });
    }
    

    if(!this.loadingNotification) {
      
      this.loadingNotification = true;
      if(!unread) {
        if(showFirstOnly) {
          delete this.notificationFilter.isRead;
            this.notificationService.listNotification(this.notificationFilter).subscribe({
              next:data => {
                // this.notificationList = [];
                this.notificationCount = data.data.totalCount;
                let totalCountPages = Math.ceil(this.notificationCount / 5);
                  if(totalCountPages >= (this.notificationFilter.PageNumber + 1)) {
                    if(this.notificationFilter.PageNumber == 0) {
                      this.notificationFilter = {
                        PageNumber: 0,
                        PageSize: 5,
                        PagingEnabled:true
                      };
                      this.notificationList = [];
                    }
                    
                    data?.data?.notifications.forEach(item => {
                      this.notificationList.push({
                        shortMessege:item.title,
                        fullMessege:item.body,
                        iconUrl:item.iconUrl,
                        id:item.id,
                        isRead:item.isRead,
                        notificationType:item.notificationType,
                        priority:item.priority,
                        date:this.formatDateService.formatDate(new Date(item.date)),
                        employeeId:item.employeeId,
                        status:item.status
                      })
                    });
                  }
             
                this.loadingNotification = false;
              },
              error:err => {
                this.loadingNotification = false;
              }
            })
        } else {
          this.notificationFilter.isRead = true;

          this.notificationService.listNotification(this.notificationFilter).subscribe({
            next:data => {
              

              // this.notificationList = [];
              this.notificationCount = data.data.totalCount;
              let totalCountPages = Math.ceil(this.notificationCount / 5);
              

                if((totalCountPages + 1) > (this.notificationFilter.PageNumber + 1)) {
                  if(this.notificationFilter.PageNumber == 0) {
                    this.notificationFilter = {
                      PageNumber: 0,
                      PageSize: 5,
                      PagingEnabled:true
                    };
                    this.notificationList = [];
                  }
                  
                  data?.data?.notifications.forEach(item => {
                    this.notificationList.push({
                      shortMessege:item.title,
                      fullMessege:item.body,
                      iconUrl:item.iconUrl,
                      id:item.id,
                      isRead:item.isRead,
                      notificationType:item.notificationType,
                      priority:item.priority,
                      date:this.formatDateService.formatDate(new Date(item.date)),
                      employeeId:item.employeeId,
                      status:item.status
                    })
                  });
                }
        
              this.loadingNotification = false;
            },
            error:err => {
              this.loadingNotification = false;
            }
          })
        }
      } else {
        

        if(showFirstOnly) {
          
          this.notificationFilter.isRead = false;
            this.notificationService.listNotification(this.notificationFilter).subscribe({
              next:data => {
                

      
                // this.notificationList = [];
                this.notificationCount = data.data.totalCount;
                let totalCountPages = Math.ceil(this.notificationCount / 5);
  
                if(showFirstOnly) {
  
                  if(totalCountPages >= (this.notificationFilter.PageNumber + 1)) {
                    if(this.notificationFilter.PageNumber == 0) {
                      this.notificationFilter = {
                        PageNumber: 0,
                        PageSize: 5,
                        PagingEnabled:true
                      };
                      this.notificationList = [];
                    }
                    data?.data?.notifications.forEach(item => {
                      this.notificationList.push({
                        shortMessege:item.title,
                        fullMessege:item.body,
                        iconUrl:item.iconUrl,
                        id:item.id,
                        isRead:item.isRead,
                        notificationType:item.notificationType,
                        priority:item.priority,
                        date:this.formatDateService.formatDate(new Date(item.date)),
                        employeeId:item.employeeId,
                        status:item.status
                      })
                    });
                  }
                } else {
                  if((totalCountPages + 1) > (this.notificationFilter.PageNumber + 1)) {
                    if(this.notificationFilter.PageNumber == 0) {
                      this.notificationFilter = {
                        PageNumber: 0,
                        PageSize: 5,
                        PagingEnabled:true
                      };
                      this.notificationList = [];
                    }
                    data?.data?.notifications.forEach(item => {
                      this.notificationList.push({
                        shortMessege:item.title,
                        fullMessege:item.body,
                        iconUrl:item.iconUrl,
                        id:item.id,
                        isRead:item.isRead,
                        notificationType:item.notificationType,
                        priority:item.priority,
                        date:this.formatDateService.formatDate(new Date(item.date)),
                        employeeId:item.employeeId,
                        status:item.status
                      })
                    });
                  }
              
                }
                this.loadingNotification = false;
        
              },
              error:err => {
                this.loadingNotification = false;
        
              }
            })
  
        } else {
          
          this.notificationFilter.isRead = false;

          this.notificationService.listNotification(this.notificationFilter).subscribe({
            next:data => {
              // this.notificationList = [];
              

              data?.data?.notifications.forEach(item => {
                this.notificationList.push({
                  shortMessege:item.title,
                  fullMessege:item.body,
                  iconUrl:item.iconUrl,
                  id:item.id,
                  isRead:item.isRead,
                  notificationType:item.notificationType,
                  priority:item.priority,
                  date:this.formatDateService.formatDate(new Date(item.date)),
                  employeeId:item.employeeId,
                  status:item.status
                })
              });
              this.loadingNotification = false;
              this.notificationCount = data.data.totalCount;
            },
            error:err => {
              this.loadingNotification = false;
            }
          })
        }
      }
    }

  }
  markAsRead(id:any) {
    this.loadingNotification = true;

    let params = {notificationStoreId:id};
    this.notificationService.markAsRead(params).subscribe({
      next:data => {
        let findIndexIsRead = this.notificationList.findIndex(item => item.id === id);
        if(findIndexIsRead >= 0) {
          this.notificationList[findIndexIsRead].isRead = data.data;
        }
        this.loadingNotification = false;
      },
      error: err => {
        this.loadingNotification = false;
      }
    })
  }
  notificationType(type:any) {
    this.trigger.closeMenu();
 
    if(type >=0 && type <= 2) {
      this.router.navigate(["/user/vacations"]);

    } else if(type>=3  && type <= 5) {
      this.router.navigate(["/user/tasks"]);

    } else if(type === 6) {
      this.router.navigate(["/user/justifications"]);

    }else if(type === 7) {
      this.router.navigate(["/user/permissions"]);

    }else if(type === 8) {
      this.router.navigate(["/user/sanctions"]);

    }else if(type === 9) {
      this.router.navigate(["/user/summons"]);

    }
    

  }
  ngOnInit(): void {
    let permission = JSON.parse(localStorage.getItem('permissions') as string)
    this.isAdmin = permission?.isAdmin;

    let definitions = [
      "/user/jobTitles", 
      "/user/sections",
      "/user/groups",
      "/user/zones",
      "/user/schedualPlan",
      "/user/tables",
      "/user/shifts",
      "/user/assignmentType",
      "/user/justificationsType",
      "/user/vacationType",
      "/user/permissionType",
      "/user/taskType",
      "/user/holidays"
    ];
    let employees = [
      "/user/employees", 
      "/user/users",
      "/user/employment",
      "/user/scheduleLogs",
      "/user/vacationBalance",
      "/user/sanctions"
    ];
    let requests = [
      "/user/requests", 
      "/user/vacations",
      "/user/justifications",
      "/user/permissions",
      "/user/tasks",
      "/user/assignments",
    ];
    let summons = [
      "/user/summons", 
      "/user/summonMissingLogs"
    ];
    let settings = [
      "/user/responsibility", 
      "/user/userPermissions",
      "/user/PermissionLog"
    ];
    if(definitions.includes(this.router.url)) {
      this.step = 0;
    }
    if(employees.includes(this.router.url)) {
      this.step = 1;
    }
    if(requests.includes(this.router.url)) {
      this.step = 2;
    }
    if(summons.includes(this.router.url)) {
      this.step = 3;
    }
    if(settings.includes(this.router.url)) {
      this.step = 4;
    }

    this.notificationService.getUnViewedNotificationCount().subscribe(data => {
      this.numNotification = data === 0 ? "": data;
    });
    this.notificationService.getNotification().subscribe(data => {
      if(data != null) {
        if(this.numNotification ===0 || !this.numNotification) {
          this.numNotification = 1;
        } else {
          this.numNotification++;
  
        }
      }
    
    });

    this.getUnViewedNotificationCount();
    this.formGroupUnRead.get("unRead")?.valueChanges.subscribe(data => {
      
      this.unReadView = data;
      this.notificationFilter = {
        PageNumber: 0,
        PageSize: 5,
        PagingEnabled:true
      };
      this.notificationList = [];
      this.numberNotification(false,this.unReadView)
    })
    if (this.currentLang === undefined || this.currentLang === null) {
      this.countries = [
        { name: 'عربي', code: 'AR' },
        { name: 'انجليزي', code: 'US' }
        // { name: 'الهند', code: 'IN' }
      ];
      this.selectedCountry = { name: 'عربي', code: 'AR' };
      document.documentElement.setAttribute('lang', 'ar');
      this.translate.use("ar");
      this.sideNavPosition="end";

    } else {

   
      this.selectedCountry = { name: 'arabic', code: 'AR' };

      if (this.currentLang == "ar") {
        document.documentElement.setAttribute('lang', 'ar');
        this.translate.use("ar");
        this.countries = [
          { name: 'عربي', code: 'AR' },
          { name: 'انجليزي', code: 'US' }
          // { name: 'الهند', code: 'IN' }
        ];
        this.selectedCountry = { name: 'عربي', code: 'AR' };
        this.sideNavPosition="end";

      }
      else if (this.currentLang == "en") {
        this.selectedCountry = { name: 'english', code: 'US' };
        document.documentElement.setAttribute('lang', 'en');
        this.translate.use("en");
        this.countries = [
          { name: 'english', code: 'US' },
          { name: 'arabic', code: 'AR' }
          // { name: 'India', code: 'IN' }
        ];
        this.selectedCountry = { name: 'english', code: 'US' };
        this.sideNavPosition="start";

      } 
      // else if (this.currentLang == "ind") {
      //   this.selectedCountry = { name: 'India', code: 'IN' };
      //   document.documentElement.setAttribute('lang', 'en');
      //   this.translate.use("ind");
      //   this.countries = [
      //     { name: 'India', code: 'IN' },

      //     { name: 'arabic', code: 'AR' },
      //     { name: 'english', code: 'US' }
      //   ];
      //   this.selectedCountry = { name: 'India', code: 'IN' };

      // }

    }
    if (!this.getPermissions()) {
      
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("usersMe");
    localStorage.removeItem("permissions");
      this.router.navigate(["./login"]);


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
          name: this.componentName({screenCode:39}),
          routerLink:'/user/summons',
          showComponent: this.showComponent({screenCode:39})
        },
        {
          name: this.componentName({screenCode:38}),
          routerLink:'/user/sanctions',
          showComponent: this.showComponent({screenCode:38})
        },
        {
          name: this.componentName({screenCode:40}),
          routerLink:'/user/summonMissingLogs',
          showComponent: this.showComponent({screenCode:40})
        },
        
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
        },
        {
          name: "سجلات التخلف عن الإستدعاء",
          routerLink:'/user/summonMissingLogs',
          showComponent: true
        }
        
      ]
      this.cloneArrayComponents = [...this.listComponents];

    }
    this.dashboardService.getInformationProfile().subscribe(data => {
      this.profile = data;
    })
  }

  getUnViewedNotificationCount() {
    this.notificationService.dataUnViewedNotificationCount().subscribe(data => {
      this.notificationService.setUnViewedNotificationCount(data.data);
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
          this.showListSearch = true;
    
        } else {
          this.showListSearch = false;
    
        }
      }
   
    }
 
  }
  closeMatMenu() {

  }
  changeLanguage(lang: any) {
    this.countries = [];
    if (lang.value.code === "US") {
      document.documentElement.setAttribute('lang', 'en');
      localStorage.setItem("lang", "en");
      this.translate.use("en");
      this.countries = [
        { name: 'english', code: 'US' },
        { name: 'arabic', code: 'AR' }
        // { name: 'India', code: 'IN' }
      ];

      // this.opened=!this.opened;
      let findIndexCountry =  this.countries.findIndex(country =>country.code == "US" )
      this.selectedCountry = this.countries[findIndexCountry];
      this.sideNavPosition="start";

    } else if (lang.value.code == "AR") {
      document.documentElement.setAttribute('lang', 'ar');
      localStorage.setItem("lang", "ar");
      this.translate.use("ar");
      this.countries = [
        { name: 'عربي', code: 'AR' },
        { name: 'انجليزي', code: 'US' }
        // { name: 'الهند', code: 'IN' }
      ];
      let findIndexCountry =  this.countries.findIndex(country =>country.code == "AR" )
      this.selectedCountry = this.countries[findIndexCountry];
      this.sideNavPosition="end";
      // this.opened=!this.opened;

    } 
    // else if (lang.value.code == "IN") {
    //   document.documentElement.setAttribute('lang', 'en');
    //   localStorage.setItem("lang", "ind");
    //   this.translate.use("ind");
    //   this.countries = [
    //     { name: 'India', code: 'IN' },

    //     { name: 'arabic', code: 'AR' },
    //     { name: 'english', code: 'US' }
    //   ];
    //   let findIndexCountry =  this.countries.findIndex(country =>country.code == "IN" )
    //   this.selectedCountry = this.countries[findIndexCountry];
    // }
  }
  SelectedLang(event: any) {
    this.Newlang = event.target.value;
    this.translate.use(this.Newlang);
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
    debugger;

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
      logoutDialog.componentInstance.loading = true;
      this.dashboardService.signOut().subscribe(
        {
          next:data => {
            logoutDialog.componentInstance.loading = false;

            localStorage.removeItem("token");
            localStorage.removeItem("permissions");
            this.router.navigate(["./login"]);
            logoutDialog.close();

          },
          error:err => {
            logoutDialog.componentInstance.loading = false;
            this.toast.error(err.error.message);

          }
        })

     

    })
  }
}
