import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTypeDefaultComponent } from './task-type-default.component';

describe('TaskTypeDefaultComponent', () => {
  let component: TaskTypeDefaultComponent;
  let fixture: ComponentFixture<TaskTypeDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskTypeDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskTypeDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
