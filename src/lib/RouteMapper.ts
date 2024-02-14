import lowerFirst from 'lodash/lowerFirst';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import type { NavigationGuardNext, RouteLocationNormalized as RouteRecord } from 'vue-router'


interface RouteConfig {
  root?: boolean
  model?: any
  component?: any
  config?: Record<string, any>
  editing?: any
  children?: Record<string, any>
  meta?: Record<string, any>
  beforeEnter?(_to: RouteRecord, _from: RouteRecord, next: NavigationGuardNext): void
  edit?: Record<string, any>
  props?: Record<string, any>
  public?: boolean
}

export default class RouteMapper {

  config: Record<string, RouteConfig>

  constructor(config: Record<string, RouteConfig>) {
    this.config = config;
  }

  routes() {
    return Object.keys(this.config).map(name => configToRoute(name, {
      ...this.config[name],
      root: true,
    }));
  }

}

function configToRoute(name: string, options: RouteConfig) {
  const {
    root,
    model,
    component,
    config,
  } = options;

  const path = `${root ? '/' : ''}${name}`;

  if (config) {
    return {
      name,
      path,
      ...config,
    };
  }

  const { collection } = model || {};

  const props: Record<string, any> = collection ? {
    editRoute: nameEdit(collection, options.edit),
    createRoute: nameCreate(collection),
    rootState: name,
    model,
    ...(options.props || {}),
  } : {};

  const children = routeChildren(name, options, collection);
  const { children: oChildren} = options

  if (oChildren) {
    Object.keys(oChildren)
      .forEach(childKey => {
        const child = oChildren[childKey];
        props[`${childKey}Route`] = child.name;
        children.push(child);
      })
  }

  const { meta = {} } = options;

  if (options.public) {
    meta.public = true;
  }

  return {
    name,
    path,
    component,
    props,
    children,
    beforeEnter: options.beforeEnter,
    meta,
  };
}

function childConfig(type: string, options: Record<string, any>) {
  const { [type]: typed, editing } = options;
  if (isFunction(typed)) {
    return {
      component: typed,
    };
  }
  const {
    component,
    children,
    name,
    beforeEnter,
  } = typed || {};
  const res: Record<string, any> = {
    component: component || typed || editing,
    children,
  };
  if (name) {
    res.name = name;
  }
  if (beforeEnter) {
    res.beforeEnter = beforeEnter;
  }
  return res;
}

function childProps(type: string, options: Record<string, any>, params?: Record<string, any>) {
  const { [type]: typed } = options;
  const { model } = typed || {};
  const { collection } = model || {};
  if (isFunction(typed) || !collection) {
    return {};
  }
  const props = {
    editRoute: nameEdit(collection),
    createRoute: nameCreate(collection),
    ...(options.inheritProps ? options.props : {}),
  };
  if (params) {
    const keyId = options.parentIdProp || nameId(collection);
    props[keyId] = params[keyId];
  }
  return props;
}

function routeChildren(name: string, options: Record<string, any>, collection: string) {

  if (!collection) {
    return [];
  }

  const parentKeyId = options.parentIdProp || nameId(collection);

  return [
    {
      path: 'create',
      name: nameCreate(collection),
      props: {
        from: { name },
        editRoute: nameEdit(collection, options.edit),
        model: options.model,
        ...childProps('create', options),
        ...(options.inheritProps ? options.props : {}),
      },
      ...childConfig('create', options),
    },
    {
      path: `edit/:${parentKeyId}`,
      name: nameEdit(collection),
      props: ({ params }: { params: Record<string, any> }) => ({
        [parentKeyId]: params[parentKeyId],
        from: { name },
        model: options.model,
        ...childProps('edit', options, params),
        ...(options.inheritProps ? options.props : {}),
      }),
      ...childConfig('edit', options),
    },
  ];
}

function nameEdit(name: string, options?: Record<string, any>) {
  return get(options, 'name') || `${lowerFirst(name)}Edit`;
}

function nameCreate(name: string) {
  return `${lowerFirst(name)}Create`;
}

function nameId(name: string) {
  return `${lowerFirst(name)}Id`;
}
