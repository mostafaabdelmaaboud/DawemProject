import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { PushNotificationService } from './service/push-notification.service';
// import { getMessaging, onMessage,getToken } from 'firebase/messaging';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentLang = localStorage.getItem("lang");
  private messaging;
  mesaggeReceived:any = '';

  constructor(private translate: TranslateService, private notificacion: PushNotificationService) {
    notificacion.requestPermission().then(token => {
      console.log(token);
    })
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
    this.notificacion.receiveMessage().subscribe(payload => {
      debugger;
      console.log(payload);
      this.mesaggeReceived = payload.notification.title;
    })
  //   firebase.initializeApp({
  //     apiKey: "AIzaSyCNr7nAJOZJW0YDBTanTXnH_xVnlnMDAPI",
  //     authDomain: "dawem-5361a.firebaseapp.com",
  //     projectId: "dawem-5361a",
  //     storageBucket: "dawem-5361a.appspot.com",
  //     messagingSenderId: "920034014025",
  //     appId: "1:920034014025:web:18bb00d19266b668b1a098",
  //     measurementId: "G-VE6JQS06RC",
  //     vapidKey:"BPuMrpAzNPOGPD5cb4pqYzMYPsc1Xyh_IqNZKd1IMQZBMayJCn9N9-B_uNrZ-0lMtSstS4Ri2O2dIb5ERZGjdrs"
  //   });
  //   const messaging = firebase.messaging();
  //   messaging.onMessage((payload) => {
  //     debugger;
  //   console.log('Received background message ', payload);
  // });

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    

    // this.angularFireMessaging.messages.subscribe({
    //   next:(payload:any) => {
    //     debugger;
    //     console.log("new message received. ", payload);
    //     // this.currentMessage.next(payload);
    //   },
    //   error:err => {
  
    //   }})
  }
  requestPermission() {
    // const messaging = getMessaging();
   
    // getToken(messaging, {vapidKey:environment.firebase.vapidKey}).then(
    // (currentToken) => {
    //   if(currentToken) {
    //     debugger;
    //     console.log("yeah we have token")
    //     console.log(currentToken);
    //   } else {
    //     debugger;

    //     console.log("we have a problem")
    //   }
    // }
    // )
    

 
  }
  listen() {

    // messaging.onBackgroundMessage((payload) => {
    //   debugger;
    //     console.log('Received background message ', payload);
    //   });

    // onBackgroundMessage(messaging, (payload) => {
    //   debugger;
    //   console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    // });

  }

}
