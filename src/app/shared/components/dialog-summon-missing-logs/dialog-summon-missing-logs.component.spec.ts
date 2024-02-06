import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSummonMissingLogsComponent } from './dialog-summon-missing-logs.component';

describe('DialogSummonMissingLogsComponent', () => {
  let component: DialogSummonMissingLogsComponent;
  let fixture: ComponentFixture<DialogSummonMissingLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogSummonMissingLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSummonMissingLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
