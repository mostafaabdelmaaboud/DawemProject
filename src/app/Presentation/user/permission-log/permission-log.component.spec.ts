import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionLogComponent } from './permission-log.component';

describe('PermissionLogComponent', () => {
  let component: PermissionLogComponent;
  let fixture: ComponentFixture<PermissionLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
