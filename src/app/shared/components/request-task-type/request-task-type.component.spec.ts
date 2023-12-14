import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTaskTypeComponent } from './request-task-type.component';

describe('RequestTaskTypeComponent', () => {
  let component: RequestTaskTypeComponent;
  let fixture: ComponentFixture<RequestTaskTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequestTaskTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestTaskTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
