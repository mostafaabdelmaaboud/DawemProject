import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestVacationTypeComponent } from './request-vacation-type.component';

describe('RequestVacationTypeComponent', () => {
  let component: RequestVacationTypeComponent;
  let fixture: ComponentFixture<RequestVacationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequestVacationTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestVacationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
