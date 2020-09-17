import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { Select, Store } from '@ngxs/store';
import { ProductState } from 'src/app/states/product.state';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { GetProducts } from 'src/app/actions/product.actions';
import { AuthService } from 'src/app/auth.service';
import { filter, tap, map } from 'rxjs/operators';

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
  public products = [];

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new GetProducts());
    this.products$.subscribe((products) => {
      this.products = products;
    });
  }

  availableProducts() {
    return this.products ? this.products.filter(p => p.available === true) : [];
  }

  emitOrder() {
    this.orderChange.emit(this.order);
  }
}
