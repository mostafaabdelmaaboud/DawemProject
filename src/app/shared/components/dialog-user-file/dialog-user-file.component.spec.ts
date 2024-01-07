import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUserFileComponent } from './dialog-user-file.component';

describe('DialogUserFileComponent', () => {
  let component: DialogUserFileComponent;
  let fixture: ComponentFixture<DialogUserFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogUserFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUserFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
