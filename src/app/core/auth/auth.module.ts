import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { CheckEmailComponent } from './check-email/check-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { PreSignUpComponent } from './pre-sign-up/pre-sign-up.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
    SendEmailComponent,
    CheckEmailComponent,
    ResetPasswordComponent,
    PreSignUpComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    TranslateModule,
    MatRadioModule,
    DropdownModule,
    SharedModule,
    MatDialogModule


  ]
})
export class AuthModule { }
