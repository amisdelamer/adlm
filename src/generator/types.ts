import {
  SchemaTemplateContext,
  Document,
  FileOutput,
  Scalar,
} from 'graphql-codegen-core';
import { toComment } from './helpers/utils';
import { renderEnum, renderUnion } from './helpers/enum';
import { renderType, renderInterface } from './helpers/type';
import { renderResolvers } from './helpers/resolvers';

export default function generateTypes(
  context: SchemaTemplateContext,
  document: Document,
  settings: any
): FileOutput[] {
  // console.log(context);
  return [
    {
      filename: 'common/types.ts',
      content: renderSchema(context),
    },
    {
      filename: 'graphql/Resolvers.ts',
      content: renderResolvers(context),
    },
  ];
}

const scalars = {
  DateTime: `string`,
  Uuid: `string`,
};

function renderScalar(scalar: Scalar): string {
  return `${toComment(scalar.description)}
export type ${scalar.name} = ${scalars[scalar.name] || 'any'};
`.trim();
}

export function renderSchema(schema: SchemaTemplateContext): string {
  return `// @generated

${schema.scalars.map(renderScalar).join('\n\n')}

${schema.enums.map(renderEnum).join('\n\n')}

${schema.unions.map(renderUnion).join('\n\n')}

${schema.interfaces.map(renderInterface).join('\n\n')}

${schema.types.map(renderType).join('\n\n')}

${schema.inputTypes.map(renderType).join('\n\n')}
`;
}
