// @generated
// import Bluebird from 'bluebird';
import Knex, {QueryBuilder} from 'knex';

// export type Result<T> = QueryBuilder & Bluebird<T>;
export type Result<T> = Promise<T>;

export type Operator = '>' | '<' | '>=' | '<=' | '=' | '<>' | 'like' | 'not like' | 'similar to' | 'not similar to';

const connection = process.env.NODE_ENV === 'production' ?
  {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  } :
  {
    host: process.env.DB_HOST_DEV,
    database: process.env.DB_DATABASE_DEV,
    user: process.env.DB_USER_DEV,
    password: process.env.DB_PASSWORD_DEV,
  };

const knex = Knex({
  client: 'pg',
  connection: connection,
});

export default knex;
