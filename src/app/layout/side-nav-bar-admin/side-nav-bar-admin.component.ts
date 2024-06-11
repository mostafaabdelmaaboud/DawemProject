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
interface MenuItem {
  id: number;
  groupOrScreenType: number;
  name: string;
  icon: string;
  url: string;
  availableActions: number[];
  children: MenuItem[] | null;
}

@Component({
  selector: 'app-side-nav-bar-admin',
  templateUrl: './side-nav-bar-admin.component.html',
  styleUrls: ['./side-nav-bar-admin.component.scss']
})
export class SideNavBarAdminComponent {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
 
  items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);
  currentLang = localStorage.getItem("lang");
  Newlang: string = '';
  opened = true;
  position = "start"
  mobileQuery: MediaQueryList;
  localization: boolean = true;
  today: number = Date.now();
  numNotification: null | string = "";
  usersMe!: any;
  isAdmin = true;
  private dialog = inject(MatDialog);
  private _mobileQueryListener: () => void;
  listComponents:any[] = [];
  router = inject(Router);
  menuItems:MenuItem[] | any = [];

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
  showLinks:any[] = [
    {screenCode:0, checkScreen:false},
    {screenCode:1, checkScreen:false},
    {screenCode:2, checkScreen:false},
    {screenCode:3, checkScreen:false},
    {screenCode:4, checkScreen:false},
    {screenCode:5, checkScreen:false},
    {screenCode:6, checkScreen:false},
    {screenCode:7, checkScreen:false},
    {screenCode:8, checkScreen:false},

  ];
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
    public translate: TranslateService,
    public authService: AuthService,
    private notificationService: NotificationService,
    private fb:FormBuilder,
    private formatDateService: FormatDateService,
    public permissionsUserService: PermissionsUserService) {
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
    const permissionsString = localStorage.getItem('adminPermissions') as string;

    try {
      // حاول تحويل القيمة إلى كائن JSON
      return JSON.parse(permissionsString);
    } catch (error) {
      // إذا كان هناك أي خطأ، فقط أرجع القيمة النصية
      return permissionsString;
    }
  }
  ngOnInit(): void {
    let permission = JSON.parse(localStorage.getItem('adminPermissions') as string)
    this.isAdmin = permission?.isAdmin;
    let menuItems = JSON.parse(localStorage.getItem('menuItems') as string)
    this.menuItems = menuItems;

    // this.notificationService.getNotification().subscribe(data => {
    //   this.numNotification = data?.NotificationData?.UnViewdNotificationCount;
    // });
    // this.notificationService.getUnViewedNotificationCount().subscribe(data => {
    //   this.numNotification = data?.toString() === "0" ? "": data?.toString();
    // });



    // this.getUnViewedNotificationCount();
    // this.formGroupUnRead.get("unRead")?.valueChanges.subscribe(data => {
      
    //   this.unReadView = data;
    //   this.notificationFilter = {
    //     PageNumber: 0,
    //     PageSize: 5,
    //     PagingEnabled:true
    //   };
    //   this.notificationList = [];
    //   this.numberNotification(false,this.unReadView)
    // })
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
      localStorage.removeItem("Admintoken");
      localStorage.removeItem("usersMe");
      localStorage.removeItem("adminPermissions");
      localStorage.removeItem("adminMenuItems");

      this.router.navigate(["./adminPanel/login"]);
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
    this.showLinks =  [
      {screenCode:0, checkScreen:false},
      {screenCode:1, checkScreen:false},
      {screenCode:2, checkScreen:false},
      {screenCode:3, checkScreen:false},
      {screenCode:4, checkScreen:false},
      {screenCode:5, checkScreen:false},
      {screenCode:6, checkScreen:false},
      {screenCode:7, checkScreen:false},
      {screenCode:8, checkScreen:false},
      {screenCode:9, checkScreen:false},
      {screenCode:10, checkScreen:false},
    ];
    this.checkLink(0);
    this.checkLink(1);
    this.checkLink(2);
    this.checkLink(3);
    this.checkLink(4);
    this.checkLink(5);
    this.checkLink(6);
    this.checkLink(7);
    this.checkLink(8);
    this.checkLink(9);
    this.checkLink(10);
    // admin names
    // this.dashboardService.getInformationProfile().subscribe(data => {
    //   this.profile = data;
    // })
  }


  checkLink(number) {
    if(this.showComponent({screenCode:number})) {
      let findIndexShowLink = this.showLinks.findIndex(link => link.screenCode === number);
      if(findIndexShowLink >=0) {
        this.showLinks[findIndexShowLink].checkScreen = true;

      }
    }
  }

  showComponent(data: any) {
    if(localStorage.getItem('adminPermissions')) {
      return this.permissionsUserService.checkPermissionAdmin({ type: "component", screenCode: data.screenCode })
    } else {
      return ""
    }
  }
  onLinkClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
  // onScrollDown() {
  //   let totalCountPages = Math.ceil(this.notificationCount / 5);
  //   if(totalCountPages > (this.notificationFilter.PageNumber + 1)) {
  //     this.notificationFilter.PageNumber++;
  //     this.numberNotification(false, this.unReadView);
  //   }
  // }
  // onScrollUp() {
  // }
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
      this.notificationCountRequests = 22;
      this.loadingNotification = false;
      this.changeDetectorRef.detectChanges();
    }
  }
  componentName(data: any): string {
    if(localStorage.getItem('adminPermissions')) {
      let findIndexPermission = (this.getPermissions()?.availablePermissions as any[])?.findIndex(permission => permission.screenCode === data.screenCode);
      return findIndexPermission >=0 ? this.getPermissions()?.availablePermissions[findIndexPermission]?.screenName :''
    } else {
      return ""
    }


  }
  // numberNotification(showFirstOnly:boolean, unread:boolean) {
  //   this.numNotification = "";
  //   if(showFirstOnly) {
  //     this.notificationService.markAsViewed().subscribe(data => {
  //     });
  //   }
  //   if(!this.loadingNotification) {
  //     this.loadingNotification = true;
  //     if(!unread) {
  //       if(showFirstOnly) {
  //           this.notificationService.listNotification(this.notificationFilter).subscribe({
  //             next:data => {
  //               this.notificationCount = data.data.totalCount;
  //               let totalCountPages = Math.ceil(this.notificationCount / 5);
  //                 if(totalCountPages > (this.notificationFilter.PageNumber + 1)) {
  //                   if(this.notificationFilter.PageNumber == 0) {
  //                     this.notificationFilter = {
  //                       PageNumber: 0,
  //                       PageSize: 5,
  //                       PagingEnabled:true
  //                     };
  //                     this.notificationList = [];
  //                   }
  //                   data?.data?.notificationStores.forEach(item => {
  //                     this.notificationList.push({
  //                       shortMessege:item.shortMessege,
  //                       fullMessege:item.fullMessege,
  //                       iconUrl:item.iconUrl,
  //                       id:item.id,
  //                       isRead:item.isRead,
  //                       notificationType:item.notificationType,
  //                       priority:item.priority,
  //                       date:this.formatDateService.formatDate(new Date(item.date)),
  //                       employeeId:item.employeeId,
  //                       status:item.status
  //                     })
  //                   });
  //                 }
             
  //               this.loadingNotification = false;
  //             },
  //             error:err => {
  //               this.loadingNotification = false;
  //             }
  //           })
  //       } else {
          
  //         this.notificationService.listNotification(this.notificationFilter).subscribe({
  //           next:data => {
  //             this.notificationCount = data.data.totalCount;
  //             let totalCountPages = Math.ceil(this.notificationCount / 5);
  //               if((totalCountPages + 1) > (this.notificationFilter.PageNumber + 1)) {
  //                 if(this.notificationFilter.PageNumber == 0) {
  //                   this.notificationFilter = {
  //                     PageNumber: 0,
  //                     PageSize: 5,
  //                     PagingEnabled:true
  //                   };
  //                   this.notificationList = [];
  //                 }
  //                 data?.data?.notificationStores.forEach(item => {
  //                   this.notificationList.push({
  //                     shortMessege:item.shortMessege,
  //                     fullMessege:item.fullMessege,
  //                     iconUrl:item.iconUrl,
  //                     id:item.id,
  //                     isRead:item.isRead,
  //                     notificationType:item.notificationType,
  //                     priority:item.priority,
  //                     date:this.formatDateService.formatDate(new Date(item.date)),
  //                     employeeId:item.employeeId,
  //                     status:item.status
  //                   })
  //                 });
  //               }
        
  //             this.loadingNotification = false;
  //           },
  //           error:err => {
  //             this.loadingNotification = false;
  //           }
  //         })
  //       }
  //     } else {
  //       if(showFirstOnly) {
  //           this.notificationService.getUnreadNotifications(this.notificationFilter).subscribe({
  //             next:data => {
  //               this.notificationCount = data.data.totalCount;
  //               let totalCountPages = Math.ceil(this.notificationCount / 5);
  //               if(showFirstOnly) {
  //                 if(totalCountPages > (this.notificationFilter.PageNumber + 1)) {
  //                   if(this.notificationFilter.PageNumber == 0) {
  //                     this.notificationFilter = {
  //                       PageNumber: 0,
  //                       PageSize: 5,
  //                       PagingEnabled:true
  //                     };
  //                     this.notificationList = [];
  //                   }
  //                   data?.data?.notificationStores.forEach(item => {
  //                     this.notificationList.push({
  //                       shortMessege:item.shortMessege,
  //                       fullMessege:item.fullMessege,
  //                       iconUrl:item.iconUrl,
  //                       id:item.id,
  //                       isRead:item.isRead,
  //                       notificationType:item.notificationType,
  //                       priority:item.priority,
  //                       date:this.formatDateService.formatDate(new Date(item.date)),
  //                       employeeId:item.employeeId,
  //                       status:item.status
  //                     })
  //                   });
  //                 }
  //               } else {
  //                 if((totalCountPages + 1) > (this.notificationFilter.PageNumber + 1)) {
  //                   if(this.notificationFilter.PageNumber == 0) {
  //                     this.notificationFilter = {
  //                       PageNumber: 0,
  //                       PageSize: 5,
  //                       PagingEnabled:true
  //                     };
  //                     this.notificationList = [];
  //                   }
  //                   data?.data?.notificationStores.forEach(item => {
  //                     this.notificationList.push({
  //                       shortMessege:item.shortMessege,
  //                       fullMessege:item.fullMessege,
  //                       iconUrl:item.iconUrl,
  //                       id:item.id,
  //                       isRead:item.isRead,
  //                       notificationType:item.notificationType,
  //                       priority:item.priority,
  //                       date:this.formatDateService.formatDate(new Date(item.date)),
  //                       employeeId:item.employeeId,
  //                       status:item.status
  //                     })
  //                   });
  //                 }
              
  //               }
  //               this.loadingNotification = false;
        
  //             },
  //             error:err => {
  //               this.loadingNotification = false;
        
  //             }
  //           })
  
  //       } else {
          
  //         this.notificationService.getUnreadNotifications(this.notificationFilter).subscribe({
  //           next:data => {
  //             data?.data?.notificationStores.forEach(item => {
  //               this.notificationList.push({
  //                 shortMessege:item.shortMessege,
  //                 fullMessege:item.fullMessege,
  //                 iconUrl:item.iconUrl,
  //                 id:item.id,
  //                 isRead:item.isRead,
  //                 notificationType:item.notificationType,
  //                 priority:item.priority,
  //                 date:this.formatDateService.formatDate(new Date(item.date)),
  //                 employeeId:item.employeeId,
  //                 status:item.status
  //               })
  //             });
  //             this.loadingNotification = false;
  //             this.notificationCount = data.data.totalCount;
  //           },
  //           error:err => {
  //             this.loadingNotification = false;
  //           }
  //         })
  //       }
  //     }
  //   }

  // }
  markAsRead(id:any) {
    this.loadingNotification = true;

    let params = {notificationId:id};
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

  logoutAdmin() {
    
    

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
      localStorage.removeItem("user");
      localStorage.removeItem("Admintoken");
      localStorage.removeItem("usersMe");
      localStorage.removeItem("adminPermissions");
      // logoutDialog.componentInstance.loading = true;
      //   logoutDialog.componentInstance.loading = false;

        logoutDialog.close();

        this.router.navigate(["./adminPanel/login"]);

        
  

    })
  }
}
