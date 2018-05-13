import { Enum, Union } from 'graphql-codegen-core';
import { toComment } from './utils';

export function renderEnum(enumeration: Enum): string {
  return `
${toComment(enumeration.description)}
export enum ${enumeration.name} {
  ${enumeration.values
    .map((value) => `${value.name} = "${value.value}"`)
    .join(',\n  ')}
}`.trim();
}

export function renderUnion(union: Union): string {
  return `
${toComment(union.description)}
export type ${union.name} =
  ${union.possibleTypes.join(' |\n')}
`.trim();
}
