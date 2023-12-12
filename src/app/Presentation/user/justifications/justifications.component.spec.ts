import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificationsComponent } from './justifications.component';

describe('JustificationsComponent', () => {
  let component: JustificationsComponent;
  let fixture: ComponentFixture<JustificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JustificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JustificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
