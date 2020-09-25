import Post from './post';

export default interface User {
  id?: string;
  username: string;
  avatar_url: string;
  favourite_posts?: Post[];
  posts?: Post[];
  totalPosts?: number;
}