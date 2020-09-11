import { Product } from '../models/product.model';

export class AddNewProduct {
  static readonly type = '[Product] AddNewProduct';
  constructor(public product: Product) {}
}

export class DeleteProduct {
  static readonly type = '[Product] DeleteProduct';
  constructor(public product: Product) {}
}

export class EditProduct {
  static readonly type = '[Product] EditProduct';
  constructor(public product: Product) {}
}

export class GetProducts {
  static readonly type = '[Product] GetProducts';
  constructor() {}
}
