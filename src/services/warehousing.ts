import LegalEntity from '@/models/LegalEntity'
import Storage from '@/models/Storage'
import Person from '@/models/Person'
import StockPeriod, { type IStockPeriod } from '@/models/StockPeriod'
import StockArticleDate from '@/models/StockArticleDate'
import Configuration from '@/models/Configuration'
import Article from '@/models/Article'
import sumBy from 'lodash/sumBy'
import get from 'lodash/get'
import i18n from '@/i18n'
import omit from 'lodash/omit'
import map from 'lodash/map'
import isDate from 'lodash/isDate'
import orderBy from 'lodash/orderBy'
import flatten from 'lodash/flatten'
import filter from 'lodash/filter'
import groupBy from 'lodash/groupBy'
import StockReceivingItem from '@/models/StockReceivingItem'
import uniq from 'lodash/uniq'
import StockReceiving from '@/models/StockReceiving'
import StockWithdrawingItem from '@/models/StockWithdrawingItem'
import StockWithdrawing from '@/models/StockWithdrawing'
import StockTakingItem from '@/models/StockTakingItem'
import StockTaking from '@/models/StockTaking'
import { testArticle } from '@/services/catalogue'
import { likeLt } from '@/services/lt'
import Model, { type BaseItem } from '@/init/Model'
import type { VatConfig } from '@/services/vatConfiguring'
import type { CounterpartyType, StockOperation, StockOperationName } from '@/models/StockOperations'
import type { IArticle } from '@/models/Articles'

interface STI {
  stockTakingId: string
  articleId: string | null
  barcode?: string | null
  vatRate: number
}

export function stockTakingItemInstance(item: STI) {
  const { stockTakingId, articleId, barcode, vatRate } = item
  return {
    stockTakingId,
    articleId,
    barcode,
    units: 1,
    packages: null,
    packageTypeId: null,
    unitsInPackage: null,
    vatRate,
    price: null,
    vatPrice: null,

    measureId: null,
    measureUnitId: null,

    deviceCts: new Date().toJSON(),
  };
}

export interface CounterPartyRef extends Record<string, any> {
  counterpartyType?: CounterpartyType
  counterpartyId?: string | null
}

export function stockOperationItemInstance(operationName: StockOperationName, props: Record<string, any>) {
  const { stockOperationId } = props;
  return {
    [`${operationName}Id`]: stockOperationId,
    articleId: null,
    barcode: null,
    units: 1,

    packages: null,
    packageTypeId: null,
    unitsInPackage: null,

    measureId: null,
    measureUnitId: null,

    deviceCts: new Date().toJSON(),
    price: null,
    vatPrice: null,
    ...omit(props, 'stockOperationId'),
  };
}

export const CONSIGNEE_TYPES = new Map<CounterpartyType, Model>([
  ['Person', Person],
  ['LegalEntity', LegalEntity],
  ['Storage', Storage],
]);

export function counterpartyModel(type: CounterpartyType) {
  return type && CONSIGNEE_TYPES.get(type);
}

export function getCounterparty({ counterpartyType, counterpartyId }: CounterPartyRef) {
  if (!counterpartyType) {
    return null
  }
  const model = CONSIGNEE_TYPES.get(counterpartyType);
  if (!model || !counterpartyId) {
    return null;
  }
  return model.reactiveGet(counterpartyId);
}

interface StockOperationViewData extends StockOperation {
  processingLabel: string
  counterparty: BaseItem | null
  counterpartyName: string
  positionsCount: number | null
  units: number | null
  totalCost: string | null
}

export function stockOperationToViewData(item: StockOperation, positionsModel: Model, operationName: StockOperationName): StockOperationViewData {
  const childFilter = { [`${operationName}Id`]: item.id };
  const counterparty = getCounterparty(item);
  const positions: BaseItem[] = positionsModel.reactiveFilter(childFilter);
  const priceField = configPriceField(operationName);
  const costFn = (p: BaseItem) => (p[priceField] || 0) * (p.units || 0);
  // const products = operationName === 'stockWithdrawing'
  //   ? StockWithdrawingProduct.reactiveFilter(childFilter) : [];
  const totalCost = sumBy(positions, costFn);
  return {
    ...item,
    // @ts-ignore
    processingLabel: i18n.global.t(`workflow.${item.processing || 'progress'}`),
    // date: this.$ts(item.date, 'short'),
    counterparty,
    counterpartyName: get(counterparty, 'name'),
    positionsCount: positions.length,
    // productsCount: products.length,
    units: sumBy(positions, 'units'),
    totalCost: totalCost ? i18n.global.n(totalCost) : null,
  };
}

export function vatConfig(date: Date | string = new Date()) {
  const stringDate = isDate(date) ? date.toISOString() : date;
  const [config] = Configuration.reactiveFilter({
    type: 'vat',
    dateB: { $lte: stringDate },
    dateE: { $gte: stringDate },
  });
  return (config || {}) as VatConfig;
}

