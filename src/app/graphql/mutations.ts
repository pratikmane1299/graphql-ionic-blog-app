import gql from 'graphql-tag';
import { AuthResponse } from '../services/auth.service';
import { Comment, Post } from '../types';

export const ADD_NEW_POST_MUTATION = gql`
mutation addNewPost($title: String!, $content: String!, $thumbnail: String) {
  createPost(title: $title, content: $content, thumbnail: $thumbnail) {
    id
    title
    content
    thumbnail
    createdAt
  }
}
`;

export interface AddPostMutationResponse {
  createPost: Post;
}

export const SIGN_UP_MUTATION = gql`
  mutation signUp($username: String!, $password: String!) {
    signUp(username: $username, password: $password) {
      id,
      username,
      avatar_url,
      token
    }
  }
`;

export interface SignUpMutationResponse {
  signUp: AuthResponse;
}

export const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id,
      username,
      avatar_url,
      token
    }
  }
`;

export interface LoginMutationResponse {
  login: AuthResponse;
}

export const ADD_TO_FAVOURITES = gql`
mutation addToFavourites($postId: ID!) {
  addPostToFavourites(postId: $postId) {
    id,
    title,
    content,
    thumbnail,
    createdAt
  }
}
`;

export interface AddToFavouritesMutationResponse {
  addPostToFavourites: Post;
}

export const REMOVE_POST_FROM_FAVOURITES = gql`
  mutation removePostFromFavourites($postId: ID!) {
    removePostFromFavourites(postId: $postId)
  }
`;

export interface RemoveFromFavouritesMutationResponse {
  removePostFromFavourites: string;
}

export const LIKE_UNLIKE_MUTATION = gql`
  mutation likeUnLikePost($postId: ID!) {
    likeUnLikePost(postId: $postId) {
      post {
        id,
        likesCount
      }
    }
  }
`;

export interface LikeUnLikeMutationResponse {
  likeUnLikePost: {
    post: {
      id: string;
      likesCount: number;
    };
  };
}

export const ADD_COMMENT = gql`
  mutation comment($postId: ID!, $comment: String!) {
    comment(postId: $postId, text: $comment) {
      id
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

export interface AddCommentMutationResponse {
  comment: Comment;
}

export const DELETE_COMMENT = gql`
  mutation deleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId) {
      id
    }
  }
`;

export interface DeleteCommentMutationResponse {
  deleteComment: {
    id: string;
  };
}
