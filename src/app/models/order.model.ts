import { Product } from './product.model';

export class Order {
  _id: string;
  name: string;
  productId: string;
  subject: string;
  status: string;
  creationDate: string;
  author: string;
  value: number;
  comment: string;
}
