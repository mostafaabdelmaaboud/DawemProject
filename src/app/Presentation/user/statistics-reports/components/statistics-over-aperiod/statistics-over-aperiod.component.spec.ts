import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsOverAperiodComponent } from './statistics-over-aperiod.component';

describe('StatisticsOverAperiodComponent', () => {
  let component: StatisticsOverAperiodComponent;
  let fixture: ComponentFixture<StatisticsOverAperiodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticsOverAperiodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticsOverAperiodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
