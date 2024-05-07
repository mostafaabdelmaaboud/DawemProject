import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCompanyFileAdminComponent } from './dialog-company-file-admin.component';

describe('DialogCompanyFileAdminComponent', () => {
  let component: DialogCompanyFileAdminComponent;
  let fixture: ComponentFixture<DialogCompanyFileAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogCompanyFileAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCompanyFileAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
