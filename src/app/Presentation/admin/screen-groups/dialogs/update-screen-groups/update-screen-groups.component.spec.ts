import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateScreenGroupsComponent } from './update-screen-groups.component';

describe('UpdateScreenGroupsComponent', () => {
  let component: UpdateScreenGroupsComponent;
  let fixture: ComponentFixture<UpdateScreenGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UpdateScreenGroupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateScreenGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
