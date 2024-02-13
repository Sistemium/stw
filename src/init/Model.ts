// @ts-ignore
import HybridDataModel from './HybridDataModel.js';

export default HybridDataModel;

export type BaseItem<T = {}> = Record<string, any> & T
