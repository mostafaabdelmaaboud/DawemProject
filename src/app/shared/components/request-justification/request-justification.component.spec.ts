import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestJustificationComponent } from './request-justification.component';

describe('RequestJustificationComponent', () => {
  let component: RequestJustificationComponent;
  let fixture: ComponentFixture<RequestJustificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequestJustificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestJustificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
