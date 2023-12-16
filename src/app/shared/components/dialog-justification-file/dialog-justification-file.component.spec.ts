import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogJustificationFileComponent } from './dialog-justification-file.component';

describe('DialogJustificationFileComponent', () => {
  let component: DialogJustificationFileComponent;
  let fixture: ComponentFixture<DialogJustificationFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogJustificationFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogJustificationFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
