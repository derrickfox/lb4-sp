import { Entity, model, property } from '@loopback/repository';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
    sp: {
      columnName: "ID",
      dataType: "integer",
      dataLength: 40,
      nullable: "Y"
    }
  })
  id: number;

  @property({
    type: 'string',
    sp: {
      columnName: "Title",
      dataType: "text",
      dataLength: 40,
      nullable: "Y"
    }
  })
  name?: string;

  @property({
    type: 'string',
    sp: {
      columnName: "Job",
      dataType: "text"
    }
  })
  job?: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}