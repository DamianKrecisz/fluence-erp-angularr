import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators';
import { Product } from '../models/product.model';
import { AddNewProduct, DeleteProduct, EditProduct, GetProducts } from './../actions/product.actions';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';

export class ProductStateModel {
  products: Product[];
}

@State<ProductStateModel>({
  name: 'products',
  defaults: {
    products: null
  }
})

export class ProductState {

  public fluenceServerURL = '';

  constructor(private http: HttpClient) {}

  @Selector()
  static getProducts(state: ProductStateModel) {
    return state.products;
  }

  @Action(AddNewProduct)
  addNewProduct(ctx: StateContext<ProductStateModel>, action: AddNewProduct) {
    const state = ctx.getState();
    return this.http.post<Product>(`${this.fluenceServerURL}/products`, action.product).pipe(
      tap(product => {
        ctx.patchState({
          products: [ ...state.products, product ]
        });
      })
    );
  }

  @Action(GetProducts)
  getProducts(ctx: StateContext<ProductStateModel>) {
    return this.http.get<Product[]>(`${this.fluenceServerURL}/products`).pipe(
      tap(products => {
        ctx.patchState({
          products
        });
      })
    );
  }

  @Action(EditProduct)
  editProduct(ctx: StateContext<ProductStateModel>, action: EditProduct) {
    return this.http.patch<Product>(`${this.fluenceServerURL}/products/${action.product._id}`, action.product).pipe(
      tap(() => {
        ctx.setState(
          patch({
            products: updateItem(product => product._id === action.product._id, action.product)
          })
        );
      })
    );
  }

  @Action(DeleteProduct)
  deleteProduct(ctx: StateContext<ProductStateModel>, action: DeleteProduct) {
    return this.http.delete<Product>(`${this.fluenceServerURL}/products/${action.product._id}`).pipe(
      tap(() => {
        ctx.setState(
          patch({
            products: removeItem(product => product._id === action.product._id)
          })
        );
      })
    );
  }
}
