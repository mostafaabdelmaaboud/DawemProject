import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonsDetailsInPeriodComponent } from './summons-details-in-period.component';

describe('SummonsDetailsInPeriodComponent', () => {
  let component: SummonsDetailsInPeriodComponent;
  let fixture: ComponentFixture<SummonsDetailsInPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummonsDetailsInPeriodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummonsDetailsInPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
