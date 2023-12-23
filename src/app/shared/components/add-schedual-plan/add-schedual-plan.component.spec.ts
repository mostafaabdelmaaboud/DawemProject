import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSchedualPlanComponent } from './add-schedual-plan.component';

describe('AddSchedualPlanComponent', () => {
  let component: AddSchedualPlanComponent;
  let fixture: ComponentFixture<AddSchedualPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AddSchedualPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSchedualPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
