import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenGroupFileComponent } from './screen-group-file.component';

describe('ScreenGroupFileComponent', () => {
  let component: ScreenGroupFileComponent;
  let fixture: ComponentFixture<ScreenGroupFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ScreenGroupFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenGroupFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
