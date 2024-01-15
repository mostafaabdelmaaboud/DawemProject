import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { LoginGuard } from './core/guard/login.guard';
import { NotPermissionComponent } from './layout/not-permission/not-permission.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: '', loadChildren: () => import('./core/auth/auth.module').then((m) => m.AuthModule), canActivate: [LoginGuard] },
  { path: 'user', loadChildren: () => import('./Presentation/user/user.module').then(m => m.UserModule), canActivate: [AuthGuard] },
  { path: "notPermission", component: NotPermissionComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
