import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddAOfficialComponent } from './dialog-add-a-official.component';

describe('DialogAddAOfficialComponent', () => {
  let component: DialogAddAOfficialComponent;
  let fixture: ComponentFixture<DialogAddAOfficialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogAddAOfficialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAddAOfficialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
