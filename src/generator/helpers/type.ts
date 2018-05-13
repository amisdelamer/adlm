import { Type, Interface } from 'graphql-codegen-core';
import { toComment } from './utils';
import { renderField } from './field';

export function renderInterface(type: Interface): string {
  return `
${toComment(type.description)}
export interface ${type.name} {
    ${type.fields.map(renderField).join('\n  ')}
}
`.trim();
}

function getInterfaces(type: Type): string {
  let interfaces = type.interfaces.join(', ');
  if (interfaces !== '') {
    interfaces = ' extends ' + interfaces;
  }
  return interfaces;
}

export function renderType(type: Type): string {
  return `
${toComment(type.description)}
export interface ${type.name}${getInterfaces(type)} {
  ${type.fields.map(renderField).join('\n  ')}
}
`.trim();
}
