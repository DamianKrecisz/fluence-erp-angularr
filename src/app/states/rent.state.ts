import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Rent } from '../models/rent.model';
import { AddNewRent, GetRents, EditRent, DeleteRent } from '../actions/rent.actions';

export class RentStateModel {
  rents: Rent[];
}

@State<RentStateModel>({
  name: 'rents',
  defaults: {
    rents: null
  }
})

export class RentState {

    public fluenceServerURL = '';

    constructor(private http: HttpClient) {}
  
    @Selector()
    static getRents(state: RentStateModel) {
      return state.rents;
    }
  
    @Action(AddNewRent)
    addNewRent(ctx: StateContext<RentStateModel>, action: AddNewRent) {
      const state = ctx.getState();
      return this.http.post<Rent>(`${this.fluenceServerURL}/rents`, action.rent).pipe(
        tap(rent => {
          ctx.patchState({
            rents: [ ...state.rents, rent ]
          });
        })
      );
    }
  
    @Action(GetRents)
    getRents(ctx: StateContext<RentStateModel>) {
      return this.http.get<Rent[]>(`${this.fluenceServerURL}/rents`).pipe(
        tap(rents => {
          ctx.patchState({
            rents
          });
        })
      );
    }
  
    @Action(EditRent)
    editRent(ctx: StateContext<RentStateModel>, action: EditRent) {
      return this.http.patch<Rent>(`${this.fluenceServerURL}/rents/${action.rent._id}`, action.rent).pipe(
        tap(() => {
          ctx.setState(
            patch({
             rents: updateItem(rent => rent._id === action.rent._id, action.rent)
            })
          );
        })
      );
    }
  
    @Action(DeleteRent)
    deleteRent(ctx: StateContext<RentStateModel>, action: DeleteRent) {
      return this.http.delete<Rent>(`${this.fluenceServerURL}/rents/${action.rent._id}`).pipe(
        tap(() => {
          ctx.setState(
            patch({
              rents: removeItem(rent => rent._id === action.rent._id)
            })
          );
        })
      );
    }
  }