import {
  Compass,
  Heart,
  House,
  MessageCircle,
  PlusSquare,
  Search,
  User,
  Film,
} from "lucide-react";
import {
  NavLink,
  Outlet,
  useLocation,
  useMatches,
  useNavigate,
} from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { logout } from "@/features/auth/redux/authSlice";
import { clearSession } from "@/lib/session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { setActiveModal } from "@/features/ui/redux/uiSlice";
import CreatePostForm from "@/features/posts/components/CreatePostForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const NAV_ITEMS = [
  { label: "Home", icon: House, to: "/" },
  { label: "Search", icon: Search, to: "/search" },
  { label: "Explore", icon: Compass, to: "/explore" },
  { label: "Reels", icon: Film, to: "/reels" },
  { label: "Messages", icon: MessageCircle, to: "/messages" },
  { label: "Notifications", icon: Heart, to: "/notifications" },
  { label: "Create", icon: PlusSquare, to: "/create" },
];
const SUGGESTIONS = [
  {
    username: "emma_dev",
    name: "Emma Dev",
    avatar: "https://i.pravatar.cc/100?img=47",
  },
  {
    username: "ali.codes",
    name: "Ali Ahmed",
    avatar: "https://i.pravatar.cc/100?img=52",
  },
  {
    username: "ui_lover",
    name: "UI Lover",
    avatar: "https://i.pravatar.cc/100?img=33",
  },
  {
    username: "reacthub",
    name: "React Hub",
    avatar: "https://i.pravatar.cc/100?img=60",
  },
  {
    username: "zain_dev",
    name: "Zain Dev",
    avatar: "https://i.pravatar.cc/100?img=55",
  },
];

const FOOTER_LINK_LABELS = [
  "About",
  "Help",
  "Press",
  "API",
  "Jobs",
  "Privacy",
  "Terms",
  "Locations",
  "Language",
  "Meta Verified",
] as const;

const footerLinkButtonClass =
  "h-auto min-h-0 cursor-pointer rounded px-1 py-0.5 text-[11px] font-normal leading-relaxed text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-300";

