import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.less']
})
export class ProductFormComponent implements OnInit {

  @Input() product: Product;
  @Output() productChange: EventEmitter<Product> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  emitProduct() {
    this.productChange.emit(this.product);
  }
}
