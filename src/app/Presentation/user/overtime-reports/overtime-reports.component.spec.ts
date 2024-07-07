import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeReportsComponent } from './overtime-reports.component';

describe('OvertimeReportsComponent', () => {
  let component: OvertimeReportsComponent;
  let fixture: ComponentFixture<OvertimeReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OvertimeReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvertimeReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
