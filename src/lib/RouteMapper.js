import lowerFirst from 'lodash/lowerFirst';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';

export default class RouteMapper {

  constructor(config) {
    this.config = config;
  }

  routes() {
    return Object.keys(this.config).map(name => configToRoute(name, {
      ...this.config[name],
      root: true,
    }));
  }

}

function configToRoute(name, options) {
  const {
    root,
    model,
    component,
  } = options;

  const { collection } = model || {};

  const props = collection ? {
    editRoute: nameEdit(collection, options.edit),
    createRoute: nameCreate(collection),
  } : undefined;

  const children = routeChildren(name, options, collection);

  Object.keys(options.children || [])
    .forEach(childKey => {
      const child = options.children[childKey];
      props[`${childKey}Route`] = child.name;
      children.push(child);
    });

  const meta = {};

  if (options.public) {
    meta.public = true;
  }

  return {
    name,
    path: `${root ? '/' : ''}${name}`,
    component,
    props,
    children,
    beforeEnter: options.beforeEnter,
    meta,
  };
}

function childConfig(type, options) {
  const { [type]: typed, editing } = options;
  if (isFunction(typed)) {
    return {
      component: typed,
    };
  }
  const { component, children, name } = typed || {};
  const res = {
    component: component || typed || editing,
    children,
  };
  if (name) {
    res.name = name;
  }
  return res;
}

function childProps(type, options, params) {
  const { [type]: typed } = options;
  const { model } = typed || {};
  const { collection } = model || {};
  if (isFunction(typed) || !collection) {
    return {};
  }
  const props = {
    editRoute: nameEdit(collection),
    createRoute: nameCreate(collection),
  };
  if (params) {
    const keyId = nameId(collection);
    props[keyId] = params[keyId];
  }
  return props;
}

function routeChildren(name, options, collection) {

  if (!collection) {
    return undefined;
  }

  const keyId = nameId(collection);

  return [
    {
      path: 'create',
      name: nameCreate(collection),
      props: {
        from: { name },
        ...childProps('create', options),
      },
      ...childConfig('create', options),
    },
    {
      path: `edit/:${nameId(collection)}`,
      name: nameEdit(collection),
      props: ({ params }) => ({
        [keyId]: params[keyId],
        from: { name },
        ...childProps('edit', options, params),
      }),
      ...childConfig('edit', options),
    },
  ];
}

function nameEdit(name, options) {
  return get(options, 'name') || `${lowerFirst(name)}Edit`;
}

function nameCreate(name) {
  return `${lowerFirst(name)}Create`;
}

function nameId(name) {
  return `${lowerFirst(name)}Id`;
}
