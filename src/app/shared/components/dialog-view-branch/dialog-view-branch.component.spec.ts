import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogViewBranchComponent } from './dialog-view-branch.component';

describe('DialogViewBranchComponent', () => {
  let component: DialogViewBranchComponent;
  let fixture: ComponentFixture<DialogViewBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogViewBranchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogViewBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
