import { Injectable, inject } from "@angular/core";
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

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService,
    private authService: AuthService,
    private router: Router,
    private toastservice: ToastService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.method == "GET" || request.method == "PATCH") {
      let token: any;

      if (typeof localStorage.getItem("token") === 'string') {
        token = `Bearer ${JSON?.parse(localStorage.getItem("token") as string)}`

      } else {
        if (JSON.stringify(localStorage.getItem("token"))) {
          token = `Bearer ${JSON?.parse(JSON.stringify(localStorage.getItem("token")))}`

        }
      }
      // request.headers.set("token", this.authService.getToken());
      // request.headers.set("Content-Type", "application/json");

      // request.headers.set(
      //   "fingerPrint",
      //   this.cookieService.get("fingerPrint") || "123456"
      // );
      if (!request.url.includes("assets/i18n")) {
        request = request.clone({
          headers: request.headers
            .set("Authorization", token)
          // .set(
          //   "fingerPrint",
          //   this.cookieService.get("fingerPrint") || "123456"
          // ),
        });
      }

      if (request.url.includes("/notification/list")) {
        request = request.clone({
          headers: request.headers.set(
            "x-device-token",
            localStorage.getItem("deviceToken") as string
          ),
        });
      }
    } else if (request.method == "POST" || request.method == "PUT" || request.method == "DELETE") {
      if (
        request.url.includes("/SignIn") ||
        request.url.includes("/forgetPassword") ||
        request.url.includes("setNewPassword")
      ) {
        // request.body.fingerPrint =
        //   this.cookieService.get("fingerPrint") || "123456";
      } else {
        let token: any;

        if (typeof localStorage.getItem("token") === 'string') {
          token = `Bearer ${JSON?.parse(localStorage.getItem("token") as string)}`

        } else {
          if (JSON.stringify(localStorage.getItem("token"))) {
            token = `Bearer ${JSON?.parse(JSON.stringify(localStorage.getItem("token")))}`

          }
        }
        request = request.clone({
          headers: request.headers
            .set("Authorization", token)
          // .set(
          //   "fingerPrint",
          //   this.cookieService.get("fingerPrint") || "123456"
          // ),
        });

        // request.body.token = this.authService.getToken() || "";
        // request.body.fingerPrint = this.cookieService.get("fingerPrint") || "123456";
      }
    }

    return next.handle(request).pipe(
      catchError((error: any) => {
        let errorMsg = "";
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          if (error?.status == 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("fingerPrint");
            localStorage.removeItem("isLogin");
            localStorage.removeItem("deviceToken");
            localStorage.removeItem("me");
            localStorage.removeItem("rules");
            localStorage.removeItem("permissions");

            localStorage.clear();
            sessionStorage.clear();
            this.router.navigate(["/login"]);
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

                localStorage.clear();
                sessionStorage.clear();

                this.router.navigate(["/login"]);
              }
              this.toastservice.show({
                message: error?.error?.message,
                type: avilableTypes.Error,
              });
            }
          }
        }
        return throwError(() => error);
      })
    );
  }
}
