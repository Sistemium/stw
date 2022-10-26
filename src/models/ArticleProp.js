import Model from '@/init/Model';

export default new Model({
  collection: 'ArticleProp',
  schema: {},
  methods: {},
});

export const VALUE_TYPES = {
  boolean: 'boolValue',
  string: 'stringValue',
  options: 'optionId',
  number: 'numberValue',
};

export const TYPES_DEFAULTS = {
  boolean: true,
  string: null,
  number: undefined,
  options: null,
};
