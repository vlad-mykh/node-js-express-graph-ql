/**
 * Main file for the applciaton.
 */
import { createServer as createHttpServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import * as graphqlIHTTP from 'express-graphql';
import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';

import { flowAsync } from './utils/helpers';
import { AuthorResolver } from './schema/Author';
import { BookResolver } from './schema/Book';
import Config from './config/configManager';

/**
 * Server class.
 */
new class Server {
    /**
     * Class constructor.
     */
    constructor() {
        flowAsync(
            this.buildSchema,
            this.configure,
            this.launch
        )();
    }

    /**
     * Builds Graph QL schema.
     */
    private async buildSchema(): Promise<GraphQLSchema> {
        return buildSchema({
            resolvers: [AuthorResolver, BookResolver],
            emitSchemaFile: true,
            validate: false,
        });
    }

    /**
     * Configures express server.
     */
    private configure(schema: GraphQLSchema): express.Application {
        // Creating Express app.
        const app = express();

        const server = new ApolloServer({ schema, });

        server.applyMiddleware({ app, });

        app.use('/graphql', graphqlIHTTP({
            schema,
            graphiql: true,
        }));

        return app;
    }

    /**
     * Launch the server.
     */
    private launch(app: express.Application): void {
        // Stargin http server.
        createHttpServer(app)
            .listen(Config.httpPort, () => {
                console.info(`The server is listening on port ${Config.httpPort}.`);
            });

        // Configuring options for https server.
        const httpsServerOptions = {
            key: fs.readFileSync(path.join(__dirname, '../https/key.pem')),
            cert: fs.readFileSync(path.join(__dirname, '../https/cert.pem')),
        };

        // Starting https server.
        createHttpsServer(httpsServerOptions, app)
            .listen(Config.httpsPort, () => {
                console.info(`The server is listening on port ${Config.httpsPort}.`);
            });
    }
}();