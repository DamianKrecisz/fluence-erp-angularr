import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { LoggedUserGuard } from './auth/logged-user.guard';
import { LayoutComponent } from './layout/layout.component';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { NoRouteFoundComponent } from './no-route-found/no-route-found.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { OrdersComponent } from './orders/orders.component';
import { EditOrderComponent } from './orders/edit-order/edit-order.component';
import { ProductsComponent } from './products/products.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { OrderReadonlyComponent } from './orders/order-readonly/order-readonly.component';
import { ClientsComponent } from './clients/clients.component';
import { RentComponent } from './rent/rent.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [LoggedUserGuard],
    data: { title: 'Log in' }
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    data: { title: 'Fluence ERP - Home' },
    children: [
      {
        path: '',
        component: MainDashboardComponent
      },
      {
        path: 'orders',
        data: { title: 'Orders' },
        component: OrdersComponent
      },
      {
        path: 'orders/add',
        data: { title: 'Create Order' },
        component: CreateOrderComponent
      },
      {
        path: 'orders/edit/:id',
        data: { title: 'Edit Order' },
        component: EditOrderComponent
      },
      {
        path: 'orders/view/:id',
        data: { title: 'View Order' },
        component: OrderReadonlyComponent
      },
      {
        path: 'products',
        data: { title: 'Products' },
        component: ProductsComponent
      },
      {
        path: 'products/add',
        data: { title: 'Add Product' },
        component: AddProductComponent
      },
      {
        path: 'products/edit/:id',
        data: { title: 'Edit Product' },
        component: EditProductComponent
      },
      {
        path: 'reservations',
        data: { title: 'Reservations' },
        component: ReservationsComponent
      },
      {
        path: 'clients',
        data: { title: 'Clients' },
        component: ClientsComponent
      },
      {
        path: 'rent',
        data: { title: 'rent' },
        component: RentComponent
      }
    ]
  },
  {
    path: '**', component: NoRouteFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
