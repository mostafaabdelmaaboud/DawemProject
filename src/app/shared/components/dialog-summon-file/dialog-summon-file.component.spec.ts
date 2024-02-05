import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSummonFileComponent } from './dialog-summon-file.component';

describe('DialogSummonFileComponent', () => {
  let component: DialogSummonFileComponent;
  let fixture: ComponentFixture<DialogSummonFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogSummonFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSummonFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
