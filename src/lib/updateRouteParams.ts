import matches from 'lodash/matches';
import { useRoute, useRouter } from 'vue-router';
import type { BaseItem } from '@/init/Model'


export function useRouteParams() {

  const route = useRoute();
  const router = useRouter();

  return { updateRouteParams, route, router };

  async function updateRouteParams(updateParams: BaseItem = {}, updateQuery: BaseItem = {}, updateName?: string) {

    const { name, params = {}, query = {} } = route;

    const newParams = {
      ...params,
      ...updateParams,
    };

    Object.keys(updateParams).forEach(key => {
      if (!updateParams[key]) {
        delete newParams[key];
      }
    });

    const newQuery = {
      ...query,
      ...updateQuery,
    };

    const newName = updateName || name;

    const sameState = matches(params)(newParams)
      && matches(newQuery)(query)
      && newName === name;

    if (sameState || !newName) {
      return;
    }

    // this.$debug('route:', name, params, query);
    // this.$debug('update:', updateName, updateParams, updateQuery);

    await router.push({
      name: newName,
      params: newParams,
      query: newQuery,
    });

  }

}

