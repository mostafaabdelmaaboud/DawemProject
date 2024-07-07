import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayReportsComponent } from './delay-reports.component';

describe('DelayReportsComponent', () => {
  let component: DelayReportsComponent;
  let fixture: ComponentFixture<DelayReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelayReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelayReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
