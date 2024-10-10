import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificationTypeDefaultComponent } from './justification-type-default.component';

describe('JustificationTypeDefaultComponent', () => {
  let component: JustificationTypeDefaultComponent;
  let fixture: ComponentFixture<JustificationTypeDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JustificationTypeDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JustificationTypeDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
