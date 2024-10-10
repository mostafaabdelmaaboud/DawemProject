import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftTypeDefaultComponent } from './shift-type-default.component';

describe('ShiftTypeDefaultComponent', () => {
  let component: ShiftTypeDefaultComponent;
  let fixture: ComponentFixture<ShiftTypeDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftTypeDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftTypeDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
