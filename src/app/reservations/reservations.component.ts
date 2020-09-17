import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ReservationState } from '../states/reservation.state';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { GetReservations, AddNewReservation, DeleteReservation } from '../actions/reservation.action';
import { filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ClientState } from '../states/client.state';
import { Client } from '../models/client.model';
import { ProductState } from '../states/product.state';
import { Product } from '../models/product.model';
import { GetClients } from '../actions/client.actions';
import { GetProducts } from '../actions/product.actions';
import { EditProduct } from '../actions/product.actions';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.less']
})
export class ReservationsComponent implements OnInit {

  validateForm!: FormGroup;
  listOfControl: Array<{ id: number; itemToReservation: string }> = [];
  dateStart = null;
  dateEnd = null;
  items: Array<any> = [];
  a: Array<any> = [];
  listOfData: Reservation[] = [];

  @Select(ClientState.getClients) clients$: Observable<Client[]>;
  public client = new Client();

  @Select(ProductState.getProducts) products$: Observable<Product[]>;
  public product = new Product();

  @Select(ReservationState.getReservations) reservations$: Observable<Reservation[]>;
  public reservation = new Reservation();

  constructor(private store: Store, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.store.dispatch(new GetReservations());

    this.reservations$.subscribe(data => {
      this.listOfData = data;
    })
    this.validateForm = this.fb.group({
      client: [null, [Validators.required]],
      dateStart: [null, [Validators.required]],
      dateEnd: [null, [Validators.required]],
      items: [null, [Validators.required]]

    });
    this.addField();
    this.store.dispatch(new GetClients());
    this.store.dispatch(new GetProducts());

    //this.listOfData = data;
    //this.updateEditCache();
  }
  isVisible = false;
  isOkLoading = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;
    const control = {
      id,
      itemToReservation: `itemToReserve${id}`
    };
    const index = this.listOfControl.push(control);
    this.validateForm.addControl(this.listOfControl[index - 1].itemToReservation, new FormControl(null, Validators.required));
  }

  submitForm(): void {
    console.log(this.validateForm);
    for (let [key, value] of Object.entries(this.validateForm.value)) {
      if (key.includes("itemToReserve")) {
        this.a.push(value);
      }
    }

    let model = {
      client: this.validateForm.value.client,
      items: this.a,
      dateStart: this.validateForm.value.dateStart,
      dateEnd: this.validateForm.value.dateEnd
    }
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this.addNewReservation(model);

    //this.store.dispatch(new EditProduct());

    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 500);

  }

  addNewReservation(model) {
    this.store.dispatch(new AddNewReservation(model));
  }
  removeField(i: { id: number; itemToReservation: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.validateForm.removeControl(i.itemToReservation);
    }
  }

  deleteReservation(e) {
    this.store.dispatch(new DeleteReservation(e)).subscribe(
      () => {
        alert('Reservation deleted successfully');
      },
      (err) => {
        alert('Reservation couldn\'t be deleted');
      }
    );
  }
  search(e): void {
    if (e == '') {
      this.store.dispatch(new GetReservations());
    } else {
      this.listOfData = this.listOfData.filter(
        item => item.client.indexOf(e) !== -1
      );
    }
  }

}
