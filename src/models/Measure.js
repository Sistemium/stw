import keyBy from 'lodash/keyBy';

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
    id: 'quantity',
    unit: { piece: 1 },
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
  return Measure;
}
