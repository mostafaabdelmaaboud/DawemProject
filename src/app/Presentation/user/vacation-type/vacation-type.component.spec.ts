import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationTypeComponent } from './vacation-type.component';

describe('VacationTypeComponent', () => {
  let component: VacationTypeComponent;
  let fixture: ComponentFixture<VacationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacationTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
