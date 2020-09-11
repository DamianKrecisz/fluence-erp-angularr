import { Rent } from '../models/rent.model';

export class AddNewRent {
  static readonly type = '[Rent] AddNewRent';
  constructor(public rent: Rent) {}
}

export class DeleteRent {
  static readonly type = '[Rent] DeleteRent';
  constructor(public rent: Rent) {}
}

export class EditRent {
  static readonly type = '[Rent] EditRent';
  constructor(public rent: Rent) {}
}

export class GetRents {
  static readonly type = '[Rent] GetRents';
  constructor() {}
}
