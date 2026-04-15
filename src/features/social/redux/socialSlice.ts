import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SocialState } from "@/features/social/types";

const STORAGE_KEY = "ig_clone_social_v1";

function loadSocial(): SocialState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SocialState;
  } catch {
    return null;
  }
}

function seedSocial(): SocialState {
  return {
    followingByUserId: {},
    requestsById: {},
  };
}

function persistSocial(state: SocialState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function requestPairId(fromUserId: string, toUserId: string) {
  return `fr_${fromUserId}_${toUserId}`;
}

const initialState: SocialState = loadSocial() ?? seedSocial();

const socialSlice = createSlice({
  name: "social",
  initialState,
  reducers: {
    sendFollowRequest(
      state,
      action: PayloadAction<{ fromUserId: string; toUserId: string }>,
    ) {
      const { fromUserId, toUserId } = action.payload;
      if (fromUserId === toUserId) return;

      const following = state.followingByUserId[fromUserId] ?? [];
      if (following.includes(toUserId)) return;

      const id = requestPairId(fromUserId, toUserId);
      const existing = state.requestsById[id];
      if (existing?.status === "pending") return;

      state.requestsById[id] = {
        id,
        fromUserId,
        toUserId,
        status: "pending",
      };
      persistSocial(state);
    },

    acceptFollowRequest(state, action: PayloadAction<{ requestId: string }>) {
      const req = state.requestsById[action.payload.requestId];
      if (!req || req.status !== "pending") return;

      if (!state.followingByUserId[req.fromUserId]) {
        state.followingByUserId[req.fromUserId] = [];
      }
      if (!state.followingByUserId[req.fromUserId].includes(req.toUserId)) {
        state.followingByUserId[req.fromUserId].push(req.toUserId);
      }

      delete state.requestsById[action.payload.requestId];
      persistSocial(state);
    },

    rejectFollowRequest(state, action: PayloadAction<{ requestId: string }>) {
      const req = state.requestsById[action.payload.requestId];
      if (!req || req.status !== "pending") return;
      delete state.requestsById[action.payload.requestId];
      persistSocial(state);
    },

    cancelFollowRequest(
      state,
      action: PayloadAction<{ fromUserId: string; toUserId: string }>,
    ) {
      const id = requestPairId(
        action.payload.fromUserId,
        action.payload.toUserId,
      );
      const req = state.requestsById[id];
      if (req?.status === "pending") {
        delete state.requestsById[id];
        persistSocial(state);
      }
    },

    unfollow(
      state,
      action: PayloadAction<{ followerId: string; followingId: string }>,
    ) {
      const arr = state.followingByUserId[action.payload.followerId];
      if (!arr) return;
      state.followingByUserId[action.payload.followerId] = arr.filter(
        (id) => id !== action.payload.followingId,
      );
      persistSocial(state);
    },

    removeFriendship(
      state,
      action: PayloadAction<{ userAId: string; userBId: string }>,
    ) {
      const { userAId, userBId } = action.payload;
      const aFollowing = state.followingByUserId[userAId] ?? [];
      const bFollowing = state.followingByUserId[userBId] ?? [];

      state.followingByUserId[userAId] = aFollowing.filter((id) => id !== userBId);
      state.followingByUserId[userBId] = bFollowing.filter((id) => id !== userAId);
      persistSocial(state);
    },

    resetDemoSocial(state) {
      const seeded = seedSocial();
      state.followingByUserId = seeded.followingByUserId;
      state.requestsById = seeded.requestsById;
      persistSocial(state);
    },
  },
});

export const {
  sendFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
  cancelFollowRequest,
  unfollow,
  removeFriendship,
  resetDemoSocial,
} = socialSlice.actions;

export default socialSlice.reducer;
