import Model from '@/init/Model'

export interface IPropOption {
  id: string
  name: string
}

export default new Model<IPropOption>({
  collection: 'PropOption',
  schema: {},
  methods: {},
})
