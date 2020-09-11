import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { Store, Select } from '@ngxs/store';
import { AddNewProduct, GetProducts } from 'src/app/actions/product.actions';
import { Observable } from 'rxjs';
import { ProductState } from 'src/app/states/product.state';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.less']
})
export class AddProductComponent implements OnInit {

  @Select(ProductState.getProducts) products$: Observable<Product[]>;

  public product = new Product();

  constructor(private store: Store, private message: NzMessageService, private router: Router) { }

  ngOnInit() {
    this.store.dispatch(new GetProducts());
  }

  addNewProduct() {
    this.store.dispatch(new AddNewProduct(this.product)).subscribe(
      () => {
        this.message.success('Product has been added successfully');
        this.router.navigate(['/products']);
      },
      (err) => {
        this.message.error('Product couldn\'t be added');
        console.error(err);
      }
    );
  }
}
