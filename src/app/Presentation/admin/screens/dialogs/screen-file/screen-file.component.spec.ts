import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenFileComponent } from './screen-file.component';

describe('ScreenFileComponent', () => {
  let component: ScreenFileComponent;
  let fixture: ComponentFixture<ScreenFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ScreenFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
