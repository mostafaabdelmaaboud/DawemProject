import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTaskComponent } from './request-task.component';

describe('RequestTaskComponent', () => {
  let component: RequestTaskComponent;
  let fixture: ComponentFixture<RequestTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequestTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
