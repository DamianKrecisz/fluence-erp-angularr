import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { OrderState } from 'src/app/states/order.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetOrders, EditOrder, DeleteOrder } from 'src/app/actions/order.actions';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.less']
})
export class RecentOrdersTableComponent {

  @Select(OrderState.getOrders) orders$: Observable<Order[]>;

  constructor(private store: Store, private message: NzMessageService) { }

  deleteOrder(order) {
    this.store.dispatch(new DeleteOrder(order)).subscribe(
      () => {},
      (err) => {
        this.message.error('Order couldn\'t be deleted');
      },
      () => {
        this.message.success('Order has been deleted successfully');
      }
    );
  }

  handleDelete(e) {
    e.stopPropagation();
  }
}
