import User from './user';

export default interface Post {
  id?: string;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  likesCount: number;
  liked: boolean;
  commentsCount: number;
  author: User
}