import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestJustificationTypeComponent } from './request-justification-type.component';

describe('RequestJustificationTypeComponent', () => {
  let component: RequestJustificationTypeComponent;
  let fixture: ComponentFixture<RequestJustificationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequestJustificationTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestJustificationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