function SidebarNavItem({
  label,
  icon: Icon,
  to,
}: {
  label: string;
  icon: React.ElementType;
  to: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-4 rounded-xl px-3 py-3 text-[15px] font-normal transition-all duration-100
		  ${
        isActive
          ? "font-semibold text-zinc-900"
          : "text-zinc-800 hover:bg-zinc-100"
      }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={24}
            strokeWidth={isActive ? 2.5 : 2}
            className="shrink-0 transition-transform duration-100 group-hover:scale-110"
          />
          <span className="hidden xl:inline">{label}</span>
        </>
      )}
    </NavLink>
  );
}
function MainLayout() {
  //   const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  //   const user = useAppSelector((s) => s.auth.user);
  //   if (!isAuthenticated) {
  //     return <Navigate to="/login" />;
  //   }
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authUser = useAppSelector((s) => s.auth.user);
  const usersById = useAppSelector((s) => s.users.usersById);
  const allUserIds = useAppSelector((s) => s.users.allUserIds);
  const activeModal = useAppSelector((s) => s.ui.activeModal);
  const location = useLocation();
  const matches = useMatches();
  const isCreatePage = location.pathname === "/create";
  const isCreateActive = activeModal === "createPost" || isCreatePage;
  const hideRightSidebar = matches.some((m) =>
    Boolean((m.handle as { hideRightSidebar?: boolean })?.hideRightSidebar),
  );

  // const db = JSON.parse(localStorage.getItem("ig_clone_users_v1") || "null");
  // console.log("DB:", db);
  // console.log("USERS:", db?.usersById ? Object.values(db.usersById) : []);
  console.log("=== DEBUG AUTH USER ===", authUser);
  console.log("=== DEBUG ALL USER IDS ===", allUserIds);
  console.log("=== DEBUG USERS MAP ===", usersById);
  console.log(
    "=== DEBUG LOCAL STORAGE ===",
    localStorage.getItem("ig_clone_users_v1"),
  );
  function handleLogout() {
    dispatch(logout());
    clearSession();
    navigate("/login");
  }
  function openCreateModal() {
    dispatch(setActiveModal("createPost"));
  }
  function closeModal() {
    dispatch(setActiveModal("none"));
  }
  return (
    <div className="bg-white text-zinc-900">
      {/* ─── Mobile top bar ─── */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white px-4 py-2.5 md:hidden">
        <div className="mx-auto flex max-w-[500px] items-center justify-between">
          <span
            style={{ fontFamily: "'Billabong', cursive" }}
            className="text-[28px] leading-none pt-1 select-none"
          >
            Instagram
          </span>
          <div className="flex items-center gap-3">
            <button
              aria-label="Notifications"
              className="rounded-full p-1.5 transition-colors hover:bg-zinc-100 active:scale-95"
            >
              <Heart size={23} strokeWidth={2} />
            </button>
            <button
              aria-label="Messages"
              className="rounded-full p-1.5 transition-colors hover:bg-zinc-100 active:scale-95"
            >
              <MessageCircle size={23} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Outer 12-col grid ─── */}
      <div className="grid w-full grid-cols-12">
        {/* ─── Left Sidebar (md: icon-only, xl: full) ─── */}
        <aside className="hidden md:flex md:col-span-1 xl:col-span-3 flex-col border-r border-zinc-200 bg-white">
          <div className="sticky top-0 flex h-screen flex-col px-2 xl:px-3 py-6">
            {/* Logo */}
            <div className="mb-5 xl:mb-8 px-3 h-[36px] flex items-center">
              <span
                style={{ fontFamily: "'Billabong', cursive" }}
                className="hidden xl:block text-[30px] leading-none pt-1 select-none"
              >
                Instagram
              </span>
              {/* Compact icon for md-lg */}
              <div className="flex xl:hidden items-center justify-center w-9 h-9">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4.5" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </div>
            </div>

            {/* Nav items */}
            <nav className="flex-1 space-y-0.5">
              {NAV_ITEMS.map((item) => {
                if (item.to === "/create") {
                  return (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={openCreateModal}
                      className={`group flex w-full items-center justify-start gap-4 rounded-xl px-3 py-3 text-[15px] font-normal transition-all duration-100 h-auto cursor-pointer
                      ${
                        isCreateActive
                          ? "font-semibold text-zinc-900"
                          : "text-zinc-800 hover:bg-zinc-100"
                      }`}
                    >
                      <item.icon
                        size={24}
                        strokeWidth={isCreateActive ? 2.5 : 2}
                        className="shrink-0 transition-transform duration-100 group-hover:scale-110"
                      />
                      <span className="hidden xl:inline">{item.label}</span>
                    </Button>
                  );
                }

                return <SidebarNavItem key={item.label} {...item} />;
              })}

              {/* Profile */}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `group flex items-center gap-4 rounded-xl px-3 py-3 text-[15px] font-normal transition-all duration-100
                  ${
                    isActive
                      ? "font-semibold text-zinc-900"
                      : "text-zinc-800 hover:bg-zinc-100"
                  }`
                }
              >
                {({ isActive }) =>
                  authUser ? (
                    <>
                      <Avatar
                        className={`size-6 shrink-0 transition-transform duration-100 group-hover:scale-110 ${
                          isActive ? "ring-2 ring-zinc-900 ring-offset-1" : ""
                        }`}
                      >
                        <AvatarImage
                          src={authUser.avatarUrl}
                          alt={authUser.username}
                        />
                        <AvatarFallback className="text-xs">
                          {authUser.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`hidden xl:inline ${
                          isActive ? "font-semibold" : ""
                        }`}
                      >
                        Profile
                      </span>
                    </>
                  ) : (
                    <>
                      <User
                        size={24}
                        strokeWidth={isActive ? 2.5 : 2}
                        className="shrink-0 transition-transform duration-100 group-hover:scale-110"
                      />
                      <span className="hidden xl:inline">Profile</span>
                    </>
                  )
                }
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* ─── Center feed ─── */}
        <main
          className={cn(
            "col-span-12 min-h-screen border-r border-zinc-100 md:col-span-11",
            hideRightSidebar ? "xl:col-span-9" : "xl:col-span-6",
          )}
        >
          <div
            className={cn(
              "w-full pb-20 md:pb-6",
              // hideRightSidebar ? "mx-0" : "mx-0 md:mx-[10px]",
            )}
          >
            <Outlet />
          </div>
        </main>

        {/* ─── Right sidebar ─── */}
        {!hideRightSidebar && (
          <aside className="hidden xl:col-span-3 xl:flex flex-col px-7 py-8">
            <div className="sticky top-8 space-y-12">
              {/* Logged-in user widget */}
              {authUser && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <Avatar className="size-11">
                      <AvatarImage
                        src={authUser.avatarUrl}
                        alt={authUser.username}
                      />
                      <AvatarFallback>
                        {authUser.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-start items-start">
                      <p className="text-sm font-semibold leading-snug">
                        {authUser.username}
                      </p>
                      <p className="text-xs text-zinc-500 leading-snug">
                        {authUser.fullName}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleLogout}
                    aria-label="Log out or switch account"
                    className="h-auto min-h-0 cursor-pointer rounded-md px-2 py-1 text-xs font-semibold text-[#0095f6] hover:bg-zinc-100 hover:text-[#0095f6] dark:hover:bg-zinc-800/80"
                  >
                    Log Out
                  </Button>
                </div>
              )}

              {/* Suggestions */}
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-semibold text-zinc-900">
                    Suggested For You
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label="See all suggested accounts"
                    className="h-auto min-h-0 cursor-pointer rounded-md px-2 py-1 text-xs font-semibold text-zinc-900 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100"
                  >
                    See all
                  </Button>
                </div>
                <div className="space-y-3.5">
                  {SUGGESTIONS.map((s) => (
                    <div
                      key={s.username}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={s.avatar} alt={s.username} />
                          <AvatarFallback className="text-xs">
                            {s.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start gap-0.5">
                          <p className="text-[13px] font-semibold leading-snug">
                            {s.username}
                          </p>
                          <p className="text-[12px] text-zinc-400 leading-snug">
                            Suggested for you
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        aria-label={`Follow ${s.username}`}
                        className="h-auto min-h-0 shrink-0 cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold text-[#0095f6] hover:bg-zinc-100 hover:text-[#0095f6] dark:hover:bg-zinc-800/80"
                      >
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="text-center">
                <nav
                  aria-label="Site links"
                  className="flex flex-wrap items-center justify-center gap-x-0.5 gap-y-1 leading-relaxed"
                >
                  {FOOTER_LINK_LABELS.map((label, index) => (
                    <span key={label} className="inline-flex items-center">
                      {index > 0 ? (
                        <span
                          className="mx-0.5 text-[11px] text-zinc-400 select-none"
                          aria-hidden
                        >
                          ·
                        </span>
                      ) : null}
                      <Button
                        type="button"
                        variant="ghost"
                        aria-label={label}
                        className={footerLinkButtonClass}
                      >
                        {label}
                      </Button>
                    </span>
                  ))}
                </nav>
                <p className="mt-2 text-center text-[11px] text-zinc-400">
                  © 2026 Instagram from Meta
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>
      <Dialog
        open={activeModal === "createPost"}
        onOpenChange={(open) => !open && closeModal()}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ color: "black" }}>
              Create New Post
            </DialogTitle>
          </DialogHeader>
          <CreatePostForm
            onSuccess={() => {
              closeModal();
              navigate("/");
            }}
            onCancel={closeModal}
          />
        </DialogContent>
      </Dialog>
      {/* ─── Mobile bottom nav ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200 bg-white px-2 py-2.5 md:hidden">
        <div className="mx-auto flex max-w-[500px] items-center justify-around">
          {[
            { icon: House, to: "/" },
            { icon: Search, to: "/search" },
            { icon: PlusSquare, to: "/create" },
            { icon: Film, to: "/reels" },
          ].map(({ icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center justify-center rounded-full p-2 transition-all active:scale-90 ${
                  isActive ? "text-zinc-900" : "text-zinc-500"
                }`
              }
            >
              {({ isActive }) => (
                <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
              )}
            </NavLink>
          ))}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center justify-center rounded-full p-1 transition-all active:scale-90 ${
                isActive
                  ? "ring-[2px] ring-zinc-900 ring-offset-1 rounded-full"
                  : ""
              }`
            }
          >
            {authUser ? (
              <Avatar className="size-7">
                <AvatarImage src={authUser.avatarUrl} alt={authUser.username} />
                <AvatarFallback className="text-xs">
                  {authUser.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <User size={26} strokeWidth={2} />
            )}
          </NavLink>
        </div>
      </nav>
    </div>
  );
}

export default MainLayout;

{
  /* <aside className="hidden border-l bg-white px-6 py-6 lg:col-span-3 lg:block">
  <button
    type="button"
    onClick={handleLogout}
    className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-100"
  >
    Logout {authUser ? `(${authUser.username})` : ""}
  </button>
  <div className="sticky top-6">
    <p className="text-sm font-semibold">Suggestions for you</p>
    <div className="mt-4 space-y-3">
      {["emma_dev", "ali.codes", "ui_lover", "reacthub"].map((u) => (
        <div
          key={u}
          className="flex items-center justify-between rounded-md bg-zinc-50 p-3"
        >
          <p className="text-sm">{u}</p>
          <button className="text-xs font-medium text-blue-600">Follow</button>
        </div>
      ))}
    </div>
  </div>
  <div className="mt-4 rounded-md border bg-zinc-100 p-3 text-xs">
    <p>
      <strong>Logged user:</strong> {authUser?.username ?? "none"}
    </p>
    <p>
      <strong>Total users:</strong> {allUserIds.length}
    </p>
    <p>
      <strong>User ids:</strong> {allUserIds.join(", ") || "none"}
    </p>
  </div>
</aside>; */
}
