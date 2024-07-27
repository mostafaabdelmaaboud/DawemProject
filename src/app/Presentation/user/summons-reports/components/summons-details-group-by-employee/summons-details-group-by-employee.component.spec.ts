import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonsDetailsGroupByEmployeeComponent } from './summons-details-group-by-employee.component';

describe('SummonsDetailsGroupByEmployeeComponent', () => {
  let component: SummonsDetailsGroupByEmployeeComponent;
  let fixture: ComponentFixture<SummonsDetailsGroupByEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummonsDetailsGroupByEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummonsDetailsGroupByEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
