// noinspection GraphQLMissingType

import {gql} from "apollo-boost";

// noinspection GraphQLUnresolvedReference
export const typeDefs = gql`
    extend type Mutation {
        ToggleCartHidden: Boolean!
    }
`
const GET_CART_HIDDEN = gql`{
    cartHidden @client
}
`

export const resolvers = {
    Mutation: {
        toggleCartHidden: (_root, _args, {cache}, _info) => {
            // Read from the cache
            const {cartHidden} = cache.readQuery({
                query: GET_CART_HIDDEN,
                variables: {}
            });

            // Write to the local cache
            cache.writeQuery({
                query: GET_CART_HIDDEN,
                data: {
                    cartHidden: !cartHidden
                }
            });

            // Return the value just in case
            return !cartHidden;
        }
    }
}
