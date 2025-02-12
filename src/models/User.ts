import Model from '@/init/Model';
import type ApiModel from '@/models/ApiModels'

export interface IUser extends ApiModel {
  name: string
  email?: string
}

export default new Model<IUser>({
  collection: 'User',
  schema: {},
  methods: {},
});
