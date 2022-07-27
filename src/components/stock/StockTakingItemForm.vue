<template lang="pug">

el-form.stock-taking-item-form(
  :model="model"
  ref="form"
  :rules="rules"
  :disabled="!editable"
)

  el-form-item(:label="$t('fields.barcode')" prop="barcode")
    el-input(v-model="model.barcode" clearable)
      template(v-slot:prepend)
        el-button(:icon="barcodeIcon" @click="toggleShowAllArticles")

  el-form-item.add-barcode(v-if="canAddBarcode")
    el-button(
      type="warning"
      icon="el-icon-paperclip"
      @click="onAddBarcodeClick"
    ) {{ $t('addBarcode') }}

  el-form-item.article(:label="$t('concepts.article')" prop="articleId")
    .strong(v-if="article") {{ article.code }}
    .select-button
      .prepend
        el-button(icon="el-icon-plus" @click="addArticle")
      article-select(v-model="model.articleId" :filters="articleFilters")
        template(v-slot:empty v-if="model.barcode && !isShowingAllArticles")
          p.el-select-dropdown__empty
            span {{ $t('notFound') }}
            el-button(@click="toggleShowAllArticles") {{ $t('showAll') }}

  template(v-if="article")
    el-form-item.mode(:label="$t('fields.package')")
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

  article-edit(
    v-if="showDrawer"
    @saved="articleSaved"
    @closed="articleEditClosed"
    :drawer-style="{ top: '50px' }"
  )

</template>
<script>
/* eslint-disable vue/no-mutating-props */
// import StockTakingItem from '@/models/StockTakingItem';
import Article from '@/models/Article';
import ArticleView from '@/components/catalogue/ArticleView.vue';
import ArticleSelect from '@/components/catalogue/ArticleSelect.vue';
import { addBarcodeToArticle } from '@/services/catalogue';
import ArticleEdit from '@/components/catalogue/ArticleEdit.vue';

export default {
  name: 'StockTakingItemForm',
  props: {
    model: Object,
    editable: Boolean,
  },
  data() {
    return {
      showDrawer: false,
      mode: 'units',
      isShowingAllArticles: false,
    };
  },
  computed: {
    barcodeIcon() {
      return this.isShowingAllArticles ? 'el-icon-s-release' : 'el-icon-attract';
    },
    articleFilters() {
      const { barcode } = this.model;
      if (barcode && !this.isShowingAllArticles) {
        return function barcodeFilter({ barcodes }) {
          return barcodes && barcodes.includes(barcode);
        };
      }
      return {};
    },
    rules() {
      return {
        ...this.$requiredRule(['quantity', 'boxRel', 'articleId']),
      };
    },
    units() {
      return this.model.boxRel * this.model.quantity;
    },
    article() {
      const { articleId } = this.model;
      return Article.reactiveGet(articleId);
    },
    canAddBarcode() {
      const { article, model: { barcode } } = this;
      return article && barcode
        && !(article.barcodes || []).includes(barcode);
    },
  },
  methods: {
    articleEditClosed() {
      this.showDrawer = false;
    },
    articleSaved(article) {
      if (article) {
        setTimeout(() => {
          this.model.articleId = article.id;
          if (this.canAddBarcode) {
            this.isShowingAllArticles = true;
          }
        }, 0);
      }
    },
    addArticle() {
      this.showDrawer = true;
    },
    onAddBarcodeClick() {
      const { article, model: { barcode } } = this;
      this.$saveWithLoading(async () => {
        await addBarcodeToArticle(barcode, article);
        this.isShowingAllArticles = false;
      });
    },
    toggleShowAllArticles() {
      this.isShowingAllArticles = !this.isShowingAllArticles;
    },
    modeChange(mode) {
      if (mode === 'boxes') {
        const { boxes } = this.article;
        const [box] = boxes || [];
        const { boxRel = 1 } = box || {};
        this.model.boxRel = boxRel;
      } else {
        this.model.boxRel = 1;
      }
    },
  },
  created() {
    if (this.canAddBarcode) {
      // TODO make with watch
      this.isShowingAllArticles = true;
    }
    this.$watchImmediate('units', units => {
      this.model.units = units;
    });
    this.$watchImmediate('model', model => {
      this.mode = model.boxRel > 1 ? 'boxes' : 'units';
    });
  },
  components: { ArticleEdit, ArticleSelect, ArticleView },
  i18n: {
    messages: {
      en: {
        showAll: 'Show all',
        nofFound: 'No articles for this barcode',
        addBarcode: 'Link barcode to article',
      },
      lt: {
        showAll: 'Parodyti viską',
        notFound: 'Nera šio brūkšninio kodo prekių',
        addBarcode: 'Susieti brūkšninį kodą su prekę',
      },
      ru: {
        showAll: 'Показать все',
        notFound: 'Нет номенклатуры для этого штрих-кода',
        addBarcode: 'Связать штрих-код с номенклатурой',
      },
    },
  },
};

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.el-form-item {
  text-align: right;

  &::after, &::before {
    display: none;
  }
}

.article-select, .add-barcode .el-button {
  width: 100%;
}

.add-barcode {
  margin-bottom: $padding;
}

.el-select-dropdown__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.select-button {

  display: flex;
  width: 100%;
  align-items: flex-start;

  ::v-deep input {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  .prepend {
    border: 1px solid #DCDFE6;
    border-right: none;
    border-radius: 4px 0 0 4px;
    line-height: 1;
  }

  .el-button {
    line-height: 10px;
    border: transparent;
    background-color: #F5F7FA;
  }
}

.strong {
  float: right;
  text-align: right;
  vertical-align: middle;
  font-size: 14px;
  color: $gray;
  line-height: 40px;
  font-weight: normal;
}

</style>
