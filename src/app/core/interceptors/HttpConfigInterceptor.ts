import { Injectable, Injector, inject } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { ToastService } from "src/app/shared/services/toast.service";
import { avilableTypes } from "src/app/shared/models/toast-Data";
import { AuthService } from "../auth/services/auth-service.service";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  currentLang = localStorage.getItem("lang");
//  public translate = inject(TranslateService);

  constructor(private cookieService: CookieService,
    private authService: AuthService,
    private router: Router,
    private injector: Injector,

    // public translate: TranslateService,
    private toastservice: ToastService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.method == "GET" || request.method == "PATCH") {
     
      let token: any;
      if (
        !request.url.includes("/api/Browse/Browse") &&
       !this.router.url.includes("/signUp") 
      ) {
         if(this.router.url.includes("admin/") || this.router.url.includes("adminPanel/login")) {
          if (typeof localStorage.getItem("Admintoken") === 'string') {
            token = `Bearer ${JSON?.parse(localStorage.getItem("Admintoken") as string)}`
    
          } else {
            if (JSON.stringify(localStorage.getItem("Admintoken"))) {
              token = `Bearer ${JSON?.parse(JSON.stringify(localStorage.getItem("Admintoken")))}`
            }
          }
        } else if(this.router.url.includes("user/")|| this.router.url.includes("/login")) {
          if (typeof localStorage.getItem("token") === 'string') {
            token = `Bearer ${JSON?.parse(localStorage.getItem("token") as string)}`
    
          } else {
            if (JSON.stringify(localStorage.getItem("token"))) {
              token = `Bearer ${JSON?.parse(JSON.stringify(localStorage.getItem("token")))}`
            }
          }
        }
   
        // request.headers.set("token", this.authService.getToken());
        // request.headers.set("Content-Type", "application/json");
        if (!request.url.includes("assets/i18n")) {
          let translate = this.injector.get(TranslateService)
          if (translate.currentLang == "ar") {
            request = request.clone({
              headers: request.headers
                .set("Authorization", token).set("lang", "ar")
              // .set(
              //   "fingerPrint",
              //   this.cookieService.get("fingerPrint") || "123456"
              // ),
            })
          } else {
            request = request.clone({
              headers: request.headers
                .set("Authorization", token).set("lang", "en")
              // .set(
              //   "fingerPrint",
              //   this.cookieService.get("fingerPrint") || "123456"
              // ),
            });
          } 
  
       
        }
  
        if (request.url.includes("/notification/list")) {
          request = request.clone({
            headers: request.headers.set(
              "x-device-token",
              localStorage.getItem("deviceToken") as string
            ),
          });
        }
      }
     
      if (
        this.router.url.includes("/signUp")
      ) {
       

        if (!request.url.includes("assets/i18n")) {
         

          let translate = this.injector.get(TranslateService)
         

          if (translate.currentLang == "ar") {
            request = request.clone({
              headers: request.headers.set("lang", "ar")
              // .set(
              //   "fingerPrint",
              //   this.cookieService.get("fingerPrint") || "123456"
              // ),
            })
          } else {
            request = request.clone({
              headers: request.headers.set("lang", "en")
              // .set(
              //   "fingerPrint",
              //   this.cookieService.get("fingerPrint") || "123456"
              // ),
            });
          } 
  
       
        }
      }
    
    
    } else if (request.method == "POST" || request.method == "PUT" || request.method == "DELETE") {
      if (
        request.url.includes("/SignIn") ||
        request.url.includes("/forgetPassword") ||
        request.url.includes("setNewPassword") ||
        request.url.includes("RequestResetPassword")
      ) {
        if (!request.url.includes("assets/i18n")) {
          let translate = this.injector.get(TranslateService)
          if (translate.currentLang == "ar") {
            request = request.clone({
              headers: request.headers.set("lang", "ar")
              // .set(
              //   "fingerPrint",
              //   this.cookieService.get("fingerPrint") || "123456"
              // ),
            })
          } else {
            request = request.clone({
              headers: request.headers.set("lang", "en")
              // .set(
              //   "fingerPrint",
              //   this.cookieService.get("fingerPrint") || "123456"
              // ),
            });
          } 
  
       
        }
        // request.body.fingerPrint =
        //   this.cookieService.get("fingerPrint") || "123456";
      } else {
        let token: any;
       

       
        if(this.router.url.includes("admin/")) {
    
          if (typeof localStorage.getItem("Admintoken") === 'string') {
            token = `Bearer ${JSON?.parse(localStorage.getItem("Admintoken") as string)}`
  
          } else {
            if (JSON.stringify(localStorage.getItem("Admintoken"))) {
              token = `Bearer ${JSON?.parse(JSON.stringify(localStorage.getItem("Admintoken")))}`
  
            }
          }
        } else if(this.router.url.includes("user/")) {
          if (typeof localStorage.getItem("token") === 'string') {
            token = `Bearer ${JSON?.parse(localStorage.getItem("token") as string)}`
  
          } else {
            if (JSON.stringify(localStorage.getItem("token"))) {
              token = `Bearer ${JSON?.parse(JSON.stringify(localStorage.getItem("token")))}`
  
            }
          }
        } 


        let translate = this.injector.get(TranslateService);
       
        if(!this.router.url.includes("/signUp") && !this.router.url.includes("/RequestResetPassword")) {
          if (translate.currentLang == "ar") {
            request = request.clone({
              headers: request.headers
                .set("Authorization", token).set("lang", "ar")
       
            })
          } else {
            request = request.clone({
              headers: request.headers
                .set("Authorization", token).set("lang", "en")
      
            });
          } 
        } else {
          if (translate.currentLang == "ar") {
            request = request.clone({
              headers: request.headers.set("lang", "ar")
        
            })
          } else {
            request = request.clone({
              headers: request.headers.set("lang", "en")
 
            });
          } 
        }
      }
    }
   
    
    
    return next.handle(request).pipe(
      catchError((error: any) => {
       
        let errorMsg = "";
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          if (error?.status == 401 || error?.status == 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("fingerPrint");
            localStorage.removeItem("isLogin");
            localStorage.removeItem("deviceToken");
            localStorage.removeItem("me");
            localStorage.removeItem("rules");
            localStorage.removeItem("permissions");
            localStorage.removeItem("menuItems");

            localStorage.clear();
            sessionStorage.clear();
            if(this.router.url.includes("user/")) {
              this.router.navigate(["/login"]);

            }
            if(this.router.url.includes("admin/")) {
              this.router.navigate(["adminPanel/login"]);

            }
          } else if(error?.status == 400) {
            let valuesError = Object.values(error?.error);

            this.toastservice.show({
              message: valuesError.join(" , "),
              type: avilableTypes.Error,
            });
          } else {
            
            if (error?.response?.data) {
              this.toastservice.show({
                message: error.response.data.message,
                type: avilableTypes.Error
              });
            } else {
              

              if (error?.code == "ERR_NETWORK") {
                localStorage.removeItem("token");
                localStorage.removeItem("fingerPrint");
                localStorage.removeItem("isLogin");
                localStorage.removeItem("permissions");
                localStorage.removeItem("menuItems");

                localStorage.clear();
                sessionStorage.clear();

                if(this.router.url.includes("user/")) {
                  this.router.navigate(["/login"]);
    
                }
                if(this.router.url.includes("admin/")) {
                  this.router.navigate(["adminPanel/login"]);
    
                }
              }
              if(!request.urlWithParams.toLowerCase().includes("permission/checkandgetpermission")) {
                this.toastservice.show({
                  message: error?.error?.message,
                  type: avilableTypes.Error,
                });
              }
           
            }
          }
        }
        return throwError(() => error);
      })
    );
  }
}
