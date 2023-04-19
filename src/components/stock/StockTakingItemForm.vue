<template lang="pug">
// eslint-disable vue/no-mutating-props
el-form.stock-taking-item-form(
  :model="model"
  ref="form"
  :rules="rules"
  :disabled="!editable"
)

  barcode-form-item(v-model="model.barcode" v-if="model.barcode")
    template(#default:prepend)
      el-button(:icon="barcodeIcon" @click="toggleShowAllArticles")

  el-form-item.add-barcode(v-if="canAddBarcode")
    el-button(
      type="warning"
      icon="el-icon-paperclip"
      @click="onAddBarcodeClick"
    ) {{ $t('addBarcode') }}

  el-form-item.article(:label="$t('concepts.article')" prop="articleId")
    .strong(v-if="article") {{ article.code }}
    button-prepend(
      @button-click="addArticle"
      :button-icon="`el-icon-${article ? 'edit' : 'plus'}`"
    )
      article-select(v-model="model.articleId" :filters="articleFilters")
        template(#empty v-if="model.barcode && !isShowingAllArticles")
          p.el-select-dropdown__empty
            span {{ $t('notFound') }}
            el-button(@click="toggleShowAllArticles") {{ $t('showAll') }}

  template(v-if="article")

    el-form-item.mode(:label="$t('fields.package')" v-if="editable")
      el-radio-group(v-model="mode" @change="modeChange")
        el-radio-button(label="other") {{ $t('concepts.other') }}
        el-radio-button(
          v-for="p in packageOptions"
          :key="p.id"
          :label="p.id"
        ) {{ p.name }} x {{ p.unitsInPackage }}
        el-radio-button(:label="defaultMode") {{ $t(`units.${measureUnitId}`) }}

    template(v-if="mode === 'other' || (!editable && model.packageTypeId)")
      el-form-item(
        prop="packageTypeId"
        :label="$t('concepts.packageType')"
      )
        el-select(v-model="model.packageTypeId")
          el-option(
            v-for="{id, name} in packageTypes"
            :key="id"
            :label="name"
            :value="id"
          )
      el-form-item(
        prop="unitsInPackage"
        :label="unitsInPackageLabel"
      )
        el-input-number(v-model="model.unitsInPackage" :min="1")

    template(v-if="mode !== defaultMode")
      el-form-item(
        prop="packages"
        :label="numberOfPackages"
      )
        el-input-number(v-model="model.packages" :min="1" v-select-on-focus)

      el-form-item(
        v-if="editable || spareUnits"
        :label="$t('fields.notPackaged', [$t(`units.genitive.${measureUnitId}`)])"
      )
        el-input-number(v-model="spareUnits" :min="0" v-select-on-focus)

    el-form-item(
      v-else
      prop="units"
      :label="$t('units.quantityOf', [$t(`units.genitive.${measureUnitId}`)])"
    )
      el-input-number(v-model="spareUnits" :min="0" v-select-on-focus)

  slot(name="article-extra" v-if="article")

  article-edit(
    v-if="showDrawer"
    @saved="articleSaved"
    @closed="articleEditClosed"
    :drawer-style="{ top: '50px' }"
    :article-id="model.articleId"
  )

</template>
<script>
/* eslint-disable vue/no-mutating-props */
import Article from '@/models/Article';
import * as PackageType from '@/models/PackageType';
import * as Measure from '@/models/Measure';
// import ArticleView from '@/components/catalogue/ArticleView.vue';
import ArticleSelect from '@/components/catalogue/ArticleSelect.vue';
import { addBarcodeToArticle, articlePackages } from '@/services/catalogue';
import ArticleEdit from '@/components/catalogue/ArticleEdit.vue';
import BarcodeFormItem from '@/components/BarcodeScanner/BarcodeFormItem.vue';
import ButtonPrepend from '@/lib/ButtonPrepend.vue';
import formsMixin from '@/lib/formsMixin';

const DEFAULT_MODE = 'units';

export default {
  name: 'StockTakingItemForm',
  props: {
    model: Object,
    editable: Boolean,
  },
  data() {
    return {
      showDrawer: false,
      spareUnits: 0,
      isShowingAllArticles: false,
      mode: DEFAULT_MODE,
    };
  },
  mixins: [formsMixin],
  computed: {
    numberOfPackages() {
      return PackageType.numberOf(this.model.packageTypeId);
    },
    unitsInPackageLabel() {
      return PackageType.unitsInPackageLabel(this.measureUnitId);
    },
    defaultMode() {
      return DEFAULT_MODE;
    },
    // measures: Measure.measures,
    measureUnitId() {
      const { measureUnitId } = this.article || {};
      return measureUnitId || Measure.DEFAULT_MEASURE_UNIT_ID;
    },
    measureId() {
      const { measureId } = this.article || {};
      return measureId || Measure.DEFAULT_MEASURE_ID;
    },
    packageTypes() {
      return PackageType.packageTypes();
    },
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
    packageOptions() {
      const { article } = this;
      return article ? articlePackages(article) : [];
    },
    rules() {
      const fields = ['articleId'];
      if (this.mode === DEFAULT_MODE) {
        fields.push(DEFAULT_MODE);
      } else {
        fields.push('packages', 'unitsInPackage');
      }
      return this.$requiredRule(fields);
    },
    units() {
      return (this.spareUnits || 0)
        + (this.model.unitsInPackage || 1) * (this.model.packages || 0);
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
      if (mode === DEFAULT_MODE) {
        Object.assign(this.model, {
          packageTypeId: null,
          packages: 0,
          unitsInPackage: null,
        });
      } else if (mode === 'other') {
        this.spareUnits = 0;
        const { packageTypeId } = this.article;
        this.model.packageTypeId = packageTypeId || PackageType.DEFAULT_PACKAGE_TYPE_ID;
      } else {
        const { packageTypeId, unitsInPackage } = this.$find(this.packageOptions, { id: mode });
        Object.assign(this.model, {
          packageTypeId,
          packages: this.model.packages || 1,
          unitsInPackage,
        });
        this.spareUnits = 0;
      }
    },
    packageByProps(packageTypeId, unitsInPackage) {
      return this.$find(this.packageOptions, ({ packageTypeId, unitsInPackage }));
    },
    getMode() {
      const { packages, unitsInPackage, packageTypeId } = this.model;
      if (!packages) {
        return DEFAULT_MODE;
      }
      const packageType = this.packageByProps(packageTypeId, unitsInPackage);
      return packageType ? packageType.id : 'other';
    },
  },
  created() {
    if (this.canAddBarcode) {
      // TODO make with watch
      this.isShowingAllArticles = true;
    }
    this.$watchImmediate('model', () => {
      const { packages, unitsInPackage, units } = this.model;
      this.spareUnits = (units || 0) - (packages || 0) * (unitsInPackage || 0);
      this.mode = this.getMode();
    });
    this.$watchImmediate(DEFAULT_MODE, units => {
      this.model.units = units;
    });
    this.$watchImmediate('article', () => {
      this.model.measureUnitId = this.measureUnitId;
      this.model.measureId = this.measureId;
      this.mode = this.getMode() || DEFAULT_MODE;
    });
  },
  components: {
    ButtonPrepend,
    BarcodeFormItem,
    ArticleEdit,
    ArticleSelect,
    // ArticleView,
  },
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
