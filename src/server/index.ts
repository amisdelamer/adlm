import express from 'express';
import pg from 'pg';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';

import schema from '~/graphql/schema';

function parseTimestampAsIso(timestamp: string): string {
  return timestamp.replace(' ', 'T');
}

// timestamp without timezone
pg.types.setTypeParser(1114, parseTimestampAsIso);
// timestamp with timezone
pg.types.setTypeParser(1184, parseTimestampAsIso);

const app = express();

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema,
    tracing: true,
    cacheControl: true,
  })
);

if (process.env.NODE_ENV !== 'production') {
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
}

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}/`);
});
