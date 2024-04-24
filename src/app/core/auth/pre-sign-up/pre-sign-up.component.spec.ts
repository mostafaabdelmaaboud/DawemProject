import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreSignUpComponent } from './pre-sign-up.component';

describe('PreSignUpComponent', () => {
  let component: PreSignUpComponent;
  let fixture: ComponentFixture<PreSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreSignUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
