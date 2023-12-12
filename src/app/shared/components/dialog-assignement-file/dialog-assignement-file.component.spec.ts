import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAssignementFileComponent } from './dialog-assignement-file.component';

describe('DialogAssignementFileComponent', () => {
  let component: DialogAssignementFileComponent;
  let fixture: ComponentFixture<DialogAssignementFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogAssignementFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAssignementFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
