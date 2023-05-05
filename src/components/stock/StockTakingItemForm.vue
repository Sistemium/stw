<template lang="pug">
// eslint-disable vue/no-mutating-props
el-form.stock-taking-item-form(
  :model="model"
  ref="form"
  :rules="rules"
  :disabled="!editable"
)

  barcode-form-item(
    v-if="model.barcode"
    v-model="model.barcode"
  )
    template(#prepend)
      el-button(
        :icon="barcodeIcon"
        @click="toggleShowAllArticles"
      )

  el-form-item.add-barcode(v-if="canAddBarcode")
    el-button(
      type="warning"
      icon="el-icon-paperclip"
      @click="onAddBarcodeClick"
    ) {{ t('addBarcode') }}

  el-form-item.article(
    :label="$t('concepts.article')"
    prop="articleId"
  )
    .strong(v-if="article") {{ article.code }}
    button-prepend(
      @button-click="addArticle"
      :button-icon="article ? Edit : Plus"
    )
      article-select(
        v-model="model.articleId"
        :filters="articleFilters"
      )
        template(#empty)
          p.el-select-dropdown__empty(v-if="model.barcode && !isShowingAllArticles")
            span {{ t('notFound') }}
            el-button(@click="toggleShowAllArticles") {{ t('showAll') }}

  template(v-if="article")

    el-form-item.mode(
      v-if="editable"
      :label="$t('fields.package')"
      )
      el-radio-group(
        v-model="mode"
        @change="modeChange"
      )
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
        el-input-number(
          v-model="model.unitsInPackage"
          :min="1"
        )

    template(v-if="mode !== defaultMode")
      el-form-item(
        prop="packages"
        :label="numberOfPackages"
      )
        el-input-number(
          v-model="model.packages"
          :min="1"
          v-select-on-focus
        )

      el-form-item(
        v-if="editable || spareUnits"
        :label="$t('fields.notPackaged', [$t(`units.genitive.${measureUnitId}`)])"
      )
        el-input-number(
          v-model="spareUnits"
          :min="0"
          v-select-on-focus
        )

    el-form-item(
      v-else
      prop="units"
      :label="$t('units.quantityOf', [$t(`units.genitive.${measureUnitId}`)])"
    )
      el-input-number(
        v-model="spareUnits"
        :min="0"
        v-select-on-focus
      )

  slot(
    v-if="article"
    name="article-extra"
  )

  article-edit(
    v-if="showDrawer"
    @saved="articleSaved"
    @closed="articleEditClosed"
    :drawer-style="{ top: '50px' }"
    :article-id="model.articleId"
  )

</template>
<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
import find from 'lodash/find';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Edit, Plus } from '@element-plus/icons-vue';
import ButtonPrepend from '@/lib/ButtonPrepend.vue';
import { $requiredRule, saveWithLoading } from '@/lib/validations.js';
import ArticleSelect from '@/components/catalogue/ArticleSelect.vue';
import ArticleEdit from '@/components/catalogue/ArticleEdit.vue';
import BarcodeFormItem from '@/components/BarcodeScanner/BarcodeFormItem.vue';
import * as PackageType from '@/models/PackageType.js';
import { addBarcodeToArticle, articlePackages } from '@/services/catalogue.js';
import * as Measure from '@/models/Measure.js';
import Article from '@/models/Article.js';
import type { StockOperationItem } from '@/models/StockOperations';
// import formsMixin from '@/lib/formsMixin.js';

const DEFAULT_MODE = 'units';

const props = defineProps<{
  model: StockOperationItem;
  editable: boolean;
}>();

const showDrawer = ref(false);
const spareUnits = ref(0);
const isShowingAllArticles = ref(false);
const mode = ref(DEFAULT_MODE);

const packageTypes = computed(() => PackageType.packageTypes());
const numberOfPackages = computed(() => PackageType.numberOf(props.model.packageTypeId));
const unitsInPackageLabel = computed(() => PackageType.unitsInPackageLabel(measureUnitId.value));
const defaultMode = DEFAULT_MODE;
const measureId = computed(() => article.value?.measureId || Measure.DEFAULT_MEASURE_ID);
const packageOptions = computed(() => article.value ? articlePackages(article.value) : []);
const measureUnitId = computed(() => {
  return article.value?.measureUnitId || Measure.DEFAULT_MEASURE_UNIT_ID;
});

const barcodeIcon = computed(() => {
  return isShowingAllArticles.value ? 'el-icon-s-release' : 'el-icon-attract';
});

const articleFilters = computed(() => {
  const { barcode } = props.model;
  if (barcode && !isShowingAllArticles.value) {
    return function barcodeFilter({ barcodes }) {
      return barcodes && barcodes.includes(barcode);
    };
  }
  return {};
});


const rules = computed(() => {
  const fields = ['articleId'];
  if (mode.value === DEFAULT_MODE) {
    fields.push(DEFAULT_MODE);
  } else {
    fields.push('packages', 'unitsInPackage');
  }
  return $requiredRule(fields);
});

const units = computed(() => {
  return (spareUnits.value || 0)
    + (props.model.unitsInPackage || 1) * (props.model.packages || 0);
});

const article = computed(() => {
  const { articleId } = props.model;
  return Article.reactiveGet(articleId);
});

const canAddBarcode = computed(() => {
  const { model: { barcode } } = props;
  return article.value && barcode
    && !(article.value.barcodes || []).includes(barcode);
});


if (canAddBarcode.value) {
  // TODO make with watch
  isShowingAllArticles.value = true;
}

watch(() => props.model, () => {
  const { packages, unitsInPackage, units } = props.model;
  spareUnits.value = (units || 0) - (packages || 0) * (unitsInPackage || 0);
  mode.value = getMode();
}, { immediate: true });

watch(units, value => {
  props.model.units = value;
}, { immediate: true });

watch(article, () => {
  props.model.measureUnitId = measureUnitId.value;
  props.model.measureId = measureId.value;
  mode.value = getMode() || DEFAULT_MODE;
}, { immediate: true });


function articleEditClosed() {
  showDrawer.value = false;
}

function articleSaved(articleObj) {
  if (articleObj) {
    setTimeout(() => {
      props.model.articleId = articleObj.id;
      if (canAddBarcode.value) {
        isShowingAllArticles.value = true;
      }
    }, 0);
  }
}

function addArticle() {
  showDrawer.value = true;
}

function onAddBarcodeClick() {
  const { model: { barcode } } = props;
  saveWithLoading(async () => {
    await addBarcodeToArticle(barcode, article.value);
    isShowingAllArticles.value = false;
  });
}

function toggleShowAllArticles() {
  isShowingAllArticles.value = !isShowingAllArticles.value;
}

function modeChange(mode) {
  if (mode === DEFAULT_MODE) {
    Object.assign(props.model, {
      packageTypeId: null,
      packages: 0,
      unitsInPackage: null,
    });
  } else if (mode === 'other') {
    spareUnits.value = 0;
    const { packageTypeId } = article.value;
    props.model.packageTypeId = packageTypeId || PackageType.DEFAULT_PACKAGE_TYPE_ID;
  } else {
    const { packageTypeId, unitsInPackage } = find(packageOptions.value, { id: mode });
    Object.assign(this.model, {
      packageTypeId,
      packages: this.model.packages || 1,
      unitsInPackage,
    });
    spareUnits.value = 0;
  }
}

function packageByProps(packageTypeId, unitsInPackage) {
  return find(packageOptions.value, ({ packageTypeId, unitsInPackage }));
}

function getMode() {
  const { packages, unitsInPackage, packageTypeId } = props.model;
  if (!packages) {
    return DEFAULT_MODE;
  }
  const packageType = packageByProps(packageTypeId, unitsInPackage);
  return packageType ? packageType.id : 'other';
}

const { t } = useI18n({
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
});

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.el-form-item {
  display: block;
  text-align: right;
  :deep(label) {
    float: left;
  }
  :deep(.el-form-item__content) {
    display: block;
  }

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
  font-size: 12px;
  color: $gray;
  line-height: 24px;
  font-weight: normal;
}

</style>
