import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForPermissionComponent } from './request-for-permission.component';

describe('RequestForPermissionComponent', () => {
  let component: RequestForPermissionComponent;
  let fixture: ComponentFixture<RequestForPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequestForPermissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestForPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
