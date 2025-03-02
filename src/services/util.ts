import dayjs from 'dayjs'
import { computed } from 'vue'
import orderBy from 'lodash/orderBy'
import Model, { type BaseItem } from '@/init/Model'
import { useRouteParams } from '@/lib/updateRouteParams'
import filter from 'lodash/filter'
import uniq from 'lodash/uniq'
import map from 'lodash/map'

export function orderByName<T = BaseItem>(items: T[]) {
  return orderBy(items, 'name')
}

export function orderByDateDesc<T = BaseItem>(items: T[]) {
  return orderBy(items, ['date'], ['desc'])
}

export function useSearch() {
  const { updateRouteParams, route } = useRouteParams()
  const search = computed<string>({
    get() {
      return route.query.search as string || ''
    },
    set(search) {
      updateRouteParams({}, { search: search || undefined })
        .then()
    },
  })

  return {
    search,
  }
}

export interface ColumnInfo<T = any> {
  width: number
  key?: string
  title: string
  dataKey?: string
  align: 'center' | 'right' | 'left'
  class?: string
  headerClass?: string // can be fn actually

  cellRenderer(data: {
    rowData: T
    cellData: any
  }): any
}

export function todayStringDate() {
  return dayjs().toJSON()
}

export function useDateRange() {
  const { updateRouteParams, route } = useRouteParams()
  const today = dayjs().endOf('day')
  const monthAgo = today.add(-12, 'month')
  const dateRange = computed({
    get() {
      const { dateB, dateE } = route.query
      return resetDates(dateB as string, dateE as string)
    },
    set(val) {
      const [dateB, dateE] = val || [monthAgo, today]
      updateRouteParams({}, {
        dateB: dayjs(dateB).toJSON(),
        dateE: dayjs(dateE).toJSON(),
      })
        .then()
    },
  })

  function resetDates(dateB?: string, dateE?: string) {
    return [
      dayjs(dateB || monthAgo).startOf('day').toDate(),
      dayjs(dateE || today).endOf('day').toDate(),
    ]
  }

  return { dateRange }
}

export async function loadRelation(model: Model, records: BaseItem[], relation: string) {
  const ids = filter<string>(uniq(map(records, relation)))
  await loadNotCachedIds(model, ids)
}

export async function loadNotCachedIds(model: Model, ids: string[] = []) {
  const toLoad = ids.filter(id => !model.getByID(id))
  await model.findByMany(toLoad)
}
