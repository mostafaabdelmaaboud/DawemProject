import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPermissionTypeComponent } from './request-permission-type.component';

describe('RequestPermissionTypeComponent', () => {
  let component: RequestPermissionTypeComponent;
  let fixture: ComponentFixture<RequestPermissionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequestPermissionTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestPermissionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
