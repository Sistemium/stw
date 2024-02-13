import Model from '@/init/Model';
import type ApiModel from '@/models/ApiModels'

export interface ISite extends ApiModel {
  name: string
  code: string
}

export default new Model<ISite>({
  collection: 'Site',
  schema: {},
  methods: {},
});
