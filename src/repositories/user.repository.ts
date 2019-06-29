
import { DefaultCrudRepository, juggler, CrudRepositoryImpl } from '@loopback/repository';
import { User } from '../models';
import { DsMemoryDataSource } from '../datasources';
import { DsSPDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class UserRepository extends CrudRepositoryImpl<
  User,
  typeof User.prototype.id
  > {
  constructor(
  ) {
    const ds = new DsSPDataSource();
    super(ds, User);
  }
}