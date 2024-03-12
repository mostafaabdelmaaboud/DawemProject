import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

  // prepareRequestHeaders() {
  //   let headers: HttpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Credentials': 'true',
  //     'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  //   });
  //   return headers;
  // }

  saveUserData(data: any) {
    localStorage.setItem('user', JSON.stringify(data));
  }

  setToken(Token: string) {
    localStorage.setItem('token', JSON.stringify(Token))
  }
  setusersMe(usersMe: string) {
    localStorage.setItem('usersMe ', JSON.stringify(usersMe))
  }
  getToken(): string {
    return localStorage.getItem('token') as string;
  }
 
  getCountries(filter: any) {
    let queryParams = new HttpParams();

    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);


      })
    }
    return this.http.get<any>(`${environment.baseUrl}Lookups/GetCountries`, { params: queryParams }).pipe(map(data => data.data))
  }
  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("usersMe");
    localStorage.removeItem("permissions");

    this.router.navigate(["./login"]);

  }
  // POSTLogin(url: any, data: any) {
  //   return this.http.post(url, data, { headers: this.prepareRequestHeaders() }).pipe();
  // }
  POST(url: any, data: any) {
    return this.http.post(url, data);
  }
  login(data: any) {
    return this.http.post(environment.baseUrl + "Authentication/SignIn", data)
  }
  requestResetPassword(data: any) {
    return this.http.post(environment.baseUrl + "Authentication/SignIn", data)

  }
  signup(data: any) {
    return this.http.post(environment.baseUrl + "Authentication/RequestResetPassword", data)

  }
  ResetPassword(data: any) {
    return this.http.post(environment.baseUrl + "Authentication/ResetPassword", data)

  }
  

}