export function searchOperations(search: string, itemsModel: Model, parentKey: string): (_: BaseItem) => boolean {
  if (!search) {
    return () => true;
  }
  const re = likeLt(search);
  return (operation: BaseItem) => {
    const { commentText, counterpartyId, counterpartyType } = operation;
    return re.test(commentText)
      || (counterpartyType === 'LegalEntity' && counterPartyTest(LegalEntity, counterpartyId, re))
      || (counterpartyType === 'Storage' && counterPartyTest(Storage, counterpartyId, re))
      || !!positionsTest(itemsModel.reactiveManyByIndex(parentKey, operation.id), re);
  };
}

function counterPartyTest(model: Model, id: string, re: RegExp) {
  return re.test(get(model.reactiveGet(id) as Record<string, any>, 'name'));
}

function positionsTest(positions: { articleId?: string}[], re: RegExp) {
  if (!positions) {
    return false;
  }
  return positions.find(({ articleId }) => testArticle(Article.reactiveGet(articleId), re));
}

export function configPriceField(operationName: StockOperationName, date: Date | string = new Date()) {
  const { rules } = vatConfig(date);
  const vatPrices = rules && rules.vatPrices[operationName];
  return vatPrices ? 'vatPrice' : 'price';
}

export async function findStockPeriod(storageId: string, dateB: string | Date, dateE: string | Date) {
  const data = await StockPeriod.find({
    storageId,
    dateB,
    dateE,
  }, { cacheResponse: false });
  const res = data.map(item => {
    const article = Article.getByID(item.articleId);
    return {
      ...item,
      article,
      articleName: get(article, 'name'),
    };
  })
    .filter(({ article }) => article);
  return orderBy(res, 'articleName') as (IStockPeriod & { article: IArticle })[];
}

export async function findStockPeriodOperations(articleId: string, storageId: string, dateB: Date, dateE: Date) {
  const data = await StockArticleDate.find({
    articleId,
    storageId,
    date: {
      $lt: dateE,
      $gt: dateB,
    },
  }, { cacheResponse: false });
  const res = orderBy(data, 'date')
    .map(({ operations }) => operations);
  const { fix, in: incoming, out } = groupBy(flatten(res), 'operationType');
  return {
    fix: fix && await loadOperationsFix(fix),
    in: incoming && await loadOperationsIn(incoming),
    out: out && await loadOperationsOut(out),
  };
}

async function loadOperationsIn(operations: BaseItem[] = []) {
  return loadOperationsInOut(operations, StockReceivingItem, StockReceiving, 'stockReceivingId');
}

async function loadOperationsOut(operations: BaseItem[] = []) {
  return loadOperationsInOut(operations, StockWithdrawingItem, StockWithdrawing, 'stockWithdrawingId');
}

async function loadOperationsFix(operations: BaseItem[] = []) {
  return loadOperationsInOut(operations, StockTakingItem, StockTaking, 'stockTakingId');
}

async function loadOperationsInOut(operations: BaseItem[], itemsModel: Model, parentModel: Model, relation: string) {
  const ids = map(operations, 'operationId');
  await loadNotCachedIds(itemsModel, ids);
  const items = itemsModel.filter({ id: { $in: ids } });
  await loadRelation(parentModel, items, relation);
  const parentIds = uniq(filter(map(items, relation)));
  const parents = parentModel.filter({ id: { $in: parentIds } });
  await loadCounterparty(parents as CounterPartyRef[]);
  const res = items.map(operation => {
    const parent = parentModel.getByID(operation[relation]);
    if (!parent) {
      throw Error('Empty parent in loadOperationsInOut')
    }
    return {
      ...operation,
      date: get(parent, 'date'),
      counterParty: getCounterparty(parent as CounterPartyRef),
      parentId: parent.id,
      commentText: parent.commentText,
    };
  });
  return orderBy(res, 'date');
}

async function loadCounterparty(records: CounterPartyRef[] = []) {
  const withLegalEntity = filter(records, { counterpartyType: 'LegalEntity' });
  await loadRelation(LegalEntity, withLegalEntity, 'counterpartyId');
  const withPerson = filter(records, { counterpartyType: 'Person' });
  await loadRelation(Person, withPerson, 'counterpartyId');
  const withStorage = filter(records, { counterpartyType: 'Storage' });
  await loadRelation(Storage, withStorage, 'counterpartyId');
}


async function loadRelation(model: Model, records: BaseItem[], relation: string) {
  const ids = filter<string>(uniq(map(records, relation)));
  await loadNotCachedIds(model, ids);
}

async function loadNotCachedIds(model: Model, ids: string[] = []) {
  const toLoad = ids.filter(id => !model.getByID(id));
  await model.findByMany(toLoad);
}
