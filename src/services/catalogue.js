// import lowerFirst from 'lodash/lowerFirst';
import upperFirst from 'lodash/upperFirst';
import trim from 'lodash/trim';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import ArticleProp, { TYPES_DEFAULTS, VALUE_TYPES } from '@/models/ArticleProp';
import orderBy from 'lodash/orderBy';
import Article from '@/models/Article';

// eslint-disable-next-line import/prefer-default-export
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
  const re = new RegExp(search, 'i');
  return article => re.test(article.name)
    || re.test(article.code)
    || propColumns.find(({ id }) => re.test(article[id]));
}

export function searchByArticle(search) {
  const articleFilter = searchArticle(search);
  return ({ articleId }) => articleId && articleFilter(Article.reactiveGet(articleId));
}
