import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Rent } from '../models/rent.model';
import { GetRents, AddNewRent, DeleteRent } from '../actions/rent.actions';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ProductState } from '../states/product.state';
import { Product } from '../models/product.model';
import { GetClients } from '../actions/client.actions';
import { GetProducts } from '../actions/product.actions';
import { ClientState } from '../states/client.state';
import { RentState } from '../states/rent.state';
import { Client } from '../models/client.model';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-rent',
  templateUrl: './rent.component.html',
  styleUrls: ['./rent.component.less']
})
export class RentComponent implements OnInit {

  validateForm!: FormGroup;
  listOfControl: Array<{ id: number; itemToRent: string }> = [];
  dateStart = null;
  dateEnd = null;
  items: Array<any> = [];
  a: Array<any> = [];
  listOfData: Rent[] = [];

  @Select(ClientState.getClients) clients$: Observable<Client[]>;
  public client = new Client();

  @Select(ProductState.getProducts) products$: Observable<Product[]>;
  public product = new Product();

  @Select(RentState.getRents) rents$: Observable<Rent[]>;
  public rent = new Rent();

  constructor(private store: Store, private fb: FormBuilder, private httpClient: HttpClient) { }


  ngOnInit(): void {
    this.store.dispatch(new GetRents());

    this.rents$.subscribe(data => {
      this.listOfData=data;
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
      itemToRent: `itemToRent${id}`
    };
    const index = this.listOfControl.push(control);
    this.validateForm.addControl(this.listOfControl[index - 1].itemToRent, new FormControl(null, Validators.required));
  }

  submitForm(): void {

    for (let [key, value] of Object.entries(this.validateForm.value)) {
      if (key.includes("itemToRent")) {
        this.a.push(value)
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
    this.addNewRent(model);
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 500);
  }

  addNewRent(model) {
    console.log("model");

    console.log(model);
    this.store.dispatch(new AddNewRent(model));
  }
  removeField(i: { id: number; itemToRent: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.validateForm.removeControl(i.itemToRent);
    }
  }
  search(e): void {
    if (e == '') {
      this.store.dispatch(new GetRents());
    } else {
      this.listOfData = this.listOfData.filter(
        item => item.client.indexOf(e) !== -1 
      );

    }
  }/*
  search(e): void {
      if (e == '') {
        this.firebaseService.getItems().subscribe(data => {
          this.listOfData = data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data()
            } as ItemData;
          })
    
        })
      } else {
        this.listOfData = this.listOfData.filter(
          item => item.product.indexOf(e) !== -1 || item.warehouse.indexOf(e) !== -1
        );
  
      }
    }*/
  deleteRent(e) {
    this.store.dispatch(new DeleteRent(e)).subscribe(() => {
      alert('Rent deleted successfully');
    },
      (err) => {
        alert('Rent couldn\'t be deleted');
      }
    );
  }


}
