import fs from 'fs';
import Knex from 'knex';
import { func } from 'prop-types';

type CardinalNumber = number; // positive
type SqlIdentifier = string;
type CharacterData = string;
type YesNo = 'YES' | 'NO';

type SchemaColumn = {
  // Name of the table
  table_name: SqlIdentifier;
  // Name of the column
  column_name: SqlIdentifier;
  // Ordinal position of the column within the table (count starts at 1)
  ordinal_position: CardinalNumber;
  // YES if the column is possibly nullable, NO if it is known not nullable. A not-null constraint is one way a column can be known not nullable, but there can be others.
  is_nullable: YesNo;
  // Data type of the column, if it is a built-in type
  // , or ARRAY if it is some array (in that case, see the view element_types)
  // , else USER-DEFINED (in that case, the type is identified in udt_name and associated columns).
  // If the column is based on a domain, this column refers to the type underlying the domain
  // (and the domain is identified in domain_name and associated columns).
  data_type: CharacterData;
  // Name of the column data type (the underlying type of the domain, if applicable)
  udt_name: SqlIdentifier;
};

type Column = {
  name: string;
  udtName: string;
  isNullable: boolean;
  isArray: boolean;
  position: CardinalNumber;
  type: string;
};

export type Table = {
  name: string;
  columns: Array<Column>;
  primaryKey: Array<Column>;
};

export type Enum = { name: string; values: Array<string> };

type Mappings = { [tableColumn: string]: string };

export default async function generateDbTypes() {
  const knex = initKnex();
  const tables = await getTables(knex);
  const enums = await getEnums(knex, tables);
  const mappings = await getEnumsMapping(knex, enums);

  const files = tables.filter((t) => !isEnumTable(t.columns)).map((t) => ({
    file: `dao/${t.name}Dao.ts`,
    content: generateDao(t, mappings),
  }));

  files.push({
    file: 'types.db.ts',
    content: generateTypes({ tables, enums, mappings }),
  });

  files.push({
    file: 'knex.ts',
    content: generateKnex(),
  });

  try {
    fs.mkdirSync(`./src/db/dao`);
  } catch (e) {}
  files.forEach(({ file, content }) => {
    fs.writeFileSync(`./src/db/${file}`, content);
  });

  knex.destroy();
  return tables;
}

function initKnex() {
  return Knex({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  });
}

function getTables(knex: Knex) {
  return knex
    .select()
    .table('information_schema.columns')
    .where({ table_schema: 'public' })
    .reduce((tables, row: SchemaColumn) => {
      const table = row.table_name;
      if (!tables[table]) {
        tables[table] = [];
      }
      tables[table].push({
        name: row.column_name,
        udtName: row.udt_name,
        isNullable: row.is_nullable === 'YES',
        isArray: row.data_type === 'ARRAY',
        position: row.ordinal_position,
        type: '',
      });
      return tables;
    }, {})
    .then((obj) => {
      const tables: Array<Table> = Object.keys(obj).map((name) => ({
        name: name,
        columns: obj[name],
        primaryKey: [],
      }));
      return tables;
    })
    .then((tables) => {
      return Promise.all(
        tables.map((table) => {
          return getPrimaryKeys(knex, table.name).then((pk) => {
            const rows: Array<{ attname: string }> = pk.rows;
            const columns: Array<Column> = table.columns;
            table.primaryKey = columns.filter(
              (c) => rows.findIndex((r) => r.attname === c.name) >= 0
            );
            return table;
          });
        })
      );
    });
}

function getPrimaryKeys(knex: Knex, tableName: string) {
  return knex.raw(
    `
SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS data_type
FROM   pg_index i
JOIN   pg_attribute a ON a.attrelid = i.indrelid
                      AND a.attnum = ANY(i.indkey)
WHERE  i.indrelid = '"${tableName}"'::regclass
AND    i.indisprimary;`
  );
}

