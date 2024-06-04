import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenGroupsComponent } from './screen-groups.component';

describe('ScreenGroupsComponent', () => {
  let component: ScreenGroupsComponent;
  let fixture: ComponentFixture<ScreenGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenGroupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
