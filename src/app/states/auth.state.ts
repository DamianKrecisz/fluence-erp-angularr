import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators';
import { AddNewOrder, DeleteOrder, EditOrder, GetOrders } from './../actions/order.actions';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { tap, map, shareReplay } from 'rxjs/operators';
import { Login } from '../actions/auth.actions';

export class AuthStateModel {
  currentUser: string;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    currentUser: null
  }
})

export class AuthState {

}
