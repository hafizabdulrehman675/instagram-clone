import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserRecord, UsersState } from "@/features/users/types";

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

function persistUsers(state: UsersState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const initialState: UsersState = loadUsers() ?? seedUsers();

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

      persistUsers(state);
    },

    // For demo: helpful to reset between tests
    resetDemoUsers(state) {
      const seeded = seedUsers();
      state.usersById = seeded.usersById;
      state.allUserIds = seeded.allUserIds;
      persistUsers(state);
    },
  },
});

export const { registerUser, resetDemoUsers } = usersSlice.actions;
export default usersSlice.reducer;
