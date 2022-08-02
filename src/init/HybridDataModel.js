import ReactiveModel from 'sistemium-data-vue';
import chunk from 'lodash/chunk';
import uniq from 'lodash/uniq';
import filter from 'lodash/filter';
import qs from 'qs';
import { axios } from 'sistemium-data/src/util/axios';
import noop from 'lodash/noop';
import flatten from 'lodash/flatten';
import { isNative } from 'sistemium-data/src/util/native';
import axiosScriptMessaging, {
  SOCKET_SOURCE_HEADER,
} from 'sistemium-data/src/util/axiosScriptMessaging';

const OFFSET_HEADER = 'x-offset';
const { VUE_APP_API_URL: API_URL } = process.env;

export default class HybridDataModel extends ReactiveModel {

  constructor(config) {
    super(config);
    this.$cachedFetches = {};
    Object.assign(this, config.methods || {});
  }

  cachedFetches(key) {
    return this.$cachedFetches[key] || {};
  }

  setCachedFetch(key, data = {}) {
    this.$cachedFetches[key] = data;
  }

  async fetchOnce(where) {

    const key = JSON.stringify(where || {});
    const { offset } = this.cachedFetches(key);

    if (offset) {
      return;
    }

    await this.fetchAll(where, { headers: { [OFFSET_HEADER]: offset } })
      .then(res => {
        const lastOffset = res[OFFSET_HEADER];
        if (lastOffset) {
          this.setCachedFetch(key, { offset: lastOffset });
        }
        return res;
      });

  }

  async findByMany(ids, options = {}) {

    const {
      chunkSize = 100,
      field = 'id',
    } = options;

    const idsUniq = filter(uniq(ids));
    const toLoad = options.cached ? idsUniq.filter(id => !this.getByID(id)) : idsUniq;
    const chunks = chunk(toLoad, chunkSize);

    const res = await Promise.all(chunks.map(chunkIds => {
      const where = { [field]: { $in: chunkIds } };
      return this.findAll(where);
    }));

    return flatten(res);

  }

  async apiDelete(id) {
    return this.destroy(id);
  }

  async apiInsert(data) {
    return this.create(data);
  }

  getByMany(ids) {
    noop(this.ts);
    return filter(uniq(ids)
      .map(id => this.getByID(id)));
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
      'x-page-size': 1000,
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
