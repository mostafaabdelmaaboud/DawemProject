import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResponsibilityFileComponent } from './dialog-responsibility-file.component';

describe('DialogResponsibilityFileComponent', () => {
  let component: DialogResponsibilityFileComponent;
  let fixture: ComponentFixture<DialogResponsibilityFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogResponsibilityFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogResponsibilityFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
