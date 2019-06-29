import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './ds-memory.datasource.json';

export class DsMemoryDataSource extends juggler.DataSource {
  static dataSourceName = 'dsMemory';

  constructor(
    @inject('datasources.config.dsMemory', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}