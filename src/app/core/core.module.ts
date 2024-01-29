import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SideNavBarComponent } from '../layout/side-nav-bar/side-nav-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { InputTextModule } from 'primeng/inputtext';
import { MatDialogModule } from '@angular/material/dialog';

import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from './guard/auth.guard';
import { NotPermissionComponent } from '../layout/not-permission/not-permission.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SideNavBarComponent,
    NotPermissionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    NgbDropdownModule,
    ScrollingModule,
    MatSidenavModule,
    MatDialogModule,
    MatListModule,
    NzLayoutModule,
    NzMenuModule,
    MatButtonModule,
    NzIconModule,
    NzSelectModule,
    InputTextModule,

  ],
  providers: [CookieService, AuthGuard],

})
export class CoreModule { }
