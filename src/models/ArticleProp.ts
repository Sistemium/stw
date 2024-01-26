import Model from '@/init/Model'
import type { IArticleProp, PropDataType } from '@/models/ArticleProps'

export default new Model<IArticleProp>({
  collection: 'ArticleProp',
  schema: {},
  methods: {},
})

export const VALUE_TYPES: Record<PropDataType, string> = {
  boolean: 'boolValue',
  string: 'stringValue',
  options: 'optionId',
  number: 'numberValue',
}

export const TYPES_DEFAULTS: Record<PropDataType, boolean | null | undefined> = {
  boolean: true,
  string: null,
  number: undefined,
  options: null,
}
