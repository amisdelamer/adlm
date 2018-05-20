import { Field, Argument } from 'graphql-codegen-core';
import { toPrimitive, toComment } from './utils';

export function renderTypeName(props: {
  type: string;
  isArray: boolean;
  isRequired: boolean;
  isNullableArray: boolean;
}): string {
  return `${props.isArray ? 'Array<' : ''}${toPrimitive(props.type)}${
    props.isNullableArray ? ' | null' : ''
  }${props.isArray ? '>' : ''}${props.isRequired ? '' : ' | null'}`;
}

function renderArguments(args: Argument[]): string {
  if (args.length === 0) return '';
  const argsStr = args.map((a) => a.name + ': ' + renderTypeName(a));
  return `(${argsStr.join(', ')})`;
}

export function renderField(field: Field): string {
  return `
  ${toComment(field.description)}
  ${field.name}${
    field.hasArguments || field.isRequired ? '' : '?'
  }${renderArguments(field.arguments)}: ${renderTypeName(field)};
  `.trim();
}
