import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditASectionComponent } from './dialog-edit-a-section.component';

describe('DialogEditASectionComponent', () => {
  let component: DialogEditASectionComponent;
  let fixture: ComponentFixture<DialogEditASectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogEditASectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditASectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
