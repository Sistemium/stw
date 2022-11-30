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
  resize(:padding="20")
    stock-period-table(:data="filteredData")

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

const { mapGetters, mapMutations } = createNamespacedHelpers('inv');

export default {
  name: 'StockPeriodPage',
  mixins: [storageSelectMixin],
  components: {
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
      return search ? data.filter(({ article }) => searcher(article)) : data;
    },
  },
  methods: {
    ...mapMutations({
      setCurrentStorageId: m.SET_CURRENT_STORAGE,
    }),
    async refresh(storageId, dateB, dateE) {
      this.data = await findStockPeriod(storageId, dateB, dateE);
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
}

</style>
