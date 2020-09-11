import { Order } from '../models/order.model';

export class AddNewOrder {
  static readonly type = '[Order] AddNewOrder';
  constructor(public order: Order) {}
}

export class DeleteOrder {
  static readonly type = '[Order] DeleteOrder';
  constructor(public order: Order) {}
}

export class EditOrder {
  static readonly type = '[Order] EditOrder';
  constructor(public order: Order) {}
}

export class GetOrders {
  static readonly type = '[Order] GetOrders';
  constructor() {}
}

export class GetOrder {
  static readonly type = '[Order] GetOrder';
  constructor(public orderId: string) {}
}
