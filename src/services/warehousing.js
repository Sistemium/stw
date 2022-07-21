// eslint-disable-next-line import/prefer-default-export
export function stockTakingItemInstance({ stockTakingId, articleId }) {
  return {
    stockTakingId,
    articleId,
    quantity: 1,
    boxRel: 1,
    units: 1,
    deviceCts: new Date().toJSON(),
  };
}
