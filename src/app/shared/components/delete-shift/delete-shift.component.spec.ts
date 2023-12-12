import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteShiftComponent } from './delete-shift.component';

describe('DeleteShiftComponent', () => {
  let component: DeleteShiftComponent;
  let fixture: ComponentFixture<DeleteShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DeleteShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
