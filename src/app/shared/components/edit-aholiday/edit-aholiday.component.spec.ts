import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAholidayComponent } from './edit-aholiday.component';

describe('EditAholidayComponent', () => {
  let component: EditAholidayComponent;
  let fixture: ComponentFixture<EditAholidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ EditAholidayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAholidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
