import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationTypeDefaultComponent } from './vacation-type-default.component';

describe('VacationTypeDefaultComponent', () => {
  let component: VacationTypeDefaultComponent;
  let fixture: ComponentFixture<VacationTypeDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacationTypeDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacationTypeDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
