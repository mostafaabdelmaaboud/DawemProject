import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAssignmentTypeComponent } from './request-assignment-type.component';

describe('RequestAssignmentTypeComponent', () => {
  let component: RequestAssignmentTypeComponent;
  let fixture: ComponentFixture<RequestAssignmentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequestAssignmentTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestAssignmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
