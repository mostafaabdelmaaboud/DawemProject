import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSanctionFileComponent } from './dialog-sanction-file.component';

describe('DialogSanctionFileComponent', () => {
  let component: DialogSanctionFileComponent;
  let fixture: ComponentFixture<DialogSanctionFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogSanctionFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSanctionFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
