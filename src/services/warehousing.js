import LegalEntity from '@/models/LegalEntity';
import Storage from '@/models/Storage';
import Person from '@/models/Person';

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

export function stockWithdrawingItemInstance({ stockWithdrawingId, articleId, barcode }) {
  return {
    stockWithdrawingId,
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
