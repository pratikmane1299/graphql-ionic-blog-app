import gql from 'graphql-tag';
import { Post, Comment, User } from '../types';

export const USER_FEED_QUERY = gql`
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

export interface FeedQueryResponse {
  feed: Post[];
}

export const GET_FAVOURITE_POSTS = gql`
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

export interface FavouritesQueryResponse {
  me: User;
}

export const GET_POST_By_ID = gql`
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
      isFavourite,
      author {
        id,
        username
        avatar_url
      }
    }
  }
`;

export interface PostDetailsResponse {
  post: Post;
}

export const ME = gql`
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

export interface LoggedInUserQueryResponse {
  me: User;
}

export const GET_COMMENTS_FOR_POST = gql`
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

export interface CommentsQueryReponse {
  comments: Comment[];
}
