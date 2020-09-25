import gql from 'graphql-tag';
import { AuthResponse } from '../services/auth.service';
import { Comment, Post } from '../types';

export const addNewPostMutation = gql`
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

export const signUpMutation = gql`
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

export const loginMutation = gql`
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

export const addToFavourites = gql`
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

export const removePostFromFavourites = gql`
  mutation removePostFromFavourites($postId: ID!) {
    removePostFromFavourites(postId: $postId)
  }
`;

export interface RemoveFromFavouritesMutationResponse {
  removePostFromFavourites: string;
}

export const likeUnlikeMutation = gql`
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

export const addComment = gql`
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

export const deleteComment = gql`
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
