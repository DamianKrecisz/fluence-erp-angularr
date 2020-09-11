// import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { Order } from 'src/app/models/order.model';

// @Component({
//   selector: 'app-create-order-modal',
//   templateUrl: './create-order-modal.component.html',
//   styleUrls: ['./create-order-modal.component.less']
// })
// export class CreateOrderModalComponent implements OnInit {

//   @Input() isVisible = false;
//   @Input() editMode = false;
//   @Input() order = new Order();
//   @Output() closeModal: EventEmitter<any> = new EventEmitter();
//   @Output() save: EventEmitter<Order> = new EventEmitter();

//   // public order = new Order();
//   constructor() { }

//   ngOnInit() {
//   }

//   close() {
//     this.closeModal.emit();
//     this.order = new Order();
//   }

//   saveOrder() {
//     this.save.emit(this.order);
//     this.order = new Order();
//   }
// }
