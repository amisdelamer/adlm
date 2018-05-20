import express from 'express';
import pg from 'pg';
import iron from 'iron';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { addResolveFunctionsToSchema } from 'graphql-tools';

import schema from '~/graphql/schema';
import { Context } from '~/graphql/Resolvers';
import resolvers from '~/server/resolvers';
import { init as initCache } from '~/server/cache';
import * as auth from '~/server/auth';

addResolveFunctionsToSchema({ schema, resolvers });

function parseTimestampAsIso(timestamp: string): string {
  return timestamp.replace(' ', 'T');
}

// timestamp without timezone
pg.types.setTypeParser(1114, parseTimestampAsIso);
// timestamp with timezone
pg.types.setTypeParser(1184, parseTimestampAsIso);

const app = express();

app.use(cookieParser());

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress((req) => {
    if (req == null) {
      return Promise.reject(new Error('Missing request param'));
    }

    return auth.getContext(req).then((ctx) => ({
      schema,
      context: ctx,
      tracing: true,
      cacheControl: true,
    }));
  })
);

if (process.env.NODE_ENV !== 'production') {
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
}

const PORT = 3001;
initCache().then((_) => {
  app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}/`);
  });
});
