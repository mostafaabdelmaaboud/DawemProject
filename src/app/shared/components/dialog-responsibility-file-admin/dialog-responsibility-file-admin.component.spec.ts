import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResponsibilityFileAdminComponent } from './dialog-responsibility-file-admin.component';

describe('DialogResponsibilityFileAdminComponent', () => {
  let component: DialogResponsibilityFileAdminComponent;
  let fixture: ComponentFixture<DialogResponsibilityFileAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogResponsibilityFileAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogResponsibilityFileAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