function getEnums(knex: Knex, tables: Array<Table>) {
  const enums: Array<string> = [];

  tables.forEach((table) => {
    if (isEnumTable(table.columns)) {
      enums.push(table.name);
    }
  });

  return Promise.all(
    enums.map((enumTable) => {
      return knex
        .select()
        .from(enumTable)
        .map((row: { value: string }) => row.value)
        .then((values: Array<string>) => ({
          name: enumTable,
          values: values,
        }));
    })
  );
}

type FkConstraint = {
  tableName: string;
  columnName: string;
  enumTableName: string;
  enumColumnName: string;
};

// This function group tables with FK on an enum table
// and returns a mapping of the FK columns to enums
function getEnumsMapping(knex: Knex, enums: Array<Enum>) {
  return knex
    .select({
      tableName: 'tc.table_name',
      columnName: 'kcu.column_name',
      enumTableName: 'ccu.table_name',
      enumColumnName: 'ccu.column_name', // should always be 'value'
    })
    .from('information_schema.table_constraints as tc')
    .join(
      'information_schema.key_column_usage as kcu',
      'tc.constraint_name',
      '=',
      'kcu.constraint_name'
    )
    .join(
      'information_schema.constraint_column_usage as ccu',
      'ccu.constraint_name',
      '=',
      'tc.constraint_name'
    )
    .where({ constraint_type: 'FOREIGN KEY' })
    .whereIn('ccu.table_name', enums.map((e) => e.name))
    .reduce((mappings, row: FkConstraint) => {
      mappings[`${row.tableName}.${row.columnName}`] = row.enumTableName;
      return mappings;
    }, {});
}

function generateEnums(enums: Array<Enum>): string {
  return `${enums.map(generateEnum).join('\n\n')}`;
}

function generateEnum(e: Enum): string {
  return `export enum ${e.name} {
  ${e.values.map((v) => `${v} = '${v}'`).join(',\n  ')}
}`;
}

function generateTables(tables: Array<Table>, mappings: Mappings) {
  let res = '';
  tables.sort((t1, t2) => t1.name.localeCompare(t2.name)).forEach((table) => {
    res += generateTable(table, mappings);
    res += '\n\n';
  });
  return res;
}

function generateTable(table: Table, mappings: Mappings): string {
  return `
export interface ${getTableType(table.name)} {
  ${table.columns
    .sort(comparePosition)
    .map((c) => {
      const tsType = toTypeScriptType(table.name, c, mappings);
      c.type = tsType;
      return `${c.name}: ${tsType};`;
    })
    .join('\n  ')}
}
  `.trim();
}

function getTableType(name: string): string {
  return `${name}Table`;
}

function comparePosition(c1: Column, c2: Column) {
  return c1.position - c2.position;
}

function isEnumTable(columns: Array<Column>): boolean {
  return columns.length === 1 && columns[0].name === 'value';
}

function toTypeScriptType(
  table: string,
  column: Column,
  mappings: Mappings
): string {
  const fullName = table + '.' + column.name;
  if (mappings[fullName] != null) {
    return mappings[fullName];
  }

  let tsType = '';
  let pgType = column.udtName;
  if (pgType.startsWith('_')) {
    pgType = pgType.substr(1);
  }

  switch (pgType) {
    case 'bpchar':
    case 'char':
    case 'varchar':
    case 'text':
    case 'citext':
    case 'bytea':
    case 'inet':
    case 'time':
    case 'timetz':
    case 'interval':
    case 'name':
      tsType = 'string';
      break;
    case 'integer':
    case 'float':
    case 'decimal':
    case 'int2':
    case 'int4':
    case 'int8':
    case 'float4':
    case 'float8':
    case 'numeric':
    case 'money':
    case 'oid':
      tsType = 'number';
      break;
    case 'bool':
      tsType = 'boolean';
      break;
    case 'json':
    case 'jsonb':
      tsType = 'Object';
      break;
    case 'date':
    case 'timestamp':
    case 'timestamptz':
      tsType = 'DateIso';
      break;
    case 'point':
      tsType = 'Point';
      break;
    case 'uuid':
      tsType = 'Uuid';
      break;
    default:
      throw new Error(`Unknow column type ${JSON.stringify(column)}`);
  }

  if (column.isArray) {
    tsType = `Array<${tsType}>`;
  }

  if (column.isNullable) {
    tsType += ' | null';
  }

  return tsType;
}

