import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './ds-mongo.datasource.json';

export class DsMongoDataSource extends juggler.DataSource {
  static dataSourceName = 'dsMongo';

  constructor(
    @inject('datasources.config.dsMongo', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}