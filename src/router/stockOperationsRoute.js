import { itemRouteHelper } from '@/router/helpers';

export default function stockOperationsRoute(options) {

  const {
    rootState,
    model,
    positionsModel,
    operationName,
    counterpartyRole,
    rootComponent = () => import(/* webpackChunkName: "out" */ '../views/StockOperationsPage.vue'),
    editComponent = () => import(/* webpackChunkName: "out" */ '../components/out/StockOperationEdit.vue'),
  } = options;

  const commonProps = {
    model,
    positionsModel,
    operationName,
    counterpartyRole,
  };

  const editRoute = operationName;
  const createRoute = `${operationName}Create`;

  return {
    component: rootComponent,
    children: [
      {
        name: createRoute,
        path: 'create',
        component: editComponent,
        props: {
          ...commonProps,
          editRoute,
          from: {
            name: rootState,
          },
        },
      },
      {
        name: operationName,
        path: 'details/:stockOperationId',
        component: () => import(/* webpackChunkName: "out" */ '../views/StockOperationPage.vue'),
        props({ params: { stockOperationId } }) {
          return {
            editRoute: `${operationName}ItemEdit`,
            createRoute: `${operationName}ItemCreate`,
            stockOperationId,
            ...commonProps,
            from: {
              name: rootState,
            },
          };
        },
        children: itemRouteHelper(
          operationName,
          () => import(/* webpackChunkName:"out" */ '../components/out/StockOperationItemEdit.vue'),
          'stockOperation',
          commonProps,
        ),
      },
    ],
    props: {
      editRoute,
      createRoute,
      rootState,
      ...commonProps,
    },
  };

}
