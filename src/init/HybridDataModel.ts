import { HydratedModel} from 'sistemium-data-vue';
import { ModelConfig } from 'sistemium-data/lib/Model';
import qs from 'qs';
import { axios } from 'sistemium-data/lib/util/axios';
import { isNative } from 'sistemium-data/lib/util/native';
import axiosScriptMessaging, {
  SOCKET_SOURCE_HEADER,
} from 'sistemium-data/lib/util/axiosScriptMessaging';
import type { BaseItem } from '@/init/Model'
import { subscribeChanges } from '@/services/socket'

const { VITE_API_URL: API_URL } = import.meta.env;

export default class HybridDataModel<T extends BaseItem = BaseItem, HT extends T = T> extends HydratedModel<T, HT> {

  constructor(config: ModelConfig) {
    super(config);
    Object.assign(this, config.methods || {});
  }

  async fetchSubscribed() {
    return subscribeChanges(this.collection, () => this.cachedFetch())
  }

}

export function authorizeAxios(token: string) {
  // @ts-ignore
  HybridDataModel.useAxios(axios.create({
    ...(isNative() ? nativeConfig() : webConfig(token)),
  }));
}

function webConfig(token: string) {
  return {
    baseURL: API_URL || '/api',
    headers: {
      'x-page-size': 10000,
      authorization: token,
    },
    paramsSerializer(params: any) {
      return qs.stringify(params, { arrayFormat: 'brackets' });
    },
  };
}

function nativeConfig() {
  return {
    adapter: axiosScriptMessaging,
    headers: {
      [SOCKET_SOURCE_HEADER]: 'true',
    },
    transformRequest(data: any) {
      return data;
    },
    transformResponse(data: any) {
      return data;
    },
  };
}
