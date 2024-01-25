// import lowerFirst from 'lodash/lowerFirst';
import upperFirst from 'lodash/upperFirst';
import trim from 'lodash/trim';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import each from 'lodash/each';
import orderBy from 'lodash/orderBy';
import ArticleProp, { TYPES_DEFAULTS, VALUE_TYPES } from '@/models/ArticleProp.ts';
import Article from '@/models/Article.ts';
import * as PackageType from '@/models/PackageType.js';
import { likeLt } from '@/services/lt.js';

export function compoundName(filters) {
  const res = map(filters, filter => {
    const { stringValue, numberValue } = filter;
    const simple = stringValue || numberValue;
    const prop = filter.prop || ArticleProp.getByID(filter.propId) || {};
    const { isNaming } = prop;
    if ((!isNaming && !filter.isNaming) || filter.isNaming === false) {
      return null;
    }
    if (simple) {
      const { prefix, suffix } = prop;
      return [prefix, trim(simple), suffix]
        .filter(a => a)
        .join('');
    }
    const { boolValue } = filter;
    if (boolValue !== undefined && prop) {
      return boolValue ? prop.name : prop.inverse;
    }
    return '';
  })
    .filter(x => x)
    // .map(lowerFirst)
    .join(' ');
  return upperFirst(trim(res));
}

export function articlePropertySort(items) {
  return orderBy(items, ['ord', 'isRequired', 'name'], ['asc', 'desc', 'asc']);
}

export function propToArticlePropMap(prop) {
  const { type } = prop;
  return {
    propId: prop.id,
    type,
    [VALUE_TYPES[type]]: TYPES_DEFAULTS[type],
  };
}

export function articleInstance() {
  const props = articlePropertySort(ArticleProp.filter({ isRequired: true }))
    .map(propToArticlePropMap);
  return {
    name: '',
    props,
    boxes: [],
    isCustomName: false,
    measureId: null,
    measureUnitId: null,
    unitPackageTypeId: null, // optional

    // packages: [{
    packageTypeId: null,
    unitsInPackage: null,
    // }],
  };
}

export async function addBarcodeToArticle(barcode, article) {
  const { barcodes } = article;
  const props = {
    ...article,
    barcodes: uniq([
      ...(barcodes || []),
      barcode,
    ]),
  };
  return Article.createOne(props);
}

export function searchArticle(search, propColumns = []) {
  if (!search) {
    return x => x;
  }
  return article => testArticle(article, likeLt(search), propColumns);
}

export function testArticle(article, re, propColumns = []) {
  if (!article) {
    return false;
  }
  return re.test(article.name)
    || re.test(article.code)
    || propColumns.find(({ id }) => re.test(article[id]))
    || article.props?.find(({ stringValue }) => re.test(stringValue));
}

export function searchByArticle(search) {
  const articleFilter = searchArticle(search);
  return ({ articleId }) => articleId && articleFilter(Article.reactiveGet(articleId));
}

export function articlePackages(article) {
  const { packageTypeId, unitsInPackage } = article;
  if (!packageTypeId) {
    return [];
  }
  return [{
    packageTypeId,
    unitsInPackage,
    ...(PackageType.getById(packageTypeId) || {}),
    id: `${packageTypeId}|${unitsInPackage}`,
  }];
}


export function catalogueData() {
  const allProps = new Map();
  const rows = map(Article.reactiveFilter(), item => {
    const res = {
      ...item,
    };
    each(item.props, ({ propId, stringValue, numberValue }) => {
      allProps.set(propId, true);
      res[propId] = stringValue || numberValue;
    });
    return res;
  });
  const propColumns = Array.from(allProps.keys())
    .map(id => {
      const prop = ArticleProp.reactiveGet(id);
      if (prop.isNaming) {
        return false;
      }
      return {
        ...prop,
        align: prop.type === 'number' ? 'right' : 'left',
      };
    })
    .filter(x => !!x);
  return {
    rows: orderBy(rows, 'name'),
    propColumns: articlePropertySort(propColumns),
  };
}
