<template lang="pug">

el-form.stock-taking-item-form(
  :model="model"
  ref="form"
  :rules="rules"
)
  el-form-item.mode
    el-radio-group(v-model="mode" @change="modeChange")
      el-radio-button(label="boxes") {{ $t('storage.boxes') }}
      el-radio-button(label="units") {{ $t('storage.units') }}

  template(v-if="mode==='boxes'")
    el-form-item(prop="boxRel" :label="$t('fields.boxRel')")
      el-input-number(v-model="model.boxRel" :min="1")

  el-form-item(
    prop="quantity"
    :label="$t(mode==='boxes' ? 'fields.boxQuantity' : 'fields.quantity')"
  )
    el-input-number(v-model="model.quantity" :min="1")

</template>
<script>
/* eslint-disable vue/no-mutating-props */
// import StockTakingItem from '@/models/StockTakingItem';

export default {
  name: 'StockTakingItemForm',
  props: {
    model: Object,
    article: { type: Object, required: true },
  },
  data() {
    return {
      mode: 'units',
    };
  },
  computed: {
    rules() {
      return {
        ...this.$requiredRule('quantity'),
        ...this.$requiredRule('boxRel'),
      };
    },
    units() {
      return this.model.boxRel * this.model.quantity;
    },
  },
  methods: {
    modeChange(mode) {
      if (mode === 'boxes') {
        const { boxes = [] } = this.article;
        const [box] = boxes;
        const { boxRel = 1 } = box || {};
        this.model.boxRel = boxRel;
      } else {
        this.model.boxRel = 1;
      }
    },
  },
  created() {
    this.$watchImmediate('units', units => {
      this.model.units = units;
    });
  },
};

</script>
<style scoped lang="scss">
.mode {
  //text-align: left;
}
</style>
