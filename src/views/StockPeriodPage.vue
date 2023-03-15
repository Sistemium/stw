<template lang="pug">

.stock-date-page
  page-title(title="menu.stockPeriod")
  .filters
    storage-select(v-model="storageId" ref="storageSelect")
    el-date-picker(
      v-model="dateRange"
      type="daterange"
    )
    search-input(v-model="search")
  resize(:padding="20" @resized="setHeight")
    stock-period-table(
      :data="filteredData"
      @row-click="rowClick"
      :height="tableHeight"
    )
  stock-article-details-view(
    v-if="showDetails"
    v-model="showDetails"
    :article-id="articleId"
    :storage-id="storageId"
    :date-b="queryParams.dateB"
    :date-e="queryParams.dateE"
  )

</template>
<script>

import { createNamespacedHelpers } from 'vuex';
import PageTitle from '@/components/PageTitle.vue';
import dayjs from 'sistemium-dates';
import * as g from '@/store/inv/getters';
import * as m from '@/store/inv/mutations';
import { findStockPeriod } from '@/services/warehousing';
import StockPeriodTable from '@/components/stock/StockPeriodTable.vue';
import SearchInput from '@/lib/SearchInput.vue';
import { searchArticle } from '@/services/catalogue';
import storageSelectMixin from '@/components/storageSelectMixin';
import StockArticleDetailsView from '@/components/stock/StockArticleDetailsView.vue';

const { mapGetters, mapMutations } = createNamespacedHelpers('inv');

export default {
  name: 'StockPeriodPage',
  mixins: [storageSelectMixin],
  components: {
    StockArticleDetailsView,
    SearchInput,
    StockPeriodTable,
    PageTitle,
  },
  data() {
    const today = dayjs().endOf('day');
    const monthAgo = today.add(-1, 'month');
    return {
      dateRange: [monthAgo, today],
      data: [],
      search: '',
      showDetails: false,
      articleId: null,
      tableHeight: undefined,
    };
  },
  computed: {
    ...mapGetters({
      defaultStorageId: g.CURRENT_STORAGE,
    }),
    storageId: {
      get() {
        return this.defaultStorageId;
      },
      set(id) {
        this.setCurrentStorageId(id);
      },
    },
    queryParams() {
      const [dateB, dateE] = this.dateRange;
      return {
        dateB: dayjs(dateB).startOf('day').toJSON(),
        dateE: dayjs(dateE).endOf('day').toJSON(),
        storageId: this.storageId,
      };
    },
    filteredData() {
      const { search, data } = this;
      const searcher = searchArticle(search);
      return search ? data.filter(({ article }) => article && searcher(article)) : data;
    },
  },
  methods: {
    ...mapMutations({
      setCurrentStorageId: m.SET_CURRENT_STORAGE,
    }),
    setHeight(height) {
      this.tableHeight = height;
    },
    async refresh(storageId, dateB, dateE) {
      const loading = this.$loading({});
      try {
        this.data = await findStockPeriod(storageId, dateB, dateE);
      } catch (e) {
        this.$error('refresh', e);
      }
      loading.close();
    },
    rowClick(row) {
      this.showDetails = true;
      this.articleId = row.articleId;
    },
  },
  watch: {
    queryParams: {
      immediate: true,
      handler({ storageId, dateB, dateE }) {
        if (!storageId || !dateB || !dateE) {
          return;
        }
        this.refresh(storageId, dateB, dateE)
          .catch(e => this.$error(e));
      },
    },
  },
};

</script>
<style scoped lang="scss">
@import "../styles/variables";

.filters {
  > * + * {
    margin-left: $margin-right;
  }
}

.stm-resize {
  margin-top: $margin-top;
  overflow-y: hidden;
}

</style>
