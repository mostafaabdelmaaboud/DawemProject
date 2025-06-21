import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestOvertimeTypeComponent } from './request-overtime-type.component';

describe('RequestOvertimeTypeComponent', () => {
  let component: RequestOvertimeTypeComponent;
  let fixture: ComponentFixture<RequestOvertimeTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequestOvertimeTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestOvertimeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
