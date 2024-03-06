import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentLang = localStorage.getItem("lang");

  constructor(private translate: TranslateService) {
    document.documentElement.setAttribute('lang', 'ar');
    translate.setDefaultLang('ar');
    this.translate.use("ar");

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

}
