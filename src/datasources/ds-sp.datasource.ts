import { SPConn } from './sp-conn';
import { DataSource } from '@loopback/repository';
import * as config from './ds-sp.datasource.json';

export class DsSPDataSource implements DataSource {
  name: 'dsSP';
  connector: SPConn;
  settings: Object;

  constructor() {
    this.settings = config;
    this.connector = new SPConn(this.settings);
  }
}