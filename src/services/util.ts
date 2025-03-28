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

export async function loadRelation(model: Model, records: BaseItem[], relation: string) {
  const ids = filter<string>(uniq(map(records, relation)))
  await loadNotCachedIds(model, ids)
}

export async function loadNotCachedIds(model: Model, ids: string[] = []) {
  const toLoad = ids.filter(id => !model.getByID(id))
  await model.findByMany(toLoad)
}
