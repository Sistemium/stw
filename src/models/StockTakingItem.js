import Model from '@/init/Model';

export default new Model({
  collection: 'StockTakingItem',
  schema: {},
  methods: {
    normalizeProps(props, mode) {
      if (mode === 'units') {
        // eslint-disable-next-line no-param-reassign
        props.boxRel = 1;
      }
      const { boxRel, quantity } = props;
      // eslint-disable-next-line no-param-reassign
      props.units = quantity * boxRel;
    },
  },
});
