import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVacationBalanceFileComponent } from './dialog-vacation-balance-file.component';

describe('DialogVacationBalanceFileComponent', () => {
  let component: DialogVacationBalanceFileComponent;
  let fixture: ComponentFixture<DialogVacationBalanceFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogVacationBalanceFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogVacationBalanceFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
