import LegalEntity from '@/models/LegalEntity';
import Storage from '@/models/Storage';
import Person from '@/models/Person';
import sumBy from 'lodash/sumBy';
import get from 'lodash/get';
import i18n from '@/i18n';

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
  const { stockOperationId, articleId, barcode } = props;
  return {
    [`${operationName}Id`]: stockOperationId,
    articleId,
    barcode,
    quantity: 1,
    boxRel: 1,
    units: 1,
    deviceCts: new Date().toJSON(),
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
  const totalCost = sumBy(positions, p => (p.price || 0) * (p.units || 0));
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
