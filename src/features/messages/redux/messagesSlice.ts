import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  MessageEntity,
  MessagesState,
  ThreadEntity,
  ThreadPeer,
} from "@/features/messages/types";

const STORAGE_KEY = "ig_clone_messages_v1";

function loadMessages(): MessagesState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MessagesState;
  } catch {
    return null;
  }
}

function persistMessages(state: MessagesState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function upsertThread(state: MessagesState, thread: ThreadEntity) {
  const existing = state.threadsById[thread.id];
  state.threadsById[thread.id] = existing
    ? {
        ...existing,
        ...thread,
        peer: { ...existing.peer, ...thread.peer },
      }
    : thread;

  if (!state.threadIds.includes(thread.id)) {
    state.threadIds.unshift(thread.id);
  }
}

function seedMessages(): MessagesState {
  const threadsById: Record<string, ThreadEntity> = {
    t1: {
      id: "t1",
      peer: {
        id: "u2",
        username: "second_user",
        fullName: "Second User",
        avatarUrl: "https://i.pravatar.cc/100?u=second",
        isOnline: true,
      },
      messageIds: ["m1", "m2", "m3"],
      unreadCountByUserId: { u1: 1, u2: 0 },
    },
  };

  const messagesById: Record<string, MessageEntity> = {
    m1: {
      id: "m1",
      threadId: "t1",
      senderId: "u2",
      text: "Hey! Saw your latest post.",
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    m2: {
      id: "m2",
      threadId: "t1",
      senderId: "u1",
      text: "Thanks! Working hard on this clone.",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      seen: true,
    },
    m3: {
      id: "m3",
      threadId: "t1",
      senderId: "u2",
      text: "Looks great. Let's collab soon.",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  };

  return {
    threadsById,
    threadIds: ["t1"],
    messagesById,
  };
}

const initialState: MessagesState = loadMessages() ?? seedMessages();

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    startThread(
      state,
      action: PayloadAction<{ threadId?: string; peer: ThreadPeer; myUserId: string }>,
    ) {
      const id = action.payload.threadId ?? `t_${Date.now()}`;
      if (state.threadsById[id]) return;
      state.threadsById[id] = {
        id,
        peer: action.payload.peer,
        messageIds: [],
        unreadCountByUserId: { [action.payload.myUserId]: 0 },
        lastReadMessageIdByUserId: { [action.payload.myUserId]: null },
      };
      state.threadIds.unshift(id);
      persistMessages(state);
    },

    hydrateMessagesState(state, action: PayloadAction<MessagesState>) {
      state.threadsById = action.payload.threadsById;
      state.threadIds = action.payload.threadIds;
      state.messagesById = action.payload.messagesById;
      persistMessages(state);
    },

    upsertThreadFromServer(state, action: PayloadAction<ThreadEntity>) {
      upsertThread(state, action.payload);
      persistMessages(state);
    },

    upsertMessagesFromServer(state, action: PayloadAction<MessageEntity[]>) {
      for (const msg of action.payload) {
        state.messagesById[msg.id] = {
          ...state.messagesById[msg.id],
          ...msg,
        };

        const thread = state.threadsById[msg.threadId];
        if (!thread) continue;
        if (!thread.messageIds.includes(msg.id)) {
          thread.messageIds.push(msg.id);
        }
      }
      persistMessages(state);
    },

    messageAcked(
      state,
      action: PayloadAction<{
        threadId: string;
        clientTempId: string;
        serverMessage: MessageEntity;
      }>,
    ) {
      const { threadId, clientTempId, serverMessage } = action.payload;
      const thread = state.threadsById[threadId];
      if (!thread) return;

      const local = Object.values(state.messagesById).find(
        (m) => m.threadId === threadId && m.clientTempId === clientTempId,
      );

      if (local) {
        delete state.messagesById[local.id];
        state.messagesById[serverMessage.id] = {
          ...serverMessage,
          deliveryStatus: serverMessage.deliveryStatus ?? "sent",
        };
        thread.messageIds = thread.messageIds.map((id) =>
          id === local.id ? serverMessage.id : id,
        );
      } else {
        state.messagesById[serverMessage.id] = {
          ...state.messagesById[serverMessage.id],
          ...serverMessage,
          deliveryStatus: serverMessage.deliveryStatus ?? "sent",
        };
        if (!thread.messageIds.includes(serverMessage.id)) {
          thread.messageIds.push(serverMessage.id);
        }
      }

      persistMessages(state);
    },

    readCursorUpdated(
      state,
      action: PayloadAction<{
        threadId: string;
        userId: string;
        lastReadMessageId: string | null;
      }>,
    ) {
      const thread = state.threadsById[action.payload.threadId];
      if (!thread) return;
      if (!thread.lastReadMessageIdByUserId) {
        thread.lastReadMessageIdByUserId = {};
      }
      thread.lastReadMessageIdByUserId[action.payload.userId] =
        action.payload.lastReadMessageId;
      thread.unreadCountByUserId[action.payload.userId] = 0;
      persistMessages(state);
    },

    threadRead(state, action: PayloadAction<{ threadId: string; userId: string }>) {
      const t = state.threadsById[action.payload.threadId];
      if (!t) return;
      t.unreadCountByUserId[action.payload.userId] = 0;
      const lastMessageId = t.messageIds.at(-1) ?? null;
      if (!t.lastReadMessageIdByUserId) {
        t.lastReadMessageIdByUserId = {};
      }
      t.lastReadMessageIdByUserId[action.payload.userId] = lastMessageId;
      persistMessages(state);
    },

    messageSentOptimistic(
      state,
      action: PayloadAction<{
        threadId: string;
        senderId: string;
        text: string;
      }>,
    ) {
      const t = state.threadsById[action.payload.threadId];
      if (!t) return;
      const clientTempId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const id = `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      state.messagesById[id] = {
        id,
        threadId: t.id,
        senderId: action.payload.senderId,
        text: action.payload.text.trim(),
        createdAt: new Date().toISOString(),
        seen: false,
        clientTempId,
        deliveryStatus: "sending",
      };
      t.messageIds.push(id);
      // Sending in a thread implies the sender is actively viewing it.
      // Keep sender unread count reset to avoid stale badge carryover.
      t.unreadCountByUserId[action.payload.senderId] = 0;
      state.threadIds = [t.id, ...state.threadIds.filter((x) => x !== t.id)];
      persistMessages(state);
    },

    messageReceived(
      state,
      action: PayloadAction<{
        threadId: string;
        senderId: string;
        text: string;
        recipientUserId: string;
      }>,
    ) {
      const t = state.threadsById[action.payload.threadId];
      if (!t) return;
      const id = `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      state.messagesById[id] = {
        id,
        threadId: t.id,
        senderId: action.payload.senderId,
        text: action.payload.text.trim(),
        createdAt: new Date().toISOString(),
        deliveryStatus: "delivered",
      };
      t.messageIds.push(id);
      const prev = t.unreadCountByUserId[action.payload.recipientUserId] ?? 0;
      t.unreadCountByUserId[action.payload.recipientUserId] = prev + 1;
      state.threadIds = [t.id, ...state.threadIds.filter((x) => x !== t.id)];
      persistMessages(state);
    },

    toggleMessageReaction(
      state,
      action: PayloadAction<{ messageId: string; emoji: string }>,
    ) {
      const msg = state.messagesById[action.payload.messageId];
      if (!msg) return;
      msg.reacted = msg.reacted === action.payload.emoji ? undefined : action.payload.emoji;
      persistMessages(state);
    },
  },
});

export const {
  startThread,
  hydrateMessagesState,
  upsertThreadFromServer,
  upsertMessagesFromServer,
  messageAcked,
  readCursorUpdated,
  threadRead,
  messageSentOptimistic,
  messageReceived,
  toggleMessageReaction,
} = messagesSlice.actions;

export default messagesSlice.reducer;
