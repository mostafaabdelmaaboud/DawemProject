import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeTypeComponent } from './overtime-type.component';

describe('OvertimeTypeComponent', () => {
  let component: OvertimeTypeComponent;
  let fixture: ComponentFixture<OvertimeTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OvertimeTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvertimeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
