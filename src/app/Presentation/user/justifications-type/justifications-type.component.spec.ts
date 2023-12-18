import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificationsTypeComponent } from './justifications-type.component';

describe('JustificationsTypeComponent', () => {
  let component: JustificationsTypeComponent;
  let fixture: ComponentFixture<JustificationsTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JustificationsTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JustificationsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
