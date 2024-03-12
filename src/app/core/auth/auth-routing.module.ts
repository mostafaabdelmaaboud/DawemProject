import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '../guard/auth.guard';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { CheckEmailComponent } from './check-email/check-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'sendEmail', component: SendEmailComponent },
  { path: 'checkEmail', component: CheckEmailComponent },
  { path: 'resetPassword', component: ResetPasswordComponent }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
