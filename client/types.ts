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
