import { pascalCase } from 'change-case';
import { Document, Operation, Variable } from 'graphql-codegen-core';
import { renderField } from './field';

function renderVariable(variable: Variable): string {
  return renderField({
    ...variable,
    description: '',
    arguments: [],
    hasArguments: false,
    directives: {},
    usesDirectives: false
  });
}

function renderOperation(operation: Operation): string {
  return `
export namespace ${pascalCase(operation.name)} {
  export type Variables = {
    ${operation.variables.map(renderVariable).join('\n    ')}
  }

  export type ${pascalCase(operation.operationType)}
}
`.trim();
}

export function renderDocument(doc: Document): string {
  return `
${doc.operations.map(renderOperation).join('\n\n')}
`.trim();
}
