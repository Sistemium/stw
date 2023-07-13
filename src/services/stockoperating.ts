import flatten from 'lodash/flatten';
import dayjs from 'dayjs';
import { StockOperation, StockOperationItem } from '@/models/StockOperations';
import Article from '@/models/Article.js';
import Storage from '@/models/Storage.js';
import { MaterialFields } from '@/models/Recipes';
import { t, tGen } from '@/lib/validations';
import { getCounterparty } from '@/services/warehousing.js';

interface StockOperationActItem extends MaterialFields {
  name: string;
  code: string;
}

export function stockOperationAct(items: StockOperationItem[]): StockOperationActItem[] {

  const materializedItems = flatten(items.map(item => {
    const { materials, units } = item;
    if (!materials) {
      return [item as MaterialFields];
    }
    return materials
      .map(material => ({
        ...material,
        units: units * material.units,
      }));
  }));

  return materializedItems.map(item => {
    const article = Article.reactiveGet(item.articleId);
    return {
      ...item,
      name: article?.name,
      code: article?.code,
    };
  });
}

export function actHeadRows(stockOperation: StockOperation, operationName) {
  const { date, storageId } = stockOperation;
  return [
    {
      title: tGen('act', operationName),
    },
    {},
    {
      label: t('concepts.storage'),
      value: Storage.reactiveGet(storageId)?.name,
    },
    {
      label: t('fields.date'),
      value: `${dayjs(date).format('YYYY-MM-DDThh:mm:ss')}Z`,
      dataType: 'date',
      numFmt: 'yyyy-mm-dd hh:mm',
    },
    {
      label: t('fields.consignee'),
      value: getCounterparty(stockOperation)?.name,
    },
    {
      label: t('fields.commentText'),
      value: stockOperation.commentText,
    },
    {
      label: t('fields.id'),
      value: stockOperation.id,
    },
    {},
  ];
}
