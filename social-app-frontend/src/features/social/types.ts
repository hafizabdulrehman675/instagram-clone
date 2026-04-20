export type FollowRequestRecord = {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "rejected";
};

export type SocialState = {
  followingByUserId: Record<string, string[]>;
  requestsById: Record<string, FollowRequestRecord>;
};
