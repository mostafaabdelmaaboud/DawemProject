import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPlanInfoComponent } from './dialog-plan-info.component';

describe('DialogPlanInfoComponent', () => {
  let component: DialogPlanInfoComponent;
  let fixture: ComponentFixture<DialogPlanInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogPlanInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPlanInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
