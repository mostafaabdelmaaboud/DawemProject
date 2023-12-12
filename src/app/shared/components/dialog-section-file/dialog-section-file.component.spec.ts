import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSectionFileComponent } from './dialog-section-file.component';

describe('DialogSectionFileComponent', () => {
  let component: DialogSectionFileComponent;
  let fixture: ComponentFixture<DialogSectionFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogSectionFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSectionFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
