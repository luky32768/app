import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewemailComponent } from './newemail.component';

describe('NewemailComponent', () => {
  let component: NewemailComponent;
  let fixture: ComponentFixture<NewemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewemailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
