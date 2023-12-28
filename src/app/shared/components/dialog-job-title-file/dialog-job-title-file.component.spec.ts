import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogJobTitleFileComponent } from './dialog-job-title-file.component';

describe('DialogJobTitleFileComponent', () => {
  let component: DialogJobTitleFileComponent;
  let fixture: ComponentFixture<DialogJobTitleFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogJobTitleFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogJobTitleFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
