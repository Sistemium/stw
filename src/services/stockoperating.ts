import flatten from 'lodash/flatten';
import orderBy from 'lodash/orderBy';
import dayjs from 'dayjs';
import { computed } from 'vue';
import { StockOperation, StockOperationItem } from '@/models/StockOperations';
import Article from '@/models/Article.js';
import Storage from '@/models/Storage.js';
import { MaterialFields } from '@/models/Recipes';
import { t, tGen } from '@/lib/validations';
import { getCounterparty } from '@/services/warehousing.js';
import { useInvStore } from '@/store/invStore';
import StockWithdrawing from '@/models/StockWithdrawing.js';
import StockWithdrawingItem from '@/models/StockWithdrawingItem.js';

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

export function useStorage() {
  const store = useInvStore();

  const storageId = computed({
    get() {
      return store.currentStorageId;
    },
    set(id) {
      store.currentStorageId = id;
    },
  });

  return { storageId };
}

export function actHeadRows(stockOperation: StockOperation, operationName: string, counterpartyRole: string) {
  const { date, storageId } = stockOperation;
  const counterparty = getCounterparty(stockOperation);
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
      label: t(`fields.${counterpartyRole}`),
      value: counterparty?.name,
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

export interface StockOperationReportItem extends StockOperationItem {
  date: string;
}

export async function withdrawingReportData(storageId, counterpartyId, dateB, dateE): Promise<StockOperationReportItem[]> {

  const headers = await StockWithdrawing.find({
    storageId,
    counterpartyId,
    date: {
      $gte: dateB,
      $lte: dateE,
    },
  });

  if (!headers) {
    return [];
  }

  const ids = headers.map(({ id }) => id);

  const items = await StockWithdrawingItem.findByMany(ids, { field: 'stockWithdrawingId' });

  return orderBy(items.map(item => {
    const stockWithdrawing = StockWithdrawing.getByID(item.stockWithdrawingId);
    return {
      ...item,
      date: stockWithdrawing.date,
    };
  }), ['date']);

}
