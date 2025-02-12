import type ApiModel from '@/models/ApiModels'
import Model from '@/init/Model'

export interface IFile extends ApiModel {
  name: string
  mime: 'application/pdf'
  ownerId: string
  originalName: string
  url: string
}

export default new Model<IFile>({
  collection: 'File',
  schema: {},
  methods: {},
})
