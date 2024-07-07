import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDataReportsComponent } from './basic-data-reports.component';

describe('BasicDataReportsComponent', () => {
  let component: BasicDataReportsComponent;
  let fixture: ComponentFixture<BasicDataReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicDataReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicDataReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
