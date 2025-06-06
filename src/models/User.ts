import Model, { BaseItem } from '@/init/Model'
import type ApiModel from '@/models/ApiModels'

export interface IUser extends ApiModel {
  name: string
  email?: string
  phone?: string
  roles: BaseItem & {
    admin?: boolean
    masterIds?: string[]
  },
  employeeId?: string
}

export default new Model<IUser>({
  collection: 'User',
  schema: {},
  methods: {},
});
