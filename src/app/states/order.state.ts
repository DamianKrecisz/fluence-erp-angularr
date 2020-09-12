import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators';
import { Order } from '../models/order.model';
import { AddNewOrder, DeleteOrder, EditOrder, GetOrders, GetOrder } from './../actions/order.actions';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';

export class OrderStateModel {
  orders: Order[];
}

@State<OrderStateModel>({
  name: 'orders',
  defaults: {
    orders: null
  }
})

export class OrderState {

  public fluenceServerURL = '';

  constructor(private http: HttpClient) {}

  @Selector()
  static getOrders(state: OrderStateModel) {
    return state.orders;
  }

  @Action(AddNewOrder)
  addNewOrder(ctx: StateContext<OrderStateModel>, action: AddNewOrder) {
    const state = ctx.getState();
    return this.http.post<Order>(`${this.fluenceServerURL}/orders`, action.order).pipe(
      tap(order => {
        ctx.patchState({
          orders: [ ...state.orders, order ]
        });
      }),
    );
  }

  @Action(GetOrders)
  getOrders(ctx: StateContext<OrderStateModel>) {
    return this.http.get<Order[]>(`${this.fluenceServerURL}/orders`).pipe(
      tap(orders => {
        ctx.patchState({
          orders
        });
      })
    );
  }

  @Action(GetOrder)
  getOrder(ctx: StateContext<OrderStateModel>, action: GetOrder) {
    return this.http.get<Order>(`${this.fluenceServerURL}/orders/${action.orderId}`);
  }

  @Action(EditOrder)
  editOrder(ctx: StateContext<OrderStateModel>, action: EditOrder) {
    return this.http.patch<Order>(`${this.fluenceServerURL}/orders/${action.order._id}`, action.order).pipe(
      tap(() => {
        ctx.setState(
          patch({
            orders: updateItem(order => order._id === action.order._id, action.order)
          })
        );
      })
    );
  }

  @Action(DeleteOrder)
  deleteOrder(ctx: StateContext<OrderStateModel>, action: DeleteOrder) {
    return this.http.delete<Order>(`${this.fluenceServerURL}/orders/${action.order._id}`).pipe(
      tap(() => {
        ctx.setState(
          patch({
            orders: removeItem(order => order._id === action.order._id)
          })
        );
      })
    );
  }
}
