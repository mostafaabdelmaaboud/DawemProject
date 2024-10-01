import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupFileComponent } from './lookup-file.component';

describe('LookupFileComponent', () => {
  let component: LookupFileComponent;
  let fixture: ComponentFixture<LookupFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LookupFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookupFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
