import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavBarAdminComponent } from './side-nav-bar-admin.component';

describe('SideNavBarAdminComponent', () => {
  let component: SideNavBarAdminComponent;
  let fixture: ComponentFixture<SideNavBarAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideNavBarAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideNavBarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
