import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { PushNotificationService } from './service/push-notification.service';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentLang = localStorage.getItem("lang");
  private messaging;
  mesaggeReceived:any = '';
  message:any = null;

  constructor(private translate: TranslateService) {
   
    document.documentElement.setAttribute('lang', 'ar');
    translate.setDefaultLang('ar');
    this.translate.use("ar");

    // الاشتراك في استقبال الإشعارات عند وصولها
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
  receiveMessages(): void {
    // onMessage(this.messaging, (payload) => {
    //   console.log('Message received. ', payload);

    // });
  }
  ngOnInit(): void {
  this.listen();
  }

  listen() {
    debugger;

    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      debugger;
      console.log('Message received. ', payload);
      this.message=payload;
    });
  }
}
