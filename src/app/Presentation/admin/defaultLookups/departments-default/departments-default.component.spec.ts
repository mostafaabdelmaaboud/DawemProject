import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentsDefaultComponent } from './departments-default.component';

describe('DepartmentsDefaultComponent', () => {
  let component: DepartmentsDefaultComponent;
  let fixture: ComponentFixture<DepartmentsDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentsDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentsDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
