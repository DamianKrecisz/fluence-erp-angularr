import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { RecentOrdersTableComponent } from './orders/orders-table/orders-table.component';
import { NgxsModule } from '@ngxs/store';
import { OrderState } from './states/order.state';
import { SignUpComponent } from './login-page/sign-up/sign-up.component';
import { RequestInterceptor } from './request.interceptor';
import { TopNavbarComponent } from './layout/top-navbar/top-navbar.component';
import { AuthState } from './states/auth.state';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { LayoutComponent } from './layout/layout.component';
import { SideNavbarComponent } from './layout/side-navbar/side-navbar.component';
import { NoRouteFoundComponent } from './no-route-found/no-route-found.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ProductState } from './states/product.state';
import { ReservationsComponent } from './reservations/reservations.component';
import { ProductsTableComponent } from './products/products-table/products-table.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderFormComponent } from './orders/order-form/order-form.component';
import { EditOrderComponent } from './orders/edit-order/edit-order.component';
import { ProductsComponent } from './products/products.component';
import { ProductFormComponent } from './products/product-form/product-form.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { OrderReadonlyComponent } from './orders/order-readonly/order-readonly.component';
import { ChartsModule } from 'ng2-charts';
import { ClientsComponent } from './clients/clients.component';
import { ClientState } from './states/client.state';
import { ReservationState } from './states/reservation.state';
import { RentComponent } from './rent/rent.component';
import { RentState } from './states/rent.state';
registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    MainDashboardComponent,
    RecentOrdersTableComponent,
    SignUpComponent,
    TopNavbarComponent,
    CreateOrderComponent,
    LayoutComponent,
    SideNavbarComponent,
    NoRouteFoundComponent,
    AddProductComponent,
    ReservationsComponent,
    ProductsTableComponent,
    OrdersComponent,
    OrderFormComponent,
    EditOrderComponent,
    ProductsComponent,
    ProductFormComponent,
    EditProductComponent,
    OrderReadonlyComponent,
    ClientsComponent,
    RentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    NgxsModule.forRoot([
      OrderState,
      ProductState,
      AuthState,
      ClientState,
      ReservationState,
      RentState
    ]),
    ChartsModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
