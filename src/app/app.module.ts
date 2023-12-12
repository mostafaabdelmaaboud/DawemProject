import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpConfigInterceptor } from './core/interceptors/HttpConfigInterceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import en from "@angular/common/locales/en";
import { RouterModule } from '@angular/router';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { MatSnackBarModule } from '@angular/material/snack-bar';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, "./assets/i18n/", ".json");
}
registerLocaleData(en);


@NgModule({
  declarations: [
    AppComponent

  ],
  imports: [
    BrowserModule,
    RouterModule,
    // GoogleMapsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,

    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: localStorage.getItem('lang') || 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: true
    }),


  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },

    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
