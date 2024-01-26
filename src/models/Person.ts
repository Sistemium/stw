import Model from '@/init/Model';
import type ApiModel from '@/models/ApiModels'

export interface IPerson extends ApiModel {

}

export default new Model<IPerson>({
  collection: 'Person',
  schema: {},
  methods: {},
});
