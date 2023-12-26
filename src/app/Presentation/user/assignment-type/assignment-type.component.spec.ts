import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentTypeComponent } from './assignment-type.component';

describe('AssignmentTypeComponent', () => {
  let component: AssignmentTypeComponent;
  let fixture: ComponentFixture<AssignmentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
