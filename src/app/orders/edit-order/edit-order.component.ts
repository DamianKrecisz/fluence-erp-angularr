import { Component, OnInit, Input } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { EditOrder } from 'src/app/actions/order.actions';
import { Store } from '@ngxs/store';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.less']
})
export class EditOrderComponent implements OnInit {

  public order: Order;

  constructor(
    private store: Store,
    private router: Router,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(({id}) => {
        return this.http.get<Order>(`/orders/${id}`);
      })
    ).subscribe(
      (order: Order) => {
        this.order = order;
      }
    );
  }

  save() {
    this.store.dispatch(new EditOrder(this.order)).subscribe(
      (res) => {
        this.message.success('Order updated successfully');
        this.router.navigate(['/orders']);
      },
      (err) => {
        this.message.error('Order not updated');
      }
    );
  }

  updateModel(order: Order) {
    this.order = order;
  }
}
