import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceReportsComponent } from './absence-reports.component';

describe('AbsenceReportsComponent', () => {
  let component: AbsenceReportsComponent;
  let fixture: ComponentFixture<AbsenceReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsenceReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsenceReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
