import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsPaymentsService {
  constructor(private http: HttpClient) { }
  getSubscriptions(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/SubscriptionPayment/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}adminpanel/SubscriptionPayment/GetSubscriptionPaymentsInformations`).pipe(map(data => data.data));
  }
  disableSubscription(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}adminpanel/SubscriptionPayment/Disable`, {}, { params: queryParams })
  }
  accept(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}adminpanel/SubscriptionPayment/Enable`, {}, { params: queryParams })

  }
  subscriptionsInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/SubscriptionPayment/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }


  createSubscription(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}adminpanel/SubscriptionPayment/Create`, formData)

  }
  updateSubscription(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}adminpanel/SubscriptionPayment/Update`, formData)

  }

  SubscriptionGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/SubscriptionPayment/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }

  subscriptionGetForDropDown(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Subscription/GetForDropDown`, { params: queryParams })
  }
}
