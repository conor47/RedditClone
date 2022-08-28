export interface Post {
  identifier: string;
  body?: string;
  title: string;
  slug: string;
  username: string;
  subName: string;
  createdAt: string;
  updatedAt: string;
  sub: Sub;

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
  id: number;
}

export interface Sub {
  postCount?: number;
  name: string;
  imageUrl?: string;
  title: string;
  description: string;
  createdAt: string;
  bannerUrn?: string;
  imageUrn?: string;
  username: string;
  bannerUrl?: string;
  posts: Post[];
  isSubscribed?: boolean;
  subCount?: number;
}

export interface Comment {
  createdAt: string;
  updatedAt: string;
  identifier: string;
  body: string;
  username: string;
  userVote: number;
  voteScore: number;
  post?: Post;
}

export enum Filters {
  best = 'BEST',
  new = 'NEW',
  top_day = 'TOP_DAY',
  top_week = 'TOP_WEEK',
  top_month = 'TOP_MONTH',
  top_alltime = 'TOP_ALLTIME',
}
