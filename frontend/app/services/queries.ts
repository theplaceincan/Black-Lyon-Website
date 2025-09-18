// these are shopify graphql queries

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

export const CART_QUERY = `
  query Cart($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      totalQuantity
      cost {                       # ADDED (optional but nice)
        subtotalAmount { amount currencyCode }
        totalAmount    { amount currencyCode }
      }
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            cost {                  # ADDED (needed by your UI)
              amountPerQuantity { amount currencyCode }
              totalAmount       { amount currencyCode }
            }
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  title
                  handle
                  featuredImage { url altText }  # ADDED (your UI uses product.featuredImage)
                }
                price { amount currencyCode }    # optional fallback
              }
            }
          }
        }
      }
    }
  }
`;

export const CART_LINES_ADD = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount    { amount currencyCode }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              cost {
                amountPerQuantity { amount currencyCode }
                totalAmount       { amount currencyCode }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                    featuredImage { url altText }
                  }
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_UPDATE = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount    { amount currencyCode }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              cost {
                amountPerQuantity { amount currencyCode }
                totalAmount       { amount currencyCode }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                    featuredImage { url altText }
                  }
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_REMOVE = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount    { amount currencyCode }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              cost {
                amountPerQuantity { amount currencyCode }
                totalAmount       { amount currencyCode }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                    featuredImage { url altText }
                  }
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

export const CART_CREATE = `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount    { amount currencyCode }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              cost {
                amountPerQuantity { amount currencyCode }
                totalAmount       { amount currencyCode }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                    featuredImage { url altText }
                  }
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

export const FEATURED_COLLECTION_PRODUCTS = `
  query FeaturedCollection($handle: String!, $first: Int = 4) {
    collection(handle: $handle) {
      id
      title
      products(first: $first) {
        edges {
          node {
            id
            handle
            title
            featuredImage { url altText }
            priceRange { minVariantPrice { amount currencyCode } }
            variants(first: 1) { edges { node { id title } } }
          }
        }
      }
    }
  }
`;
