import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedualPlanComponent } from './schedual-plan.component';

describe('SchedualPlanComponent', () => {
  let component: SchedualPlanComponent;
  let fixture: ComponentFixture<SchedualPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedualPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedualPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
