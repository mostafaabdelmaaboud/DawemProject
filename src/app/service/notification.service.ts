import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { NotificationModel } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notification$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  unViewednotification$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  
  constructor(private http: HttpClient) { }

  setNotification(notification: any) {
    this.notification$.next(notification);
  }

  getNotification() {
    return this.notification$.asObservable();
  }
  dataUnViewedNotificationCount(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}NotificationStore/GetUnViewedNotificationCount`)
  }
  getUnViewedNotificationCount() {
    return this.unViewednotification$.asObservable();
  }
  setUnViewedNotificationCount(data:any) {
    this.unViewednotification$.next(data);
  }
  listNotification(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}NotificationStore/GetNotifications`, { params: queryParams })
  }
  getUnreadNotifications(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}NotificationStore/GetUnreadNotifications`, { params: queryParams })
  }
  markAsRead(params:any): Observable<any>  {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}NotificationStore/MarkAsRead`,{}, { params: queryParams })

  }
  markAsViewed(): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}NotificationStore/MarkAsViewed`,{})
  }

}