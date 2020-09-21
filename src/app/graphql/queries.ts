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

export const getFavouritePosts = gql`
  query getFavouritePosts($offset: Int, $limit: Int){
    me {
      favourite_posts(offset: $offset, limit: $limit) {
        id,
        title,
        content,
        thumbnail,
        createdAt
      }
    }
  }
`;

export const getPostById = gql`
  query getPost($id: ID!) {
    post(id: $id) {
      id,
      title,
      content,
      thumbnail,
      createdAt,
      likesCount,
      liked,
      commentsCount,
      author {
        username
        avatar_url
      }
    }
  }
`;

export const me = gql`
  query loggedInUser($offset: Int, $limit: Int) {
    me {
      id,
      username,
      avatar_url,
      posts(offset: $offset, limit: $limit) {
        id,
        thumbnail,
      },
      totalPosts
    }
  }
`;

export const getCommentsForPost = gql`
  query getCommentsForPost($postId: ID!) {
	  comments (postId: $postId) {
      id,
      text,
      createdAt,
      commentedBy {
        id,
        username,
        avatar_url
      }
    }
  }
`;
