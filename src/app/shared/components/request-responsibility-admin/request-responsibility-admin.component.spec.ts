import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestResponsibilityAdminComponent } from './request-responsibility-admin.component';

describe('RequestResponsibilityAdminComponent', () => {
  let component: RequestResponsibilityAdminComponent;
  let fixture: ComponentFixture<RequestResponsibilityAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequestResponsibilityAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestResponsibilityAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
