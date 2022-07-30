// eslint-disable-next-line import/prefer-default-export
export function itemRouteHelper(name, component) {
  const parentId = `${name}Id`;
  const itemId = `${name}ItemId`;
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
    }),
  }];
}
