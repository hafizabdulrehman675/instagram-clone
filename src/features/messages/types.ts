export type ThreadPeer = {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  isOnline: boolean;
  lastSeen?: string;
};

export type MessageEntity = {
  id: string;
  threadId: string;
  senderId: string;
  text: string;
  createdAt: string;
  /**
   * Local optimistic id used before backend ack returns canonical message id.
   */
  clientTempId?: string;
  /**
   * Message delivery lifecycle for realtime/backend integration.
   */
  deliveryStatus?: "sending" | "sent" | "delivered" | "seen" | "failed";
  reacted?: string;
  seen?: boolean;
};

export type ThreadEntity = {
  id: string;
  peer: ThreadPeer;
  messageIds: string[];
  unreadCountByUserId: Record<string, number>;
  /**
   * Backend-friendly read cursor (message id per user for this thread).
   */
  lastReadMessageIdByUserId?: Record<string, string | null>;
};

export type MessagesState = {
  threadsById: Record<string, ThreadEntity>;
  threadIds: string[];
  messagesById: Record<string, MessageEntity>;
};
