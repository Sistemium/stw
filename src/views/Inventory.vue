<template lang="pug">

.inventory
  barcode-input(@scan="onScan" :lock="false")
  template
    article-matcher(:title="$t('notFoundAdding')")
    //(v-if="notFound")
    //h2(v-t="")
    //property-matcher(:title="$t('notFoundAdding')" v-model="filters")

</template>
<script>

import BarcodeInput from '@/components/BarcodeScanner/BarcodeInput.vue';
import Article from '@/models/Article';
import ArticleMatcher from '@/components/catalogue/ArticleMatcher.vue';

export default {
  name: 'Inventory',
  data() {
    return {
      notFound: null,
    };
  },
  methods: {
    async onScan(code) {
      this.notFound = false;
      try {
        const res = Article.findAll({ barcodes: code });
        this.notFound = !res;
        if (!res) {
          this.$message.warning(this.$t('not_found').toString());
        }
      } catch (e) {
        this.$error('onScan:', e);
      }
    },
  },
  components: {
    ArticleMatcher,
    BarcodeInput,
  },
  i18n: {
    messages: {
      en: {
        not_found: 'Not found article',
        notFoundAdding: 'Add new article or link barcode to existing',
      },
      ru: {
        not_found: 'Номенклатура не найдена',
        notFoundAdding: 'Добавим новую номенклатуру или привяжем штрих-код к имеющейся',
      },
      lt: {
        not_found: 'Nomenklatūros nerasta',
        notFoundAdding: 'Pridėti naują nomenklatūrą arba pridėti brūkšninį kodą prie esamos',
      },
    },
  },
};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.article-matcher {
  margin-top: $margin-top;
}

</style>
