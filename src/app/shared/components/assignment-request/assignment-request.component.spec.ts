import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentRequestComponent } from './assignment-request.component';

describe('AssignmentRequestComponent', () => {
  let component: AssignmentRequestComponent;
  let fixture: ComponentFixture<AssignmentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AssignmentRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
