import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateCompanyRoutingModule } from './update-company-routing.module';
import { UpdateCompanyComponent } from './update-company.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { GooglePlaceDirective, GooglePlaceModule } from 'ngx-google-places-autocomplete-esb';
import { AgmCircle, AgmCoreModule } from '@agm/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ImageCropperModule } from 'ngx-image-cropper';


@NgModule({
  declarations: [
    UpdateCompanyComponent
  ],
  imports: [
    CommonModule,
    UpdateCompanyRoutingModule,
    TranslateModule,
    ImageCropperModule,
    InputTextareaModule,
    MatRadioModule,
    FileUploadModule,
    DropdownModule,
    SharedModule,
    AgmCoreModule,
    InputSwitchModule,
    MatDialogModule
  ],
  providers: [GooglePlaceDirective]

})
export class UpdateCompanyModule { }
