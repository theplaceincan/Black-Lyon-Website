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

export const CART_CREATE = `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;
