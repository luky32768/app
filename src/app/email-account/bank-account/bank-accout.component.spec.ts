import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccoutComponent } from './bank-accout.component';

describe('BankAccoutComponent', () => {
  let component: BankAccoutComponent;
  let fixture: ComponentFixture<BankAccoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
