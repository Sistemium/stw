import LegalEntity from '@/models/LegalEntity';
import Storage from '@/models/Storage';
import Person from '@/models/Person';
import StockPeriod from '@/models/StockPeriod';
// import StockWithdrawingProduct from '@/models/StockWithdrawingProduct';
import Configuration from '@/models/Configuration';
import Article from '@/models/Article';
import sumBy from 'lodash/sumBy';
import get from 'lodash/get';
import i18n from '@/i18n';
import omit from 'lodash/omit';
import isDate from 'lodash/isDate';
import orderBy from 'lodash/orderBy';

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
  });
  return orderBy(res, 'articleName');
}
