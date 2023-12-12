import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddTimeComponent } from './dialog-add-time.component';

describe('DialogAddTimeComponent', () => {
  let component: DialogAddTimeComponent;
  let fixture: ComponentFixture<DialogAddTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogAddTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAddTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
