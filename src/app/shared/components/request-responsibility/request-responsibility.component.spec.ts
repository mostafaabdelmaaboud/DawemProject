import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestResponsibilityComponent } from './request-responsibility.component';

describe('RequestResponsibilityComponent', () => {
  let component: RequestResponsibilityComponent;
  let fixture: ComponentFixture<RequestResponsibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequestResponsibilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestResponsibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
