import { Client } from '../models/client.model';

export class AddNewClient {
  static readonly type = '[Client] AddNewclient';
  constructor(public client: Client) {}
}

export class DeleteClient {
  static readonly type = '[Client] DeleteClient';
  constructor(public client: Client) {}
}

export class EditClient {
  static readonly type = '[Client] EditClient';
  constructor(public client: Client) {}
}

export class GetClients {
  static readonly type = '[Client] GetClients';
  constructor() {}
}
