import Model from '@/init/Model';
import type ApiModel from '@/models/ApiModels'

export interface IStorage extends ApiModel {
  name: string
  siteId?: string
  employeeId?: string | null
  email?: string
  type: 'personal' | 'facility'
}

export default new Model<IStorage>({
  collection: 'Storage',
  schema: {},
  methods: {},
});
