import { PRINT_ADDED } from './channels';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export default {
    Query: {
        print: () => "print here...",
    },
    Mutation: {
        createPrint: (parent, { data }) => {
            pubsub.publish(PRINT_ADDED, { printAdded: data })
            return data
        }
    },
    Subscription: {
        printAdded: {
            subscribe: (parent, args) => pubsub.asyncIterator(PRINT_ADDED)
        }
    }
}