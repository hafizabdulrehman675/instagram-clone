import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";

export type ActiveModal =
  | "none"
  | "createPost"
  | "notifications"
  | "followRequests"
  | "followRequestSent";

type UIState = {
  isMobileNavOpen: boolean;
  theme: ThemeMode;
  activeModal: ActiveModal;
};

const initialState: UIState = {
  isMobileNavOpen: false,
  theme: "light",
  activeModal: "none",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileNav(state) {
      state.isMobileNavOpen = !state.isMobileNavOpen;
    },
    setMobileNavOpen(state, action: PayloadAction<boolean>) {
      state.isMobileNavOpen = action.payload;
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },
    setActiveModal(state, action: PayloadAction<ActiveModal>) {
      state.activeModal = action.payload;
    },
  },
});

export const { toggleMobileNav, setMobileNavOpen, setTheme, setActiveModal } =
  uiSlice.actions;

export default uiSlice.reducer;
