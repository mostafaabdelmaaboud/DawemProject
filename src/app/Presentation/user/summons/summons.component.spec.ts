import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonsComponent } from './summons.component';

describe('SummonsComponent', () => {
  let component: SummonsComponent;
  let fixture: ComponentFixture<SummonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
