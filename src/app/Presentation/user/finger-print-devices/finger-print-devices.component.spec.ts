import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FingerPrintDevicesComponent } from './finger-print-devices.component';

describe('FingerPrintDevicesComponent', () => {
  let component: FingerPrintDevicesComponent;
  let fixture: ComponentFixture<FingerPrintDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FingerPrintDevicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FingerPrintDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