function generateTypes(props: {
  tables: Array<Table>;
  enums: Array<Enum>;
  mappings: Mappings;
}): string {
  return `// @generated
import {Uuid} from '~/common/uuid';

export type Point = {x: number, y: number};
export type DateIso = string;

${generateEnums(props.enums)}

${generateTables(props.tables, props.mappings)}`;
}

function generateKnex(): string {
  return `// @generated
// import Bluebird from 'bluebird';
import Knex, { QueryBuilder } from 'knex';

// export type Result<T> = QueryBuilder & Bluebird<T>;
export type Result<T> = Promise<T>;

export type Operator =
  | '>'
  | '<'
  | '>='
  | '<='
  | '='
  | '<>'
  | 'like'
  | 'not like'
  | 'similar to'
  | 'not similar to';

const knex = Knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});

export default knex;
`;
}

function generateDao(table: Table, mappings: Mappings): string {
  const typ = getTableType(table.name);
  const pk =
    table.primaryKey.length === 1
      ? toTypeScriptType(table.name, table.primaryKey[0], mappings)
      : `{${table.primaryKey
          .map((p) => `${p.name}: ${toTypeScriptType(table.name, p, mappings)}`)
          .join(', ')}}`;
  const whereId = table.primaryKey.length === 1 ? `'id', id` : 'id';

  return `// @generated
import knex, {Operator, Result} from '~/db/knex';
import {${typ}} from '~/db/types.db';
import {Uuid} from '~/common/uuid';

export type Id = ${pk};

export function all(): Result<Array<${typ}>> {
  return Promise.resolve(knex.select().from('${table.name}'));
}

export function byId(id: Id): Result<${typ} | null> {
  return Promise.resolve(knex('${table.name}').where(${whereId})).then(rows => {
    if (rows.length === 0) {
      return null;
    } else if (rows.length === 1) {
      return rows[0];
    } else {
      throw new Error('${
        table.name
      }Dao.byId returned ' + rows.length + ' results.');
    }
  });
}

// This function should be called when looking for a value
// from another row and using a foreign key.
// It will fail if nothing is found.
export function byIdRequired(id: Id): Result<${typ}> {
  return byId(id).then(value => {
    if (value == null) {
      throw new Error('${
        table.name
      }Dao.byIdRequired returned null while looking for id ' + id);
    }
    return value;
  });
}

export function where(predicate: Partial<${typ}>): Result<Array<${typ}>> {
  return Promise.resolve(knex('${table.name}').where(predicate));
}

export function whereOp(key: keyof ${typ}, op: Operator, value: any): Result<Array<${typ}>> {
  return Promise.resolve(knex('${table.name}').where(key, op, value));
}

export function insert(value: ${typ}): Result<${typ} | null> {
  return Promise.resolve(knex('${table.name}').returning('*').insert(value));
}

export function insertAll(value: Array<${typ}>): Result<${typ} | null> {
  return Promise.resolve(knex('${table.name}').returning('*').insert(value));
}

export function update(id: Id, patch: Partial<${typ}>): Result<${typ} | null> {
  return Promise.resolve(knex('${
    table.name
  }').where(${whereId}).returning('*').update(patch));
}

export function remove(id: Id): Result<void> {
  return Promise.resolve(knex('${table.name}').where(${whereId}).del());
}

const dao = {
  all,
  byId,
  byIdRequired,
  where,
  whereOp,
  insert,
  insertAll,
  update,
  remove,
};

export default dao;
`;
}
