import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestJobTitleComponent } from './request-job-title.component';

describe('RequestJobTitleComponent', () => {
  let component: RequestJobTitleComponent;
  let fixture: ComponentFixture<RequestJobTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequestJobTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestJobTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
