import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth-service.service';
import { PushNotificationService } from 'src/app/service/push-notification.service';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from 'src/environments/environment';
import { initializeApp } from "firebase/app";
import { UserPermissionsService } from 'src/app/Presentation/user/user-permissions/services/user-permissions.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  togglePassword = true;
  FormGroup: FormGroup = this.fb.group({
    Email: ["", [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    password: ["", [Validators.required, Validators.minLength(5)]]
  });
  private authService = inject(AuthService);
  currentLang = localStorage.getItem("lang");
  countries!: any[];
  loading: boolean = true;
  isLoading = false;
  private router = inject(Router)
  selectedCountry: any;
  FCMToken:string = "";
  filteration: any = {
    PageSize: 40,
    PageNumber: 0,
    PagingEnabled: true
  };
  private userPermissionsService = inject(UserPermissionsService);

  constructor(private fb: FormBuilder, public translate: TranslateService, private messageService: MessageService, private notificationService:NotificationService,private http: HttpClient, private toast: ToastrService, private cd:ChangeDetectorRef, private notificacion: PushNotificationService) {
   
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.countries = [
    //   { name: 'عربي', code: 'AR' },
    //   { name: 'انجليزي', code: 'US' },
    //   { name: 'الهند', code: 'IN' }
    // ];
    // this.selectedCountry = { name: 'عربي', code: 'AR' };
    if (this.currentLang === undefined || this.currentLang === null) {
      this.countries = [
        { name: 'عربي', code: 'AR' },
        { name: 'انجليزي', code: 'US' }
      ];
      this.selectedCountry = { name: 'عربي', code: 'AR' };
      document.documentElement.setAttribute('lang', 'ar');
      this.translate.use("ar");
    } else {
      this.selectedCountry = { name: 'arabic', code: 'AR' };
      if (this.currentLang == "ar") {
        document.documentElement.setAttribute('lang', 'ar');
        this.translate.use("ar");
        this.countries = [
          { name: 'عربي', code: 'AR' },
          { name: 'انجليزي', code: 'US' }
        ];
        this.selectedCountry = { name: 'عربي', code: 'AR' };
      }
      else if (this.currentLang == "en") {
        this.selectedCountry = { name: 'english', code: 'US' };
        document.documentElement.setAttribute('lang', 'en');
        this.translate.use("en");
        this.countries = [
          { name: 'english', code: 'US' },
          { name: 'arabic', code: 'AR' },
        ];
        this.selectedCountry = { name: 'english', code: 'US' };
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

    this.isLoading = false;
    
    if ('Notification' in window && navigator.permissions) {
      navigator.permissions.query({ name: 'notifications' })
      .then(permissionStatus => {
        if(permissionStatus.state === "granted") {
          this.requestPermission();
        } else if(permissionStatus.state === "prompt") {
          
          this.requestPermission();
          this.listen();
          this.isLoading = false;

     
      } else {
     // this.toast.error("Error querying Notification permission: " + permissionStatus.state, '', {
          //   timeOut: 10000,
          //   onActivateTick: true
          // });  
          // window.open('https://example.com/notification-settings', '_blank');
        //   new Notification('New Message From Romzik', {
        //     body: 'How are you today? Is it really is a lovely day.',
        //     icon: 'img/msg-icon.png',
        //     tag: 'unique-identifier=123' // msg-id
        // });
        // Notification.requestPermission().then(function(permission) { console.log('permiss', permission)});
        // if ('Notification' in window && Notification.permission === 'granted') {
        //   const notification = new Notification('Hello', { body: 'This is a notification from your Angular app!' });
        // }
        // const notification = new Notification('Hello', { body: 'This is a notification from your Angular app!' });
        
        // pushpad('subscribe', function (isSubscribed) {
        //   if (isSubscribed) {
        //     alert("Thanks! You have successfully subscribed to notifications.");
        //   } else {
        //     alert("You have blocked the notifications from browser preferences.");
        //   }
        // }
      }
      }).catch(error => {
        console.error('Error querying Notification permission:', error);
      });
    } else {
      console.error('Notifications not supported in this browser.');
    }
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      this.notificationService.setNotification({UnViewdNotificationCount:JSON.parse(payload?.data?.['UnViewdNotificationCount'] as string),...payload});
      this.messageService.add({ key: 'notification',severity: 'info', summary: 'Info', data:{title:payload.notification?.title, body:payload.notification?.body}, detail: 'Message Content',life:10000 });
    });
  }
  requestPermission() {
    this.isLoading = true;
    const messaging = getMessaging();
    getToken(messaging, 
     { vapidKey: environment.firebase.vapidKey}).then(
       (currentToken) => {
        
         if (currentToken) {
           this.isLoading = false;
           this.FCMToken = currentToken;
         } else {
          this.isLoading = false;
           console.log('No registration token available. Request permission to generate one.');
         }
     }).catch((err) => {
      
      this.isLoading = false;

      this.requestPermission();
      

        console.log('An error occurred while retrieving token. ', err);
    });

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
 
      let findIndexCountry =  this.countries.findIndex(country =>country.code == "US" )
      this.selectedCountry = this.countries[findIndexCountry];
    } else if (lang.value.code == "AR") {
      document.documentElement.setAttribute('lang', 'ar');
      localStorage.setItem("lang", "ar");
      this.translate.use("ar");
      this.countries = [
        { name: 'عربي', code: 'AR' },
        { name: 'انجليزي', code: 'US' }
      ];
      let findIndexCountry =  this.countries.findIndex(country =>country.code == "AR" )
      this.selectedCountry = this.countries[findIndexCountry];

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
    this.cd.detectChanges();
  }
  submit() {
    if (this.FormGroup.valid && this.loading) {
      this.loading = false;
      this.isLoading = true;
      this.authService.login({
        Email: this.FormGroup.value.Email,
        Password: this.FormGroup.value.password,
        FCMToken: this.FCMToken,
        RememberMe: true,
        ApplicationType: 0
      }).subscribe(
        {
          next: (res: any) => {
            if(res.data.isAdmin) {
              this.authService.setToken(res.data.token);
              let queryParams = new HttpParams();
              if (this.filteration) {
                Object.entries(this.filteration).forEach(([key, value]: any) => {
                  queryParams = queryParams.set(key, value);
                })
              }
         
              this.userPermissionsService.availableActions(this.filteration).subscribe({
                next: data => {
          
                  let formatObjectPermissions = JSON.stringify({ isAdmin: res.data.isAdmin, availablePermissions: data.data.screens })
                  localStorage.setItem("permissions", formatObjectPermissions);
                  let parseJson = JSON.parse(formatObjectPermissions);
                  if (parseJson.availablePermissions.length > 0) {
                      this.isLoading = false;
                      this.loading = true;
                      this.toast.success(res.message,"", {timeOut: 2000});
                      this.router.navigate(["/user/dashboard"]);
                  } else {
                    this.toast.error("you don't have permissions");
                  this.isLoading = false;
                  this.loading = true;
                  }
          
                },
                error: err => {
                  this.toast.error(err.error.message);
                  this.isLoading = false;
                  this.loading = true;
                }
              }
              )
            } else {
              let formatObjectPermissions = JSON.stringify({ isAdmin: res.data.isAdmin, availablePermissions: res.data.availablePermissions })
              localStorage.setItem("permissions", formatObjectPermissions);
              let parseJson = JSON.parse(formatObjectPermissions);
              if (parseJson.isAdmin || parseJson.availablePermissions.length > 0) {
                this.authService.setToken(res.data.token);
                  this.isLoading = false;
                  this.loading = true;
                  this.toast.success(res.message,"", {timeOut: 2000});
                  switch (res.data.availablePermissions?.[0]?.screenCode) {
                    case 0:
                      this.router.navigate(["/user/assignmentType"]);
                      break;
                      case 1:
                      this.router.navigate(["/user/dashboard"]);
                      break;
                      case 2:
                        this.router.navigate(["/user/sections"]);
                        break;
                        case 3:
                          this.router.navigate(["/user/employees"]);
                        break;
                        case 4:
                          this.router.navigate(["/user/employment"]);
                          break;
                          case 34:
                            this.router.navigate(["/user/users"]);
                            break;
                        case 31:
                          this.router.navigate(["/user/scheduleLogs"]);
                          break;
                          case 35:
                          this.router.navigate(["/user/vacationBalance"]);
                          break;
                          case 38:
                            this.router.navigate(["/user/sanctions"]);
                            break;
                            case 22:
                              this.router.navigate(["/user/requests"]);
                              break;  
                              case 27:
                              this.router.navigate(["/user/vacations"]);
                              break;
                              case 24:
                                this.router.navigate(["/user/justifications"]);
                                break;
                                case 25:
                                  this.router.navigate(["/user/permissions"]);
                                  break;
                                  case 26:
                                    this.router.navigate(["/user/tasks"]);
                                    break;
                                    case 23:
                                      this.router.navigate(["/user/assignments"]);
                                      break;
                                      case 39:
                                        this.router.navigate(["/user/summons"]);
                                        break;
                                        case 40:
                                          this.router.navigate(["/user/summonMissingLogs"]);
                                          break;
                                          case 13:
                                            this.router.navigate(["/user/fingerPrintDevice"]);
                                            break;
                                            case 17:
                                              this.router.navigate(["/user/jobTitles"]);
                                              break;
                                              case 14:
                                                this.router.navigate(["/user/groups"]);
                                                break;
                                                case 37:
                                                  this.router.navigate(["/user/zones"]);
                                                  break;
                                                  case 30:
                                                    this.router.navigate(["/user/schedualPlan"]);
                                                    break;
                                                    case 29:
                                                      this.router.navigate(["/user/tables"]);
                                                      break;
                                                      case 32:
                                                        this.router.navigate(["/user/shifts"]);
                                                        break;
                                                        case 18:
                                                          this.router.navigate(["/user/justificationsType"]);
                                                          break;
                                                          case 36:
                                                            this.router.navigate(["/user/vacationType"]);
                                                            break;
                                                            case 21:
                                                              this.router.navigate(["/user/permissionType"]);
                                                              break;
                                                              case 33:
                                                                this.router.navigate(["/user/taskType"]);
                                                                break;
                                                                case 15:
                                                                  this.router.navigate(["/user/holidays"]);
                                                                  break;
                                                                  case 28:
                                                                    this.router.navigate(["/user/responsibility"]);
                                                                    break;
                                                                    case 19:
                                                                      this.router.navigate(["/user/userPermissions"]);
                                                                      break;
                                                                      case 20:
                                                                        this.router.navigate(["/user/PermissionLog"]);
                                                                        break;
                                                                                            


                    default:
                      break;
                  }
              } else {
                this.toast.error("you don't have permissions");
              this.isLoading = false;
              this.loading = true;
              }
              // this.isLoading = false;
            }
 
          },
          error: err => {
            this.toast.error(err.error.message);
            this.isLoading = false;
            this.loading = true;
          }
        }
      )
    } else {
      this.FormGroup.get("Email")?.markAsDirty();
      this.FormGroup.get("password")?.markAsDirty();
    }
  }
  getControl(FormControl: string) {
    return this.FormGroup.get(FormControl);
  }
}
