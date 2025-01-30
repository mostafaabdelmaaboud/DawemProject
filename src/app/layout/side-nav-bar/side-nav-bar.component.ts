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
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { getMessaging, onMessage } from 'firebase/messaging';
import { ToastrService } from 'ngx-toastr';
interface MenuItem {
  id: number;
  parent?: boolean;
  groupOrScreenType: number;
  name: string;
  icon: string;
  url: string;
  availableActions: number[];
  children: MenuItem[] | null;
}
@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  menuItems:MenuItem[] | any = [];
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
  updateCompanyScreenCode = "";
  isSidebarExpanded: boolean = false;
  step:any = null;
  private searchSubject = new Subject<{ value: any; type: any }>();

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
    return findIndexPermission >=0 ? this.getPermissions()?.availablePermissions[findIndexPermission]?.name : ''

  }
  navigateUpdateCompany() {
    let permissions = JSON.parse(localStorage.getItem("permissions") as string);
    let findIndexRoute = permissions?.availablePermissions?.findIndex((permission:any) => permission?.url?.includes("updateCompany"));
    if(findIndexRoute >= 0) {
        this.router.navigate([`${permissions?.availablePermissions[findIndexRoute]?.url}/${permissions?.availablePermissions[findIndexRoute]?.screenCode}`])
  
    }

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
  markAsRead(notification:any) {
    if(!notification.isRead) {
      this.loadingNotification = true;

      let params = {notificationId:notification.id};
      this.notificationService.markAsRead(params).subscribe({
        next:data => {
          let findIndexIsRead = this.notificationList.findIndex(item => item.id === notification.id);
          if(findIndexIsRead >= 0) {
            this.notificationList[findIndexIsRead].isRead = data.data;
          }
          this.loadingNotification = false;
          this.notificationType(notification.notificationType);
        },
        error: err => {
          this.loadingNotification = false;
        }
      })
    } else {
      this.notificationType(notification.notificationType);

    }

  }
  notificationType(type:any) {
    let permissions = JSON.parse(localStorage.getItem("permissions") as string);

    if(type >=0 && type <= 2) {
      let findIndexRoute = permissions?.availablePermissions?.findIndex((permission:any) => permission?.url?.includes("vacations"));
      if(findIndexRoute >= 0) {
        this.router.navigate([`${permissions?.availablePermissions[findIndexRoute]?.url}/${permissions?.availablePermissions[findIndexRoute]?.screenCode}`]);

      }

    } else if(type>=3  && type <= 5) {
      let findIndexRoute = permissions?.availablePermissions?.findIndex((permission:any) => permission?.url?.includes("tasks"));
      if(findIndexRoute >= 0) {
        this.router.navigate([`${permissions?.availablePermissions[findIndexRoute]?.url}/${permissions?.availablePermissions[findIndexRoute]?.screenCode}`]);
  
      }

    } else if(type === 6) {
      let findIndexRoute = permissions?.availablePermissions?.findIndex((permission:any) => permission?.url?.includes("justifications"));
      if(findIndexRoute >= 0) {
        this.router.navigate([`${permissions?.availablePermissions[findIndexRoute]?.url}/${permissions?.availablePermissions[findIndexRoute]?.screenCode}`]);
  
      }

    }else if(type === 7) {
      let findIndexRoute = permissions?.availablePermissions?.findIndex((permission:any) => permission?.url?.includes("permissions"));
      if(findIndexRoute >= 0) {
        this.router.navigate([`${permissions?.availablePermissions[findIndexRoute]?.url}/${permissions?.availablePermissions[findIndexRoute]?.screenCode}`]);
  
      }

    }else if(type === 8) {
      let findIndexRoute = permissions?.availablePermissions?.findIndex((permission:any) => permission?.url?.includes("sanctions"));
      if(findIndexRoute >= 0) {
        this.router.navigate([`${permissions?.availablePermissions[findIndexRoute]?.url}/${permissions?.availablePermissions[findIndexRoute]?.screenCode}`]);
  
      }

    }else if(type === 9) {
      let findIndexRoute = permissions?.availablePermissions?.findIndex((permission:any) => permission?.url?.includes("summons"));
      if(findIndexRoute >= 0) {
        this.router.navigate([`${permissions?.availablePermissions[findIndexRoute]?.url}/${permissions?.availablePermissions[findIndexRoute]?.screenCode}`]);
  
      }

    }
    this.trigger.closeMenu();


  }
  ngOnInit(): void {
    let permission = JSON.parse(localStorage.getItem('permissions') as string)
    this.isAdmin = permission?.isAdmin;
    let menuItems = JSON.parse(localStorage.getItem('menuItems') as string)
    let findIndexRoute = permission?.availablePermissions?.findIndex((permission:any) => permission?.url?.includes("updateCompany"));

    if(findIndexRoute >= 0) {
      this.updateCompanyScreenCode = permission?.availablePermissions[findIndexRoute]?.screenCode;
      
    }

this.menuItems = menuItems;


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
    localStorage.removeItem("menuItems");
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

    this.dashboardService.getInformationProfile().subscribe(data => {
      this.profile = data;
    });
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

  getUnViewedNotificationCount() {
    this.notificationService.dataUnViewedNotificationCount().subscribe(data => {
      this.notificationService.setUnViewedNotificationCount(data.data);
    })
  }
  searchInput = "";
  showListSearch = false;
  lastSearchQuery = "";
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
  navigateComponent(componrnt:any) {
    this.showListSearch = false;
    this.searchInput = '';
    debugger;
    this.router.navigate([componrnt.url+'/'+componrnt.screenCode])
    debugger;

  }
  searchDropdown(data: any, type: string, searchInput?) {

    switch (type) {
      case 'searchComponent':
        if (data) {
          debugger;
          if (data !== this.lastSearchQuery) {
            debugger;

            this.lastSearchQuery = data;
            this.searchInput = data;
            let permissions = JSON.parse(localStorage.getItem('permissions') as string);
            debugger;

            let availablePermissions:any[] =permissions?.availablePermissions;
            this.listComponents = availablePermissions;
            let newArray:any[]= [];
            this.lastSearchQuery = "";
            this.listComponents ?.forEach((dataCom: any) => {
              newArray.push({ ...dataCom })
            });
            newArray = newArray.filter(newItem => 
              !this.listComponents.some(oldItem => oldItem.url === newItem.url || oldItem.name === newItem.name)
            );
            const searchTerm = data;
            if(this.listComponents?.length > 0 || searchInput){
              if(newArray?.length >0) {
                this.listComponents = [...this.listComponents, ...newArray]
              }
              let formatSearch = this.sortArrayBySearchTerm(this.listComponents, searchTerm);
              this.listComponents = [...formatSearch];
              this.showListSearch = true;
            } else {
              this.showListSearch = false;
              if(!this.listComponents?.length) {
                // this.toastr.error("لا يوجد بيانات");
              }
            }
          }
        } else {
          this.listComponents = [];
          this.showListSearch = false;

          this.searchInput = "";

        }
        break;
  
      default:
        
        break;
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
