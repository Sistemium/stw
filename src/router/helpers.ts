import type { BaseItem } from '@/init/Model'

export function itemRouteHelper(
  name: string,
  component: () => Promise<any>,
  parentName: string = '',
  props: BaseItem = {},
  itemName: string = 'Item',
) {
  const parentId = `${parentName || name}Id`;
  const itemId = `${parentName || name}ItemId`;
  return [{
    path: `edit${itemName}/:${itemId}`,
    name: `${name}${itemName}Edit`,
    component,
    props: ({ params: { [parentId]: parentParam, [itemId]: itemParam } }: BaseItem) => ({
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
    props: ({ params: { [parentId]: parentParam } }: BaseItem) => ({
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
