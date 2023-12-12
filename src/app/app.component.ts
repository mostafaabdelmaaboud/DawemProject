import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('ar');
    translate.use('ar');


  }
  //   changeLang(lang: string) {
  //     this.translate.use(lang);
  //   }
  //   constructor(public translate: TranslateService, public primeNGConfig: PrimeNGConfig) {
  //     translate.addLangs(['en', 'ar']);
  //     translate.setDefaultLang('ar');

  //     const browserLang: any = translate.getBrowserLang();
  //     let lang = browserLang.match(/ar|en/) ? browserLang : 'ar';
  //     this.changeLang(lang);

  //     this.translate.stream('primeng').subscribe(data => {
  //       this.primeNGConfig.setTranslation(data);
  //     });
  //   }
  // }
}
