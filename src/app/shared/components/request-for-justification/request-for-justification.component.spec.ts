import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForJustificationComponent } from './request-for-justification.component';

describe('RequestForJustificationComponent', () => {
  let component: RequestForJustificationComponent;
  let fixture: ComponentFixture<RequestForJustificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequestForJustificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestForJustificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
