import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { Select, Store } from '@ngxs/store';
import { ProductState } from 'src/app/states/product.state';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { GetProducts } from 'src/app/actions/product.actions';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.less']
})
export class OrderFormComponent implements OnInit {

  @Select(ProductState.getProducts) products$: Observable<Product[]>;

  @Input() order: Order;
  @Output() orderChange: EventEmitter<Order> = new EventEmitter();

  public prod = null;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new GetProducts());
  }

  emitOrder() {
    this.orderChange.emit(this.order);
  }
}
