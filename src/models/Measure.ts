import keyBy from 'lodash/keyBy'
import { t } from '@/lib/validations'
import type { BaseItem } from '@/init/Model'

export const DEFAULT_MEASURE_ID = 'quantity'
export const DEFAULT_MEASURE_UNIT_ID = 'piece'

export type MeasureID = 'weight' | 'volume' | 'length' | 'quantity'
export type MeasureUnitID = 'gram' | 'kilogram' | 'tonne'
  | 'millilitre' | 'litre' | 'centimetre'
  | 'metre' | 'piece'

interface IMeasure {
  id: MeasureID
  unit: Partial<Record<MeasureUnitID, number>>
  measureType: string
}

export const Measure: IMeasure[] = [
  {
    id: 'weight',
    unit: { gram: 0.001, kilogram: 1, tonne: 1000 },
    measureType: '3d',
  },
  {
    id: 'volume',
    unit: { litre: 1, millilitre: 0.001 },
    measureType: '3d',
  },
  {
    id: DEFAULT_MEASURE_ID,
    unit: { [DEFAULT_MEASURE_UNIT_ID]: 1 },
    measureType: 'discreet',
  },
  {
    id: 'length',
    unit: { metre: 1, centimetre: 0.01 },
    measureType: '1d',
  },
]

export function keyedMeasures() {
  return keyBy(Measure, 'id')
}

export function measures(): (IMeasure & { name: string })[] {
  return Measure.map(measure => ({
    ...measure,
    name: t(`measures.${measure.id}`),
  }))
}

export function measureUnits(measureId: MeasureID) {
  if (!measureId) {
    return []
  }
  const { unit = {} }: { unit: BaseItem } = keyedMeasures()[measureId] || {}
  return Object.keys(unit)
    .map(id => ({
      id,
      name: t(`units.${id}`),
      ratio: unit[id] || 1,
    }))
}
