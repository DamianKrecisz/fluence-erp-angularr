import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProductState } from 'src/app/states/product.state';
import { GetProducts, DeleteProduct } from 'src/app/actions/product.actions';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.less']
})
export class ProductsTableComponent implements OnInit {

  @Select(ProductState.getProducts) products$: Observable<Product[]>;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new GetProducts());
  }

  deleteProduct(product) {
    this.store.dispatch(new DeleteProduct(product));
  }
}
