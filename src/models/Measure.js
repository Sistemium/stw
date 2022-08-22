import keyBy from 'lodash/keyBy';
import i18n from '@/i18n';

export const DEFAULT_MEASURE_ID = 'quantity';
export const DEFAULT_MEASURE_UNIT_ID = 'piece';

export const Measure = [
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
];

export default Measure;

export function keyedMeasures() {
  return keyBy(Measure, 'id');
}

export function measures() {
  return Measure.map(measure => ({
    ...measure,
    name: i18n.t(`measures.${measure.id}`),
  }));
}
