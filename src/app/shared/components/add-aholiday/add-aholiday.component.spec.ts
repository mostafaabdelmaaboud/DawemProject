import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAholidayComponent } from './add-aholiday.component';

describe('AddAholidayComponent', () => {
  let component: AddAholidayComponent;
  let fixture: ComponentFixture<AddAholidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AddAholidayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAholidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
