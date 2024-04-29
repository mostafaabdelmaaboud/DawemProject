import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { LoginGuard } from './core/guard/login.guard';
import { NotPermissionComponent } from './layout/not-permission/not-permission.component';
import { LoginAdminGuard } from './core/guard/login-admin.guard';
import { AuthAdminGuard } from './core/guard/auth-admin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', loadChildren: () => import('./core/auth/auth.module').then((m) => m.AuthModule), canActivate: [LoginGuard] },
  { path: 'adminPanel', loadChildren: () => import('./core/auth-admin/auth.module').then((m) => m.AuthModule), canActivate: [LoginAdminGuard] },
  { path: 'admin', loadChildren: () => import('./Presentation/admin/admin.module').then((m) => m.AdminModule), canActivate: [AuthAdminGuard] },
  { path: 'user', loadChildren: () => import('./Presentation/user/user.module').then(m => m.UserModule), canActivate: [AuthGuard] },
  { path: "notPermission", component: NotPermissionComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
