import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { NotificationModel } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notification$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  
  constructor() { }

  setNotification(notification: any) {
    this.notification$.next(notification);
  }

  getNotification() {
    return this.notification$.asObservable();
  }
}