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
