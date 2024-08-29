import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentsReportComponent } from './departments-report.component';

describe('DepartmentsReportComponent', () => {
  let component: DepartmentsReportComponent;
  let fixture: ComponentFixture<DepartmentsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
