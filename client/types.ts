export interface Post {
  identifier: string;
  body?: string;
  title: string;
  slug: string;
  username: string;
  subName: string;
  createdAt: string;
  updatedAt: string;

  // virtual fields
  voteScore?: number;
  url: string;
  commentCount?: number;
  userVote?: number;
}

export interface User {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sub {
  postCount?: number;
  name: string;
  imageUrl: string;
  title: string;
  description: string;
  createdAt: string;
}

export enum Actions {
  login = 'LOGIN',
  logout = 'LOGOUT',
  stop_loading = 'STOP_LOADING',
}
