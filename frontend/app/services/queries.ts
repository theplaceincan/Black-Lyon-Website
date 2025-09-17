export const PRODUCTS_QUERY = `
  query Products($first: Int = 20) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
          variants(first: 1) {
            edges { node { id title } }  # need a variant id for cart
          }
        }
      }
    }
  }
`;

export const CART_QUERY = /* GraphQL */ `
  query Cart($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      totalQuantity
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                image { url altText }
                product { title handle }
                price { amount currencyCode }
              }
            }
          }
        }
      }
    }
  }
`;

export const CART_LINES_ADD = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { id totalQuantity checkoutUrl
        lines(first: 50) { edges { node { id quantity } } }
      }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_REMOVE = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id totalQuantity checkoutUrl
        lines(first: 50) { edges { node { id quantity } } }
      }
      userErrors { field message }
    }
  }
`;

export const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { id checkoutUrl totalQuantity
        lines(first: 50) { edges { node { id quantity } } }
      }
      userErrors { field message }
    }
  }
`;
