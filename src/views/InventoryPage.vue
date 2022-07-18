<template lang="pug">

.inventory
  .barcode(v-if="scannedBarCode")
    simple-label(text="fields.barcode")
    .code {{ scannedBarCode.code }}

  el-alert(v-else :title="$t('scanBarcode')")

  template(v-if="notFound && !article")
    el-radio-group(
      v-model="matcherMode"
    )
      el-radio-button(label="add") Add article
      el-radio-button(label="find") Find article
    article-matcher(@found="onArticle")

  template(v-if="canAddBarcode")
    el-button-group
      el-button(@click="onAddBarcodeClick" type="primary") {{ $t('addBarcode') }}
      el-button(@click="onAddCancelClick" type="warning") {{ $t('cancel') }}

  template(v-if="article")
    .article
      simple-label(text="concepts.article")
      .name {{ article.name }}

</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import Article from '@/models/Article';
import ArticleMatcher from '@/components/catalogue/ArticleMatcher.vue';
import * as g from '@/store/inv/getters';
import * as m from '@/store/inv/mutations';

const { mapGetters, mapMutations } = createNamespacedHelpers('inv');

export default {
  name: 'InventoryPage',
  data() {
    return {
      notFound: null,
      matcherMode: 'find',
      article: null,
      articles: [],
    };
  },
  props: {
    value: Object,
  },
  methods: {
    ...mapMutations({
      clearScannedBarcode: m.SET_SCANNED_BARCODE,
      setArticleFilters: m.SET_ARTICLE_FILTERS,
    }),
    init() {
    },
    onAddBarcodeClick() {
      const { barcodes } = this.article;
      const props = {
        ...this.article,
        barcodes: [
          ...(barcodes || []),
          this.scannedBarCode.code,
        ],
      };
      this.$saveWithLoading(async () => {
        this.onArticle(await Article.createOne(props));
        this.notFound = null;
      });
    },
    onAddCancelClick() {
      this.onArticle(null);
    },
    onArticle(article) {
      if (article === this.article) {
        return;
      }
      this.article = article;
      this.$emit('input', article);
    },
    async onScan(barcode) {
      const { code } = barcode || {};
      this.article = null;
      if (!code) {
        this.notFound = false;
        return;
      }
      try {
        const res = await Article.findAll({ barcodes: code });
        this.notFound = !(res && res.length);
        this.$emit('scan', code, this.notFound);
        if (this.notFound) {
          this.$message.warning(this.$t('not_found').toString());
          this.setArticleFilters();
          return;
        }
        if (res.length === 1) {
          [this.article] = res;
          return;
        }
        this.articles = res;
      } catch (e) {
        this.notFound = false;
        this.$error('onScan:', e);
      }
    },
  },
  computed: {
    ...mapGetters({
      scannedBarCode: g.SCANNED_BARCODE,
    }),
    canAddBarcode() {
      const { article, scannedBarCode } = this;
      return article && scannedBarCode
        && !(article.barcodes || []).includes(scannedBarCode.code);
    },
  },
  created() {
    this.$watchImmediate('scannedBarCode', this.onScan);
    this.$watchImmediate('value', this.onArticle);
  },
  components: {
    ArticleMatcher,
  },
  i18n: {
    messages: {
      en: {
        not_found: 'Not found article',
        notFoundAdding: 'Add new article or link barcode to existing',
        addBarcode: 'Link barcode to article',
        scanBarcode: 'Scan product barcode to continue',
      },
      ru: {
        not_found: 'Номенклатура не найдена',
        notFoundAdding: 'Добавим новую номенклатуру или привяжем штрих-код к имеющейся',
        addBarcode: 'Связать код с номенклатурой',
        scanBarcode: 'Сканируйте штрих-код товара, чтобы продолжить',
      },
      lt: {
        not_found: 'Nomenklatūros nerasta',
        notFoundAdding: 'Pridėti naują nomenklatūrą arba pridėti brūkšninį kodą prie esamos',
        addBarcode: 'Susieti kodą su nomenklatūra',
        scanBarcode: 'Norėdami tęsti, nuskaitykite brūkšninį kodą',
      },
    },
  },
};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.body {
  overflow-x: scroll;
}

.inventory > * + * {
  margin-top: $margin-top;
}

.article, .barcode {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
