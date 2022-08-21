import LegalEntity from '@/models/LegalEntity';
import Storage from '@/models/Storage';
import Person from '@/models/Person';
import Configuration from '@/models/Configuration';
import sumBy from 'lodash/sumBy';
import get from 'lodash/get';
import i18n from '@/i18n';
import omit from 'lodash/omit';
import isDate from 'lodash/isDate';

export function stockTakingItemInstance({ stockTakingId, articleId, barcode }) {
  return {
    stockTakingId,
    articleId,
    barcode,
    quantity: 1,
    boxRel: 1,
    units: 1,
    deviceCts: new Date().toJSON(),
  };
}

export function stockOperationItemInstance(operationName, props) {
  const { stockOperationId } = props;
  return {
    [`${operationName}Id`]: stockOperationId,
    articleId: null,
    barcode: null,
    // quantity: 1,
    // boxRel: 1,
    units: 1,

    packages: null,
    packageTypeId: null,
    unitsInPackage: 1,

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
  const counterparty = getCounterparty(item);
  const positions = positionsModel.reactiveFilter({ [`${operationName}Id`]: item.id });
  const priceField = configPriceField(operationName);
  const totalCost = sumBy(positions, p => (p[priceField] || 0) * (p.units || 0));
  return {
    ...item,
    processing: i18n.t(`workflow.${item.processing || 'progress'}`),
    // date: this.$ts(item.date, 'short'),
    counterparty,
    counterpartyName: get(counterparty, 'name'),
    positionsCount: positions.length,
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
