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

