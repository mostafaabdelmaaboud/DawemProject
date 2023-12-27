import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFingerPrintDeviceFileComponent } from './dialog-finger-print-device-file.component';

describe('DialogFingerPrintDeviceFileComponent', () => {
  let component: DialogFingerPrintDeviceFileComponent;
  let fixture: ComponentFixture<DialogFingerPrintDeviceFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogFingerPrintDeviceFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogFingerPrintDeviceFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
