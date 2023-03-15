import LegalEntity from '@/models/LegalEntity';
import Storage from '@/models/Storage';
import Person from '@/models/Person';
import StockPeriod from '@/models/StockPeriod';
import StockArticleDate from '@/models/StockArticleDate';
// import StockWithdrawingProduct from '@/models/StockWithdrawingProduct';
import Configuration from '@/models/Configuration';
import Article from '@/models/Article';
import sumBy from 'lodash/sumBy';
import get from 'lodash/get';
import i18n from '@/i18n';
import omit from 'lodash/omit';
import map from 'lodash/map';
import isDate from 'lodash/isDate';
import orderBy from 'lodash/orderBy';
import flatten from 'lodash/flatten';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import StockReceivingItem from '@/models/StockReceivingItem';
import uniq from 'lodash/uniq';
import StockReceiving from '@/models/StockReceiving';
import StockWithdrawingItem from '@/models/StockWithdrawingItem';
import StockWithdrawing from '@/models/StockWithdrawing';
import StockTakingItem from '@/models/StockTakingItem';
import StockTaking from '@/models/StockTaking';

export function stockTakingItemInstance({ stockTakingId, articleId, barcode }) {
  return {
    stockTakingId,
    articleId,
    barcode,
    units: 1,
    packages: null,
    packageTypeId: null,
    unitsInPackage: null,

    measureId: null,
    measureUnitId: null,

    deviceCts: new Date().toJSON(),
  };
}

export function stockOperationItemInstance(operationName, props) {
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

export const CONSIGNEE_TYPES = new Map([
  ['Person', Person],
  ['LegalEntity', LegalEntity],
  ['Storage', Storage],
]);

export function counterpartyModel(type) {
  return type && CONSIGNEE_TYPES.get(type);
}

export function getCounterparty({ counterpartyType, counterpartyId }) {
  const model = CONSIGNEE_TYPES.get(counterpartyType);
  if (!model) {
    return null;
  }
  return model.reactiveGet(counterpartyId);
}

export function stockOperationToViewData(item, positionsModel, operationName) {
  const childFilter = { [`${operationName}Id`]: item.id };
  const counterparty = getCounterparty(item);
  const positions = positionsModel.reactiveFilter(childFilter);
  const priceField = configPriceField(operationName);
  const costFn = p => (p[priceField] || 0) * (p.units || 0);
  // const products = operationName === 'stockWithdrawing'
  //   ? StockWithdrawingProduct.reactiveFilter(childFilter) : [];
  const totalCost = sumBy(positions, costFn);
  return {
    ...item,
    processing: i18n.t(`workflow.${item.processing || 'progress'}`),
    // date: this.$ts(item.date, 'short'),
    counterparty,
    counterpartyName: get(counterparty, 'name'),
    positionsCount: positions.length,
    // productsCount: products.length,
    units: sumBy(positions, 'units'),
    totalCost: totalCost ? i18n.n(totalCost) : null,
  };
}

export function vatConfig(date = new Date()) {
  const stringDate = isDate(date) ? date.toISOString() : date;
  const [config] = Configuration.reactiveFilter({
    type: 'vat',
    dateB: { $lte: stringDate },
    dateE: { $gte: stringDate },
  });
  return config;
}

export function configPriceField(operationName, date = new Date()) {
  const { rules } = vatConfig(date);
  const vatPrices = rules.vatPrices[operationName];
  return vatPrices ? 'vatPrice' : 'price';
}

export async function findStockPeriod(storageId, dateB, dateE) {
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
  return orderBy(res, 'articleName');
}

export async function findStockPeriodOperations(articleId, storageId, dateB, dateE) {
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

async function loadOperationsIn(operations = []) {
  return loadOperationsInOut(operations, StockReceivingItem, StockReceiving, 'stockReceivingId');
}

async function loadOperationsOut(operations = []) {
  return loadOperationsInOut(operations, StockWithdrawingItem, StockWithdrawing, 'stockWithdrawingId');
}

async function loadOperationsFix(operations = []) {
  return loadOperationsInOut(operations, StockTakingItem, StockTaking, 'stockTakingId');
}

async function loadOperationsInOut(operations, itemsModel, parentModel, relation) {
  const ids = map(operations, 'operationId');
  await loadNotCachedIds(itemsModel, ids);
  const items = itemsModel.filter({ id: { $in: ids } });
  await loadRelation(parentModel, items, relation);
  const parentIds = uniq(filter(map(items, relation)));
  const parents = parentModel.filter({ id: { $in: parentIds } });
  await loadCounterparty(parents);
  return items.map(operation => {
    const parent = parentModel.getByID(operation[relation]);
    return {
      ...operation,
      date: get(parent, 'date'),
      counterParty: getCounterparty(parent),
    };
  });
}

async function loadCounterparty(records = []) {
  const withLegalEntity = filter(records, { counterpartyType: 'LegalEntity' });
  await loadRelation(LegalEntity, withLegalEntity, 'counterpartyId');
  const withPerson = filter(records, { counterpartyType: 'Person' });
  await loadRelation(Person, withPerson, 'counterpartyId');
  const withStorage = filter(records, { counterpartyType: 'Storage' });
  await loadRelation(Storage, withStorage, 'counterpartyId');
}

/**
 *
 * @param {HybridDataModel} model
 * @param {Array} records
 * @param {string} relation
 * @return {Promise<void>}
 */

async function loadRelation(model, records, relation) {
  const ids = filter(uniq(map(records, relation)));
  await loadNotCachedIds(model, ids);
}

/**
 *
 * @param {HybridDataModel} model
 * @param {Array} ids
 * @return {Promise<void>}
 */
async function loadNotCachedIds(model, ids = []) {
  const toLoad = ids.filter(id => !model.getByID(id));
  await model.findByMany(toLoad);
}
