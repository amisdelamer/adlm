import {
  SchemaTemplateContext,
  Type,
  Field,
  Union,
} from 'graphql-codegen-core';
import { pascalCase } from 'change-case';
import { renderTypeName } from './field';
import { toPrimitive } from './utils';
import { Table } from '../db';

type Method = {
  field: Field;
  noTable: boolean;
};

type QueryType = {
  parent: Type;
  methods: Array<Method>;
};

type Context = {
  query: Type;
  queryMethods: Array<Method>;
  queryTypes: Array<QueryType>;
  mutation: Type;
  mutationMethods: Array<Method>;
  commons: Array<string>;
  tables: Array<string>;
};

function init(ctx: SchemaTemplateContext, tables: Array<Table>): Context {
  let query: Type | null = null;
  let mutation: Type | null = null;

  const types = ctx.types.filter((t) => {
    if (t.name === 'Query') {
      query = t;
      return false;
    } else if (t.name === 'Mutation') {
      mutation = t;
      return false;
    }
    return true;
  });

  if (query == null || mutation == null) {
    throw new Error();
  }

  const context: Context = {
    query: query,
    queryMethods: getMethods(ctx, query),
    queryTypes: [],
    mutation: mutation,
    mutationMethods: getMethods(ctx, mutation),
    commons: [],
    tables: [],
  };

  types.forEach((t) => {
    context.queryTypes.push({
      parent: t,
      methods: getMethods(ctx, t),
    });

    if (withoutTable(ctx, t.name)) {
      context.commons.push(t.name);
    } else {
      checkTypeTables(t, tables);
      context.tables.push(t.name);
    }
  });

  // ctx.unions.forEach((u) => {
  //   u.possibleTypes.forEach((t) => {
  //     if (context.tables.indexOf(t) < 0) {
  //       context.commons.push(t);
  //     }
  //   });
  // });

  ctx.inputTypes.forEach((it) => {
    context.commons.push(it.name);
  });

  context.commons = context.commons.sort();
  context.tables = context.tables.sort();

  return context;
}

function isPrimitive(f: Field): boolean {
  return !f.isType && !f.isInputType && !f.isUnion;
}

function withoutTable(ctx: SchemaTemplateContext, name: string): boolean {
  if (ctx.types == null) {
    console.log(ctx);
  }
  const idx = ctx.types.findIndex((t) => t.name === name);
  const t = ctx.types[idx];
  return t == null || t.description.includes('@noTable');
}

function getMethods(ctx: SchemaTemplateContext, t: Type): Array<Method> {
  return t.fields.filter((f) => !isPrimitive(f)).map((f) => ({
    field: f,
    noTable: withoutTable(ctx, f.type),
  }));
}

function getArgsName(m: Method, parent: Type | void): string {
  if (m.field.arguments.length === 0) return '{}';
  return `${parent ? parent.name : ''}${pascalCase(m.field.name)}Args`;
}

function renderMethodsArgs(methods: Array<Method>, parent?: Type): string {
  return methods
    .filter((m) => m.field.arguments.length > 0)
    .map((m) => {
      return `export type ${getArgsName(m, parent)} = {
  ${m.field.arguments
    .map((arg) => `${arg.name}: ${toPrimitive(arg.type)};`)
    .join('\n')}
};`;
    })
    .join('\n');
}

function renderArgs(ctx: Context): string {
  return `${renderMethodsArgs(ctx.queryMethods)}

${ctx.queryTypes
    .map(({ parent, methods }) => renderMethodsArgs(methods, parent))
    .join('\n')}

${renderMethodsArgs(ctx.mutationMethods)}`;
}

function getTableName(t: Type | string): string {
  return (typeof t === 'string' ? t : t.name) + 'Table';
}

function renderMethod(m: Method, parent?: Type): string {
  const parentName = parent ? getTableName(parent) : 'Root';
  const field = {
    ...m.field,
    type:
      m.noTable ||
      isPrimitive(m.field) ||
      m.field.isUnion ||
      m.field.isInputType
        ? m.field.type
        : getTableName(m.field.type),
  };
  const args = getArgsName(m, parent);
  const result = renderTypeName(field);
  return `      ${m.field.name}: Resolve<${parentName}, ${args}, ${result}>,`;
}

function renderQueryType(t: QueryType): string {
  const methodsStr = t.methods.map((m) => renderMethod(m, t.parent)).join('\n');
  if (methodsStr.trim().length === 0) return '';
  return `
  ${t.parent.name}: {
    ${methodsStr}
  };
`.trim();
}

function renderUnionMember(ctx: Context, t: string): string {
  if (ctx.tables.indexOf(t) < 0) {
    return t;
  } else {
    return getTableName(t);
  }
}

function renderUnion(ctx: Context, u: Union): string {
  return `export type ${u.name} = ${u.possibleTypes
    .map((m) => renderUnionMember(ctx, m))
    .join(' | ')};`;
}

export function renderResolvers(
  context: SchemaTemplateContext,
  tables: Array<Table>
): string {
  const ctx = init(context, tables);

  return `// @generated
import {Request} from 'express';
import {GraphQLResolveInfo, GraphQLScalarType} from 'graphql';
import {Uuid} from '~/common/uuid';
import {${ctx.commons.join(', ')}} from '~/common/types';
import {${ctx.tables.map(getTableName).join(', ')}} from '~/db/types.db';

export type Root = {};

export type Context = {
  request: Request,
  user: UserTable | null,
};

type Resolve<P, A, R> = (parent: P, args: A, context: Context, info: GraphQLResolveInfo) => R | Promise<R>;

${context.unions.map((u) => renderUnion(ctx, u)).join('\n')}

${renderArgs(ctx)}

export type Scalars = {
  ${context.scalars.map((s) => `${s.name}: GraphQLScalarType;`).join('\n')}
};

export type SubTypes = {
  ${ctx.queryTypes
    .map(renderQueryType)
    .filter(Boolean)
    .join('\n')}
};

export type Query = {
  ${ctx.queryMethods.map((m) => renderMethod(m)).join('\n')}
};

export type Mutation = {
  ${ctx.mutationMethods.map((m) => renderMethod(m)).join('\n')}
};

export type Resolvers = Scalars & SubTypes & {
  Query: Query;
  Mutation: Mutation;
};
`.trim();
}

function checkTypeTables(typ: Type, tables: Array<Table>) {
  const idx = tables.findIndex((tab) => typ.name === tab.name);
  const table = tables[idx];
  if (table == null) {
    throw new Error(`Could not find table for ${typ.name}`);
  }
  checkTypeTable(typ, table);
}

function checkTypeTable(t: Type, table: Table) {
  const errors = t.fields
    .map((f) => {
      if (!isPrimitive(f)) {
        return;
      }
      const idx = table.columns.findIndex((c) => c.name === f.name);
      const column = table.columns[idx];
      if (column == null) {
        return `Could not find a matching column for field ${t.name}.${f.name}`;
      }
      if (column.isNullable !== !f.isRequired) {
        return `Both ${t.name}.${f.name} should be either nullable or not`;
      }
      if (column.type !== renderTypeName(f)) {
        return `${t.name}.${f.name} type: ${column.type} <> ${renderTypeName(
          f
        )}`;
      }
      return;
    })
    .filter(Boolean);

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}
