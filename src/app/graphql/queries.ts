import gql from 'graphql-tag';

export const userFeedQuery = gql`
  query feed($offset: Int, $limit: Int) {
    feed(offset: $offset, limit: $limit) {
      id,
      title,
      content,
      thumbnail,
      createdAt
    }
  }
`;
