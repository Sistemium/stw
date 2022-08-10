// eslint-disable-next-line import/prefer-default-export
export function itemRouteHelper(name, component, parentName = '', props = {}) {
  const parentId = `${parentName || name}Id`;
  const itemId = `${parentName || name}ItemId`;
  return [{
    path: `edit/:${itemId}`,
    name: `${name}ItemEdit`,
    component,
    props: ({ params: { [parentId]: parentParam, [itemId]: itemParam } }) => ({
      [parentId]: parentParam,
      [itemId]: itemParam,
      from: {
        name,
        params: {
          [parentId]: parentParam,
        },
      },
      ...props,
    }),
  }, {
    path: 'create',
    name: `${name}ItemCreate`,
    component,
    props: ({ params: { [parentId]: parentParam } }) => ({
      [parentId]: parentParam,
      from: {
        name,
        params: {
          [parentId]: parentParam,
        },
      },
      ...props,
    }),
  }];
}
