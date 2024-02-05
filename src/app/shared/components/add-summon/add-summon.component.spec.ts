import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSummonComponent } from './add-summon.component';

describe('AddSummonComponent', () => {
  let component: AddSummonComponent;
  let fixture: ComponentFixture<AddSummonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AddSummonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSummonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
