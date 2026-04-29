import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserRecord, UsersState } from "@/features/users/types";

/*
  Mock persistence reference (disabled intentionally):
  ---------------------------------------------------
  const STORAGE_KEY = "ig_clone_users_v1";

  function loadUsers(): UsersState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as UsersState;
    } catch {
      return null;
    }
  }

  function persistUsers(state: UsersState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
*/

function seedUsers(): UsersState {
  const u1: UserRecord = {
    id: "u1",
    username: "demo_user",
    fullName: "Demo User",
    email: "demo@example.com",
    avatarUrl: "https://i.pravatar.cc/100?u=demo",
    password: "demo123",
  };

  const u2: UserRecord = {
    id: "u2",
    username: "second_user",
    fullName: "Second User",
    email: "second@example.com",
    avatarUrl: "https://i.pravatar.cc/100?u=second",
    password: "second123",
  };

  const usersById: Record<string, UserRecord> = {
    [u1.id]: u1,
    [u2.id]: u2,
  };

  return {
    usersById,
    allUserIds: [u1.id, u2.id],
  };
}

const initialState: UsersState = seedUsers();

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    registerUser(state, action: PayloadAction<UserRecord>) {
      const user = action.payload;

      state.usersById[user.id] = user;
      if (!state.allUserIds.includes(user.id)) {
        state.allUserIds.push(user.id);
      }
    },

    // Keeps previous reducer API, but reset now uses in-memory seed only.
    resetDemoUsers(state) {
      const seeded = seedUsers();
      state.usersById = seeded.usersById;
      state.allUserIds = seeded.allUserIds;
    },

    updateUserProfile(
      state,
      action: PayloadAction<{
        userId: string;
        fullName: string;
        username: string;
        email: string;
        newPassword?: string;
      }>,
    ) {
      const u = state.usersById[action.payload.userId];
      if (!u) return;
      u.fullName = action.payload.fullName.trim();
      u.username = action.payload.username.trim();
      u.email = action.payload.email.trim();
      if (action.payload.newPassword) {
        u.password = action.payload.newPassword;
      }
    },
  },
});

export const { registerUser, resetDemoUsers, updateUserProfile } =
  usersSlice.actions;
export default usersSlice.reducer;
