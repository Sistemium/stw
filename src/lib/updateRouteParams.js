import matches from 'lodash/matches';

export default {
  methods: {
    async updateRouteParams(updateParams = {}, updateQuery = {}, updateName) {

      const { name, params = {}, query = {} } = this.$route;

      const newParams = {
        ...params,
        ...updateParams,
      };

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

      await this.$router.push({
        name: newName,
        params: newParams,
        query: newQuery,
      });

    },
  },
};
