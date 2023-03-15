<template lang="pug">

el-dialog.stock-article-details-view(
  :title="title"
  :fullscreen="fullscreen"
  :show-close="true"
  :visible.sync="visible"
  custom-class="el-dialog-tabs"
  @closed="handleClose()"
  :append-to-body="true"
)
  el-tabs(v-model="currentTab")
    el-tab-pane(
      v-for="tab in tabs"
      :key="tab.id"
      :lazy="true"
      :name="tab.id"
    )
      template(v-slot:label)
        span {{ $t(tab.id) }}
        el-badge(
          type="info"
          :value="tab.badge"
          size="small"
        )
      stock-article-operations-table(
        :operations="tab.operations"
        :counterparty="tab.counterparty"
      )

</template>
<script>

import Article from '@/models/Article';
import { findStockPeriodOperations } from '@/services/warehousing';
import StockArticleOperationsTable from '@/components/stock/StockArticleOperationsTable.vue';

export default {
  name: 'StockArticleDetailsView',
  components: { StockArticleOperationsTable },
  data() {
    return {
      data: {},
      currentTab: null,
    };
  },
  props: {
    value: Boolean,
    articleId: String,
    storageId: String,
    dateB: String,
    dateE: String,
    // from: {
    //   type: Object,
    //   default: () => ({
    //     name: 'stockPeriod',
    //   }),
    // },
  },
  computed: {
    title() {
      const { name } = Article.reactiveGet(this.articleId) || {};
      return name;
    },
    tabs() {
      const {
        data: { fix = [], in: incoming = [], out = [] },
      } = this;
      return [
        {
          id: 'fields.unitsSur',
          badge: fix.length || null,
          operations: fix,
          counterparty: null,
        },
        {
          id: 'fields.unitsIn',
          badge: incoming.length || null,
          operations: incoming,
          counterparty: 'fields.supplier',
        },
        {
          id: 'fields.unitsOut',
          badge: out.length || null,
          operations: out,
          counterparty: 'fields.consignee',
        },
      ];
    },
    visible: {
      get() {
        return this.value;
      },
      set(visible) {
        this.$emit('input', visible);
      },
    },
    fullscreen() {
      return false;
    },
  },
  created() {
    this.refresh();
  },
  methods: {
    handleClose() {
      this.visible = false;
      // this.$router.push(this.from)
      //   .catch(e => this.$error('handleClose', e));
    },
    refresh() {
      findStockPeriodOperations(this.articleId, this.storageId, this.dateB, this.dateE)
        .then(res => {
          this.data = res;
          const tab = this.tabs.find(({ operations }) => operations.length);
          if (tab) {
            this.currentTab = tab.id;
          }
        });
    },
  },
};

</script>
<style scoped lang="scss">
@import "@/styles/variables.scss";

.el-badge {
  margin-left: $padding;
}
</style>