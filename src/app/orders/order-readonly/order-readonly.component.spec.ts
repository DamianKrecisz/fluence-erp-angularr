import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReadonlyComponent } from './order-readonly.component';

describe('OrderReadonlyComponent', () => {
  let component: OrderReadonlyComponent;
  let fixture: ComponentFixture<OrderReadonlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderReadonlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
