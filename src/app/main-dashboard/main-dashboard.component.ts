import { Component, OnInit } from '@angular/core';
import { Order } from '../models/order.model';
import { Store, Select } from '@ngxs/store';
import { AddNewOrder, GetOrders } from '../actions/order.actions';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { OrderState } from '../states/order.state';
import { RentState } from '../states/rent.state';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.less']
})
export class MainDashboardComponent implements OnInit {

  @Select(OrderState.getOrders) orders$: Observable<Order[]>;
  @Select(RentState.getRents) rents$: Observable<Order[]>;

  public monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  public isOrderModalVisible = false;
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: false
  };
  public barChartLabels: Array<string>;
  public barChartType = 'bar';
  public barChartLegend = false;
  public barChartData: Array<any>;
  public lineChartColors = [
    {
      backgroundColor: '#F3941B',
    },
  ];
  public statusesChartColors = [
    {
      backgroundColor: '#022437',
    },
  ];

  public orderStatusesLabels = ['In Progress', 'Completed', 'Canceled'];
  public orderStatusesChartData: Array<any>;
  constructor(private store: Store, public authService: AuthService) { }

  ngOnInit() {
    this.store.dispatch(new GetOrders());
    this.orders$.subscribe((orders) => {
      console.log("orders");
      console.log(orders);
      if (orders) {
        const today = new Date();
        const lastSixMonthArray = [];
        let d;
        let month;

        for (let k = 6; k > 0; k -= 1) {
          d = new Date(today.getFullYear(), today.getMonth() - k + 1, 1);
          month = this.monthNames[d.getMonth()];
          lastSixMonthArray.push(month);
        }

        this.barChartLabels = lastSixMonthArray;

        const lastOrders = orders.filter(order => {
          return new Date(order.creationDate).getFullYear() === new Date().getFullYear();
        });

        const results = {};
        const rarr = [];
        let date;
        let i;

        for (i = 0; i < lastOrders.length; i++) {
          date = this.monthNames[new Date(lastOrders[i].creationDate).getMonth()];
          results[date] = results[date] || 0;
          results[date]++;
        }

        for (i in results) {
          if (results.hasOwnProperty(i)) {
            rarr.push({date: i, counts: results[i]});
          }
        }

        const barData = lastSixMonthArray.map(m => results[m] || 0);

        this.barChartData = [
          {
            data: barData
          }
        ];

        this.orderStatusesChartData = [
          {
            data: [
              orders.filter(o => o.status === 'in progress').length,
              orders.filter(o => o.status === 'completed').length,
              orders.filter(o => o.status === 'canceled').length
            ]
          }
        ];

      }
    });
  
    this.rents$.subscribe((rents)=>{
      console.log("rents");
      console.log(rents);
      if(rents){

      }
    })
  
  }

  openCreateOrderModal() {
    this.isOrderModalVisible = true;
  }

  closeOrderModal() {
    this.isOrderModalVisible = false;
  }

  createNewOrder(order: Order) {
    this.store.dispatch(new AddNewOrder(order));
    this.closeOrderModal();
  }
}
