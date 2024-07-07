import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecallReportsComponent } from './recall-reports.component';

describe('RecallReportsComponent', () => {
  let component: RecallReportsComponent;
  let fixture: ComponentFixture<RecallReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecallReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecallReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
