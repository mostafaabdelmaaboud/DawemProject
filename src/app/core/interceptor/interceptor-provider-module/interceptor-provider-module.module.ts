import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpConfigInterceptor } from '../../interceptors/HttpConfigInterceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },

  ]
})
export class InterceptorProviderModuleModule { }
