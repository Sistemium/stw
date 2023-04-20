export function itemRouteHelper(
  name,
  component,
  parentName = '',
  props = {},
  itemName = 'Item',
) {
  const parentId = `${parentName || name}Id`;
  const itemId = `${parentName || name}ItemId`;
  return [{
    path: `edit${itemName}/:${itemId}`,
    name: `${name}${itemName}Edit`,
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
    path: `create${itemName}`,
    name: `${name}${itemName}Create`,
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
