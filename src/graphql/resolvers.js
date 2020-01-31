// objects that we can pass to client that letys know what data to be resolved depending on the queries you get from the client

import { gql } from "apollo-boost";
export const typeDefs = gql`
  extend type Mutation {
    ToggleCartHidden: Boolean!
  }
`;
//type definitions are capitalised
const GET_CART_HIDDEN = gql`
  {
    cartHidden @client
  }
`;
export const resolvers = {
  Mutation: {
    toggleCartHidden: (_root, _args, { cache }) => {
      const { cartHidden } = cache.readQuery({
        query: GET_CART_HIDDEN
      });
      cache.writeQuery({
        query: GET_CART_HIDDEN,
        data: { cartHidden: !cartHidden }
      });
      return !cartHidden;
    }
  }
};
