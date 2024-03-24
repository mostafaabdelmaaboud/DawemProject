import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUploadFileProgressBarComponent } from './dialog-upload-file-progress-bar.component';

describe('DialogUploadFileProgressBarComponent', () => {
  let component: DialogUploadFileProgressBarComponent;
  let fixture: ComponentFixture<DialogUploadFileProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogUploadFileProgressBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUploadFileProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
