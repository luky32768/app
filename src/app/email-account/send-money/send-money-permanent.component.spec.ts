import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMoneyPermanentComponent } from './send-money-permanent.component';

describe('SendMoneyPermanentComponent', () => {
  let component: SendMoneyPermanentComponent;
  let fixture: ComponentFixture<SendMoneyPermanentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendMoneyPermanentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMoneyPermanentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
