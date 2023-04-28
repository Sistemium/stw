import matches from 'lodash/matches';
import { useRoute, useRouter } from 'vue-router';


export function useRouteParams() {

  const route = useRoute();
  const router = useRouter();

  return { updateRouteParams };

  async function updateRouteParams(updateParams = {}, updateQuery = {}, updateName) {

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

    if (sameState) {
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

