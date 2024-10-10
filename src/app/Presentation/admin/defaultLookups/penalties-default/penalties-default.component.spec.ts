import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltiesDefaultComponent } from './penalties-default.component';

describe('PenaltiesDefaultComponent', () => {
  let component: PenaltiesDefaultComponent;
  let fixture: ComponentFixture<PenaltiesDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PenaltiesDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltiesDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
