import {
  SchemaTemplateContext,
  Document,
  FileOutput,
  Scalar,
} from 'graphql-codegen-core';
import db from './db';
import { toComment } from './helpers/utils';
import { renderEnum, renderUnion } from './helpers/enum';
import { renderType, renderInterface } from './helpers/type';
import { renderResolvers } from './helpers/resolvers';

export default async function generateTypes(
  context: SchemaTemplateContext,
  document: Document,
  settings: any
): Promise<FileOutput[]> {
  const tables = await db();

  return [
    {
      filename: 'common/types.ts',
      content: renderSchema(context),
    },
    {
      filename: 'graphql/Resolvers.ts',
      content: renderResolvers(context, tables),
    },
  ];
}

const scalars = {
  DateIso: '~/common/iso',
  Uuid: '~/common/uuid',
};

function renderScalar(scalar: Scalar): string {
  return `${toComment(scalar.description)}
import { ${scalar.name} } from '${scalars[scalar.name]}';
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
