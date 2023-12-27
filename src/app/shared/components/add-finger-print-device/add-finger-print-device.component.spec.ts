import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFingerPrintDeviceComponent } from './add-finger-print-device.component';

describe('AddFingerPrintDeviceComponent', () => {
  let component: AddFingerPrintDeviceComponent;
  let fixture: ComponentFixture<AddFingerPrintDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AddFingerPrintDeviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFingerPrintDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
