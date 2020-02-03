// objects that we can pass to client that letys know what data to be resolved depending on the queries you get from the client

import { gql } from "apollo-boost";
import { addItemToCart, getCartItemCount } from "./cart.utils";
export const typeDefs = gql`
  extend type Item {
    quantity: Int
  }
  extend type Mutation {
    ToggleCartHidden: Boolean!
    AddItemToCart(item: Item!): [Item]!
  }
`;
//type definitions are capitalised
const GET_CART_HIDDEN = gql`
  {
    cartHidden @client
  }
`;
const GET_CART_ITEMS = gql`
  {
    cartItems @client
  }
`;

const GET_ITEM_COUNT = gql`
  {
    itemCount @client
  }
`;

const updateCartItemsRelatedQueries = (cache, newCartItems) => {
  cache.writeQuery({
    query: GET_ITEM_COUNT,
    data: { itemCount: getCartItemCount(newCartItems) }
  });
};

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
    },
    addItemToCart: (_root, { item }, { cache }) => {
      const { cartItems } = cache.readQuery({
        query: GET_CART_ITEMS
      });

      const newCartItems = addItemToCart(cartItems, item);

      updateCartItemsRelatedQueries(cache, newCartItems);

      return newCartItems;
    }
  }
};
