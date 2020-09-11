import { Reservation } from '../models/reservation.model';

export class AddNewReservation {
  static readonly type = '[Reservation] AddNewReservation';
  constructor(public reservation: Reservation) {}
}

export class DeleteReservation {
  static readonly type = '[Reservation] DeleteReservation';
  constructor(public reservation: Reservation) {}
}

export class EditReservation {
  static readonly type = '[Reservation] EditReservation';
  constructor(public reservation: Reservation) {}
}

export class GetReservations {
  static readonly type = '[Reservation] GetReservations';
  constructor() {}
}
