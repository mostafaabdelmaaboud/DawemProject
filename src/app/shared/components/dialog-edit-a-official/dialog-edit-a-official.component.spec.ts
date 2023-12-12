import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditAOfficialComponent } from './dialog-edit-a-official.component';

describe('DialogEditAOfficialComponent', () => {
  let component: DialogEditAOfficialComponent;
  let fixture: ComponentFixture<DialogEditAOfficialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogEditAOfficialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditAOfficialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
