import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { NotificationService } from './service/notification.service';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]

})
export class AppComponent {
  currentLang = localStorage.getItem("lang");
  private messaging;
  mesaggeReceived:any = '';
  position = "top-left";
  constructor(private translate: TranslateService, private messageService: MessageService, private notificationService:NotificationService) {
    document.documentElement.setAttribute('lang', 'ar');
    translate.setDefaultLang('ar');
    this.translate.use("ar");
    if (this.currentLang === undefined || this.currentLang === null) {
      this.position = "top-left";
    } else {
      if (this.currentLang == "ar") {
        this.position = "top-left";
      }
      else if (this.currentLang == "en") {
        this.position = "top-right";
      } 
    }
  }

  ngOnInit(): void {
    this.listen();
    
  }

  
  closeNotification() {
    this.messageService.clear("notificationsw");
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      debugger;
      let formatObject = {NotificationData:JSON.parse(payload?.data?.['NotificationData'] as string),...payload};
      this.notificationService.setNotification(formatObject);

      // this.notificationService.setNotification({UnViewdNotificationCount:JSON.parse(payload?.data?.['UnViewdNotificationCount'] as string),...payload});
      this.messageService.add({ key: 'notification',severity: 'info', summary: 'Info', data:{title:payload.notification?.title, body:payload.notification?.body}, detail: 'Message Content',life:10000 });
    });
  }
}
