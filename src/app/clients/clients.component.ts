import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ClientState } from 'src/app/states/client.state';
import { Client } from 'src/app/models/client.model';
import { GetClients, AddNewClient, DeleteClient } from 'src/app/actions/client.actions';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.less']
})
export class ClientsComponent implements OnInit {

  @Select(ClientState.getClients) clients$: Observable<Client[]>;

  public client = new Client();

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new GetClients());
  }

  addNewClient() {
    console.log(this.client);
    this.store.dispatch(new AddNewClient(this.client));
  }
  deleteClient(e) {
    this.store.dispatch(new DeleteClient(e)).subscribe(() => {
      alert('Client deleted successfully');
    },
      (err) => {
        alert('Client couldn\'t be deleted');
      }
    );
  }

  test(client){ 
    console.log(client); 
  }

}
