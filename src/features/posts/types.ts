export type Story = {
  id: string;
  username: string;
  avatarUrl: string;
};

export type FeedPost = {
  id: string;
  username: string;
  location: string;
  avatarUrl: string;
  imageUrl: string;
  likesCount: number;
  caption: string;
  commentsCount: number;
  postedAtLabel: string;
  isLiked: boolean;
  isSaved: boolean;
};
