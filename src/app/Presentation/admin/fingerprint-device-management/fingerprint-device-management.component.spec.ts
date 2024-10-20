import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FingerprintDeviceManagementComponent } from './fingerprint-device-management.component';

describe('FingerprintDeviceManagementComponent', () => {
  let component: FingerprintDeviceManagementComponent;
  let fixture: ComponentFixture<FingerprintDeviceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FingerprintDeviceManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FingerprintDeviceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
