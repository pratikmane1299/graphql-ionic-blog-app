import User from './post';

export default interface Comment {
  id?: string;
  text: string;
  createdAt: string;
  commentedBy: User
}