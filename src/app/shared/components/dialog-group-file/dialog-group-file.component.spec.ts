import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGroupFileComponent } from './dialog-group-file.component';

describe('DialogGroupFileComponent', () => {
  let component: DialogGroupFileComponent;
  let fixture: ComponentFixture<DialogGroupFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogGroupFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogGroupFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
