import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonMissingLogsComponent } from './summon-missing-logs.component';

describe('SummonMissingLogsComponent', () => {
  let component: SummonMissingLogsComponent;
  let fixture: ComponentFixture<SummonMissingLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummonMissingLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummonMissingLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
