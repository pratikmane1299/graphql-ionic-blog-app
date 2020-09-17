import gql from 'graphql-tag';

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

export const removePostFromFavourites = gql`
  mutation removePostFromFavourites($postId: ID!) {
    removePostFromFavourites(postId: $postId)
  }
`;

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

export const addComment = gql`
  mutation comment($postId: ID!, $comment: String!) {
    comment(postId: $postId, text: $comment) {
      id
      text,
      createdAt,
      commentedBy {
        username,
        avatar_url
      }
    }
  }
`;

export const deleteComment = gql`
  mutation deleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId) {
      id
    }
  }
`;
