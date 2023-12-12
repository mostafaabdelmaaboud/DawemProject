import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddASectionComponent } from './dialog-add-a-section.component';

describe('DialogAddASectionComponent', () => {
  let component: DialogAddASectionComponent;
  let fixture: ComponentFixture<DialogAddASectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogAddASectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAddASectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
