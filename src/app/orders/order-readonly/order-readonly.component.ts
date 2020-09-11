import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-order-readonly',
  templateUrl: './order-readonly.component.html',
  styleUrls: ['./order-readonly.component.less']
})
export class OrderReadonlyComponent implements OnInit {

  public order: Order;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient) { }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(({id}) => {
        return this.http.get<Order>(`http://localhost:3000/orders/${id}`);
      })
    ).subscribe(
      (order: Order) => {
        this.order = order;
      }
    );
  }

}
