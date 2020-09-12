import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { EditProduct } from 'src/app/actions/product.actions';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.less']
})
export class EditProductComponent implements OnInit {

  public product: Product;

  constructor(
    private store: Store,
    private router: Router,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(({id}) => {
        return this.http.get<Product>(`/products/${id}`);
      })
    ).subscribe(
      (product: Product) => {
        this.product = product;
      }
    );
  }

  save() {
    this.store.dispatch(new EditProduct(this.product)).subscribe(
      (res) => {
      },
      (err) => {
        this.message.error('Product couldn\'t be updated');
      },
      () => {
        this.message.success('Product has been updated successfully');
        this.router.navigate(['/products']);
      }
    );
  }

  updateModel(product: Product) {
    this.product = product;
  }
}
