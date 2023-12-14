import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTaskTypeFileComponent } from './dialog-task-type-file.component';

describe('DialogTaskTypeFileComponent', () => {
  let component: DialogTaskTypeFileComponent;
  let fixture: ComponentFixture<DialogTaskTypeFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogTaskTypeFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogTaskTypeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
