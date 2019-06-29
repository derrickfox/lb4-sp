const debug = require('debug')(
    'loopback:repositories:lb4-sp-mongo:datasources:connections:sp',
  );
  import * as _ from 'lodash';
  import { sp, ItemAddResult } from "@pnp/sp";
  import { SPFetchClient } from "@pnp/nodejs";
  import {
    Class,
    CrudConnector,
    Entity,
    EntityData,
    Filter,
    Options,
    Where,
    Count,
  } from '@loopback/repository';
  
  // tslint:disable-next-line:no-any
  export type AnyIdType = any;
  
  export class SPConn implements CrudConnector {
    //fixme make connection strongly typed
    // tslint:disable-next-line:no-any
    private connection: any;
  
    // tslint:disable-next-line:no-any
    private config: any;
  
    constructor(config: Object) {
      this.connection = sp;
      this.config = config;
    }
    name: 'sp';
    interfaces?: string[];
    connect(): Promise<void> {
      this.connection.setup({
        sp: {
          fetchClientFactory: () => {
            return new SPFetchClient(this.config.site, this.config.clientId, this.config.clientSecret);
          }
        },
      });
      return Promise.resolve();
    }
    disconnect(): Promise<void> {
      return Promise.resolve();
    }
    ping(): Promise<void> {
      return Promise.resolve();
    }
  
    updateAll(
      modelClass: Class<Entity>,
      data: EntityData,
      where: Where,
      options: Options,
    ): Promise<Count> {
      throw new Error('Not implemented yet.');
    }
  
  
    async create(
      modelClass: Class<Entity>,
      entity: EntityData,
      options: Options,
    ): Promise<EntityData> {
      debug('create ', entity);
      const spEntity = this.toSPEntity(modelClass, entity);
      await this.connect();
      const result: ItemAddResult = await this.connection.web.lists.getByTitle(modelClass.modelName).items.add(spEntity);
      return this.toEntity(modelClass, result.data);
    }
  
    save(
      modelClass: Class<Entity>,
      entity: EntityData,
      options: Options,
    ): Promise<EntityData> {
      throw new Error('Not implemented yet.');
    }
  
    find(
      modelClass: Class<Entity>,
      filter: Filter,
      options: Options,
    ): Promise<EntityData[]> {
      throw new Error('Not implemented yet.');
    }
  
    async findById(
      modelClass: Class<Entity>,
      id: AnyIdType,
      options: Options,
    ): Promise<EntityData> {
      debug('findById ', `${modelClass.modelName} ${id}`);
      await this.connect();
      const result = await this.connection.web.lists.getByTitle(modelClass.modelName).items.top(1).filter(`ID eq '${id}'`).get();
      return this.toEntity(modelClass, result[0]);
    }
  
    async update(
      modelClass: Class<Entity>,
      entity: EntityData,
      options: Options,
    ): Promise<boolean> {
      debug('update ', `${modelClass.modelName} ${entity}`);
      return this.updateById(modelClass, entity.getId, entity, options);
    }
  
    delete(
      modelClass: Class<Entity>,
      entity: EntityData,
      options: Options,
    ): Promise<boolean> {
      throw new Error('Not implemented yet.');
    }
  
    createAll(
      modelClass: Class<Entity>,
      entities: EntityData[],
      options: Options,
    ): Promise<EntityData[]> {
      throw new Error('Not implemented yet.');
    }
  
    async updateById(
      modelClass: Class<Entity>,
      id: AnyIdType,
      entity: EntityData,
      options: Options,
    ): Promise<boolean> {
      debug('updateById ', `${modelClass.modelName} ${id}`);
      const spEntity = this.toSPEntity(modelClass, entity);
      await this.connect();
      await this.connection.web.lists.getByTitle(modelClass.modelName).items.getById(id).update(spEntity);
      return true;
    }
  
    async replaceById(
      modelClass: Class<Entity>,
      id: AnyIdType,
      entity: EntityData,
      options: Options,
    ): Promise<boolean> {
      debug('replaceById ', `${modelClass.modelName} ${id}`);
      return await this.updateById(modelClass, id, entity, options);
    }
  
    deleteAll(
      modelClass: Class<Entity>,
      where: Where,
      options: Options,
    ): Promise<Count> {
      throw new Error('Not implemented yet.');
    }
  
    async deleteById(
      modelClass: Class<Entity>,
      id: AnyIdType,
      options: Options,
    ): Promise<boolean> {
      debug('deleteById ', `${modelClass.modelName} ${id}`);
      await this.connect();
      await this.connection.web.lists.getByTitle(modelClass.modelName).items.getById(id).delete();
      return true;
    }
  
    async count(
      modelClass: Class<Entity>,
      where: Where,
      options: Options,
    ): Promise<Count> {
      debug('count ', modelClass.modelName);
      await this.connect();
      const listData = await this.connection.web.lists.getByTitle(modelClass.modelName).items.getAll();
      return listData.length;
    }
  
    async exists(
      modelClass: Class<Entity>,
      id: AnyIdType,
      options: Options,
    ): Promise<boolean> {
      debug('exists ', `${modelClass.modelName} ${id}`);
      return !_.isEmpty(await this.findById(modelClass, id, options));
    }
  
    private toSPEntity(modelClass: Class<Entity>, entity: EntityData, ) {
      const spEntity = {};
      if (_.isNil(modelClass)) {
        throw new Error('Model not defined');
      }
      for (let prop in entity) {
        const dsProperty = _.get(modelClass, `definition.properties.${prop}`);
        const spProperty = _.get(dsProperty, `sp`);
        const spPropertyColumnName = _.get(spProperty, `columnName`, prop);
        // id is not included
        if (!_.get(dsProperty, `id`) === true) {
          _.set(spEntity, spPropertyColumnName, _.get(entity, prop));
        }
      }
      return spEntity;
    }
    private toEntity(modelClass: Class<Entity>, spEntity: object) {
      let entity: EntityData = {};
      if (_.isNil(modelClass)) {
        throw new Error('Model not defined');
      }
      const spProperties = _.get(modelClass, `definition.properties`);
      for (let prop in spProperties) {
        const dsProperty = _.get(modelClass, `definition.properties.${prop}`);
        const spProperty = _.get(dsProperty, `sp`);
        const spPropertyColumnName = _.get(spProperty, `columnName`);
        _.set(entity, prop, _.get(spEntity, spPropertyColumnName));
  
      }
      return entity;
    }
  
  
  }