import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTitlesDefaultComponent } from './job-titles-default.component';

describe('JobTitlesDefaultComponent', () => {
  let component: JobTitlesDefaultComponent;
  let fixture: ComponentFixture<JobTitlesDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobTitlesDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobTitlesDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
