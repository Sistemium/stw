import Model from '@/init/Model';
import type ApiModel from '@/models/ApiModels'

export interface IEmployee extends ApiModel {
  name: string
}

export default new Model<IEmployee>({
  collection: 'Employee',
  schema: {},
  methods: {},
});
