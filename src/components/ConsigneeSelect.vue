<template lang="pug">

el-select.consignee-select(
  ref="select"
  filterable
  remote
  :placeholder="$t('typeToSearch')"
  :remote-method="remoteMethod"
  :loading="loading"
  v-model="consigneeId"
  v-if="type"
  :debounce="300"
  v-cancel-read-only
)
  el-option(
    v-for="item in options"
    :key="item.id"
    :label="item.name"
    :value="item.id"
  )

</template>
<script>

import { CONSIGNEE_TYPES } from '@/services/warehousing';
import debounce from 'lodash/debounce';

export default {
  name: 'ConsigneeSelect',
  props: {
    type: String,
    value: String,
  },
  data() {
    return {
      loading: false,
      remoteOptions: [],
    };
  },
  computed: {
    remoteMethod() {
      return this.type === 'Storage' ? null : debounce(q => this.searcher(q), 300);
    },
    model() {
      return CONSIGNEE_TYPES.get(this.type);
    },
    options() {
      const res = this.remoteMethod ? this.remoteOptions
        : (this.model && this.model.reactiveFilter({}));
      return this.$orderBy(res, 'name');
    },
    consignee() {
      const { model } = this;
      return model ? this.model.reactiveGet(this.value) : null;
    },
    consigneeId: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  created() {
    this.$watchImmediate('consignee.id', id => {
      if (id && !this.$find(this.options, { id })) {
        this.remoteOptions = this.model.reactiveFilter();
      }
    });
  },
  watch: {
    type() {
      this.remoteOptions = [];
    },
  },
  methods: {
    searcher(query) {
      if (!query) {
        this.remoteOptions = this.model.reactiveFilter();
        return;
      }
      this.loading = true;
      this.model
        .findAll({
          'where:': { name: { like: query } },
        }, {
          headers: { 'x-page-size': 50 },
        })
        .then(records => {
          this.remoteOptions = records;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};

</script>
<style scoped lang="scss">

</style>
