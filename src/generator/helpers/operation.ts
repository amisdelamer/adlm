import { SchemaTemplateContext } from 'graphql-codegen-core';

// function renderQueryFunction(op: Operation): string {
//   return `type Query${op.name} = () => `.trim();
// }

export function renderQuery(ctx: SchemaTemplateContext): string {
  return ``.trim();
}

export function renderMutation(ctx: SchemaTemplateContext): string {
  return ``.trim();
}
