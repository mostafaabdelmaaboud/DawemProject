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
  constructor(private fb: FormBuilder, public translate: TranslateService, private toast: ToastrService, private cd:ChangeDetectorRef, private notificacion: PushNotificationService) {
   
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
        ApplicationType: 1
      }).subscribe(
        {
          next: (res: any) => {
            let formatObjectPermissions = JSON.stringify({ isAdmin: res.data.isAdmin, availablePermissions: res.data.availablePermissions })
            localStorage.setItem("permissions", formatObjectPermissions);
            let parseJson = JSON.parse(formatObjectPermissions);
            if (parseJson.isAdmin || parseJson.availablePermissions.length > 0) {
              this.authService.setToken(res.data.token);
              this.toast.success(res.message,"", {timeOut: 1000});


              this.router.navigate(["/user/dashboard"]);
              this.isLoading = false;

            } else {
              this.toast.error("you don't have permissions");
            this.isLoading = false;

            }
            // this.isLoading = false;

            this.loading = true;

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
