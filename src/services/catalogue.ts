// import lowerFirst from 'lodash/lowerFirst';
import upperFirst from 'lodash/upperFirst';
import trim from 'lodash/trim';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import each from 'lodash/each';
import orderBy from 'lodash/orderBy';
import ArticleProp, { TYPES_DEFAULTS, VALUE_TYPES } from '@/models/ArticleProp';
import Article from '@/models/Article';
import * as PackageType from '@/models/PackageType';
import { likeLt } from '@/services/lt';
import type { BaseItem } from '@/init/Model'
import type { IArticleProp } from '@/models/ArticleProps'
import type { ArticleProperty, IArticle } from '@/models/Articles'

export function compoundName(filters: BaseItem) {
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

export function articlePropertySort(items: IArticleProp[]) {
  return orderBy(items, ['ord', 'isRequired', 'name'], ['asc', 'desc', 'asc']);
}

export function propToArticlePropMap(prop: IArticleProp) {
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
    isSKU: true,
    measureId: null,
    measureUnitId: null,
    unitPackageTypeId: null, // optional

    // packages: [{
    packageTypeId: null,
    unitsInPackage: null,
    // }],
  } as unknown as Partial<IArticle>;
}

export async function addBarcodeToArticle(barcode: string, article: IArticle) {
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

export function searchArticle(search: string): (x: IArticle) => boolean {
  if (!search) {
    return (x: IArticle) => !!x;
  }
  return (article: IArticle) => testArticle(article, likeLt(search));
}

export function testArticle(article: IArticle, re: RegExp) {
  if (!article) {
    return false;
  }
  return re.test(article.name)
    || re.test(article.code || '')
    // || !!propColumns.find(({ stringValuestringValue }) => re.test(article[id]))
    || !!article.props?.find(({ stringValue }) => re.test(stringValue || ''));
}

export function searchByArticle(search: string) {
  const articleFilter = searchArticle(search);
  return ({ articleId }: BaseItem) => articleId && articleFilter(Article.reactiveGet(articleId));
}

export function articlePackages(article: IArticle) {
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
    const res: IArticle & BaseItem = {
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
    .filter(x => !!x) as IArticleProp[]
  return {
    rows: orderBy(rows, 'name'),
    propColumns: articlePropertySort(propColumns),
  };
}
