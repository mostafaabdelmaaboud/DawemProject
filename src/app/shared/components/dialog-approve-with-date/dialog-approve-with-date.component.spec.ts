import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogApproveWithDateComponent } from './dialog-approve-with-date.component';

describe('DialogApproveWithDateComponent', () => {
  let component: DialogApproveWithDateComponent;
  let fixture: ComponentFixture<DialogApproveWithDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogApproveWithDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogApproveWithDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
