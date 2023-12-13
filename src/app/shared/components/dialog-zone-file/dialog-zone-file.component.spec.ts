import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogZoneFileComponent } from './dialog-zone-file.component';

describe('DialogZoneFileComponent', () => {
  let component: DialogZoneFileComponent;
  let fixture: ComponentFixture<DialogZoneFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogZoneFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogZoneFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
