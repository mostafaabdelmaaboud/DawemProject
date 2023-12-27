import { TestBed } from '@angular/core/testing';

import { FingerPrintDevicesService } from './finger-print-devices.service';

describe('FingerPrintDevicesService', () => {
  let service: FingerPrintDevicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FingerPrintDevicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
