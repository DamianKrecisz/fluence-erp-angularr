import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Reservation } from '../models/reservation.model';
import { AddNewReservation, GetReservations, EditReservation, DeleteReservation } from '../actions/reservation.action';

export class ReservationStateModel {
  reservations: Reservation[];
}

@State<ReservationStateModel>({
  name: 'reservations',
  defaults: {
    reservations: null
  }
})

export class ReservationState {

  public fluenceServerURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  @Selector()
  static getReservations(state: ReservationStateModel) {
    return state.reservations;
  }

  @Action(AddNewReservation)
  addNewReservation(ctx: StateContext<ReservationStateModel>, action: AddNewReservation) {
    const state = ctx.getState();
    return this.http.post<Reservation>(`${this.fluenceServerURL}/reservations`, action.reservation).pipe(
      tap(reservation => {
        ctx.patchState({
          reservations: [ ...state.reservations, reservation ]
        });
      })
    );
  }

  @Action(GetReservations)
  getReservations(ctx: StateContext<ReservationStateModel>) {
    return this.http.get<Reservation[]>(`${this.fluenceServerURL}/reservations`).pipe(
      tap(reservations => {
        ctx.patchState({
          reservations
        });
      })
    );
  }

  @Action(EditReservation)
  editReservation(ctx: StateContext<ReservationStateModel>, action: EditReservation) {
    return this.http.patch<Reservation>(`${this.fluenceServerURL}/reservations/${action.reservation._id}`, action.reservation).pipe(
      tap(() => {
        ctx.setState(
          patch({
           reservations: updateItem(reservation => reservation._id === action.reservation._id, action.reservation)
          })
        );
      })
    );
  }

  @Action(DeleteReservation)
  deleteReservation(ctx: StateContext<ReservationStateModel>, action: DeleteReservation) {
    return this.http.delete<Reservation>(`${this.fluenceServerURL}/reservations/${action.reservation._id}`).pipe(
      tap(() => {
        ctx.setState(
          patch({
            reservations: removeItem(reservation => reservation._id === action.reservation._id)
          })
        );
      })
    );
  }
}
