import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateScreenComponent } from './update-screen.component';

describe('UpdateScreenComponent', () => {
  let component: UpdateScreenComponent;
  let fixture: ComponentFixture<UpdateScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UpdateScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
