import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PermissionsService } from 'src/app/Presentation/user/services/permission.service';
import { TranslateService } from '@ngx-translate/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from 'src/app/shared/components/logout/logout.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';

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
  permission: any = JSON.parse(localStorage.getItem("permissions") as string);

  private dialog = inject(MatDialog);
  private _mobileQueryListener: () => void;
  // private dialog = inject(MatDialog);
  public permissionsService = inject(PermissionsService);
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
  showComponent(data: any) {
    return this.permissionsUserService.checkPermission({ type: "component", screenCode: data.screenCode })
  }
  componentName(data: any): string {
    let findIndexPermission = (this.permission.availablePermissions as any[]).findIndex(permission => permission.screenCode === data.screenCode);
    return this.permission.availablePermissions[findIndexPermission]?.screenName

  }
  numberNotification() {
    this.numNotification = "";
  }
  ngOnInit(): void {
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
