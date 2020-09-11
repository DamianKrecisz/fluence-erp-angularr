import { Component, OnInit, Input } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { AddNewOrder } from 'src/app/actions/order.actions';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.less']
})
export class CreateOrderComponent implements OnInit {

  public order: Order;
  public dataVisible = false;

  constructor(private store: Store, private router: Router, private message: NzMessageService, public authService: AuthService) { }

  ngOnInit() {
    this.order = new Order();
    this.order.author = this.authService.getUserEmail();
  }

  createNewOrder() {
    this.store.dispatch(new AddNewOrder(this.order)).subscribe(
      () => {
        this.message.success('Order created successfully');
        this.router.navigate(['/orders']);
      },
      (err) => {
        this.message.error('Order not created');
        console.error(err);
      }
    );
  }

  updateModel(order) {
    this.order = order;
  }

  toggleDataView() {
    this.dataVisible = !this.dataVisible;
  }
}
