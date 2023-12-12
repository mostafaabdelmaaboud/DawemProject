import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTaskFileComponent } from './dialog-task-file.component';

describe('DialogTaskFileComponent', () => {
  let component: DialogTaskFileComponent;
  let fixture: ComponentFixture<DialogTaskFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogTaskFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogTaskFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
