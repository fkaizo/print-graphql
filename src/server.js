import { ApolloServer } from 'apollo-server-express';
import { createServer } from "http";
import express from 'express';
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PubSub } from 'graphql-subscriptions';
// import mongoose from 'mongoose';

const logMiddleware = (req, res, next) => {
    next();
}

async function startServer({ typeDefs, resolvers }) {
    // mongoose.connect('mongodb://localhost:27017/books', {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    // });

    const app = express();
    const httpServer = createServer(app);
    const pubsub = new PubSub();
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const server = new ApolloServer({ schema });

    app.use(express.json())
    app.use(logMiddleware);

    await server.start();
    server.applyMiddleware({ app });
    SubscriptionServer.create({
        schema,
        execute,
        subscribe,
        onOperation: (message, params, webSocket) => {
            return {...params, context: { pubsub } }
        }
    }, { server: httpServer, path: server.graphqlPath });

    httpServer.listen(4000, () => {
        console.log(`🚀  Server ready at http://localhost:4000/graphql`);
    });

}

export default startServer;