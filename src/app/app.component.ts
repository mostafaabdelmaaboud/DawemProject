import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { getMessaging, getToken } from 'firebase/messaging';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentLang = localStorage.getItem("lang");

  constructor(private translate: TranslateService) {
    document.documentElement.setAttribute('lang', 'ar');
    translate.setDefaultLang('ar');
    this.translate.use("ar");

    // if (this.currentLang === undefined || this.currentLang === null) {
    //   document.documentElement.setAttribute('lang', 'ar');
    //   this.translate.use("ar");
    // } else {

    //   if (this.currentLang == "ar") {
    //     document.documentElement.setAttribute('lang', 'ar');
    //     this.translate.use("ar");
 
    //   }
    //   else if (this.currentLang == "en") {
    //     document.documentElement.setAttribute('lang', 'en');
    //     this.translate.use("en");

    //   } 

    // }

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.requestPermission();
  }
  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, {vapidKey:environment.firebase.vapidKey}).then(
    (currentToken) => {
      if(currentToken) {
        debugger;
        console.log("yeah we have token")
        console.log(currentToken);
      } else {
        debugger;

        console.log("we have a problem")
      }
    }
    )
  }

}
