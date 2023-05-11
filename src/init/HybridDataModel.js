import ReactiveModel from 'sistemium-data-vue';
import qs from 'qs';
import { axios } from 'sistemium-data/src/util/axios';
import { isNative } from 'sistemium-data/src/util/native';
import axiosScriptMessaging, {
  SOCKET_SOURCE_HEADER,
} from 'sistemium-data/src/util/axiosScriptMessaging';

const { VITE_API_URL: API_URL } = import.meta.env;

export default class HybridDataModel extends ReactiveModel {

  constructor(config) {
    super(config);
    Object.assign(this, config.methods || {});
  }

}

export function authorizeAxios(token) {
  HybridDataModel.useAxios(axios.create({
    ...(isNative() ? nativeConfig() : webConfig(token)),
  }));
}

function webConfig(token) {
  return {
    baseURL: API_URL || '/api',
    headers: {
      'x-page-size': 10000,
      authorization: token,
    },
    paramsSerializer(params) {
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
    transformRequest(data) {
      return data;
    },
    transformResponse(data) {
      return data;
    },
  };
}
