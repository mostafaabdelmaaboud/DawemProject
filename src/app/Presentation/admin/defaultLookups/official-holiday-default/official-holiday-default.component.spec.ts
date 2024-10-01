import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialHolidayDefaultComponent } from './official-holiday-default.component';

describe('OfficialHolidayDefaultComponent', () => {
  let component: OfficialHolidayDefaultComponent;
  let fixture: ComponentFixture<OfficialHolidayDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficialHolidayDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficialHolidayDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
