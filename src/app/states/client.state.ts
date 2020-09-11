import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators';
import { AddNewClient, DeleteClient, EditClient, GetClients } from './../actions/client.actions';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Client } from '../models/client.model';

export class ClientStateModel {
  clients: Client[];
}

@State<ClientStateModel>({
  name: 'clients',
  defaults: {
    clients: null
  }
})

export class ClientState {

  public fluenceServerURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  @Selector()
  static getClients(state: ClientStateModel) {
    return state.clients;
  }

  @Action(AddNewClient)
  addNewClient(ctx: StateContext<ClientStateModel>, action: AddNewClient) {
    const state = ctx.getState();
    return this.http.post<Client>(`${this.fluenceServerURL}/clients`, action.client).pipe(
      tap(client => {
        ctx.patchState({
          clients: [ ...state.clients, client ]
        });
      })
    );
  }

  @Action(GetClients)
  getClients(ctx: StateContext<ClientStateModel>) {
    return this.http.get<Client[]>(`${this.fluenceServerURL}/clients`).pipe(
      tap(clients => {
        ctx.patchState({
          clients
        });
      })
    );
  }

  @Action(EditClient)
  editClient(ctx: StateContext<ClientStateModel>, action: EditClient) {
    return this.http.patch<Client>(`${this.fluenceServerURL}/clients/${action.client._id}`, action.client).pipe(
      tap(() => {
        ctx.setState(
          patch({
            clients: updateItem(client => client._id === action.client._id, action.client)
          })
        );
      })
    );
  }

  @Action(DeleteClient)
  deleteClient(ctx: StateContext<ClientStateModel>, action: DeleteClient) {
    return this.http.delete<Client>(`${this.fluenceServerURL}/clients/${action.client._id}`).pipe(
      tap(() => {
        ctx.setState(
          patch({
            clients: removeItem(client => client._id === action.client._id)
          })
        );
      })
    );
  }
}
