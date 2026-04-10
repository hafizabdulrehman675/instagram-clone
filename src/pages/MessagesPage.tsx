import { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  Edit,
  Phone,
  Video,
  Info,
  Send,
  Image,
  Heart,
  Smile,
  MoreHorizontal,
  ChevronLeft,
  Mic,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/app/hooks";

/* ─── Types ─────────────────────────────────────────────────────── */
type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  reacted?: string;
  seen?: boolean;
};

type Conversation = {
  id: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl: string;
    isOnline: boolean;
    lastSeen?: string;
  };
  messages: Message[];
  unreadCount: number;
};

/* ─── Seed data ──────────────────────────────────────────────────── */
const SEED_CONVOS: Conversation[] = [
  {
    id: "c1",
    user: {
      id: "u2",
      username: "emma_dev",
      fullName: "Emma Dev",
      avatarUrl: "https://i.pravatar.cc/100?img=47",
      isOnline: true,
    },
    unreadCount: 2,
    messages: [
      {
        id: "m1",
        senderId: "u2",
        text: "Hey! Saw your latest post 🔥",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
      {
        id: "m2",
        senderId: "me",
        text: "Thanks! Been working on it all week 😄",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9),
        seen: true,
      },
      {
        id: "m3",
        senderId: "u2",
        text: "The UI looks insane, what stack are you using?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        id: "m4",
        senderId: "u2",
        text: "Also are you free to collab sometime?",
        timestamp: new Date(Date.now() - 1000 * 60 * 28),
      },
    ],
  },
  {
    id: "c2",
    user: {
      id: "u3",
      username: "ali.codes",
      fullName: "Ali Ahmed",
      avatarUrl: "https://i.pravatar.cc/100?img=52",
      isOnline: true,
    },
    unreadCount: 0,
    messages: [
      {
        id: "m5",
        senderId: "me",
        text: "Did you push the PR yet?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        seen: true,
      },
      {
        id: "m6",
        senderId: "u3",
        text: "Yeah just now, check it out!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.8),
      },
      {
        id: "m7",
        senderId: "me",
        text: "Looks good, I'll review tonight 👍",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.5),
        seen: true,
      },
    ],
  },
  {
    id: "c3",
    user: {
      id: "u4",
      username: "zain_dev",
      fullName: "Zain Dev",
      avatarUrl: "https://i.pravatar.cc/100?img=55",
      isOnline: false,
      lastSeen: "Yesterday",
    },
    unreadCount: 0,
    messages: [
      {
        id: "m8",
        senderId: "u4",
        text: "Bro the new component library is 🤌",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
      {
        id: "m9",
        senderId: "me",
        text: "Right?? Tailwind + shadcn is unbeatable",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23.8),
        seen: true,
      },
    ],
  },
  {
    id: "c4",
    user: {
      id: "u5",
      username: "sara.ui",
      fullName: "Sara UI",
      avatarUrl: "https://i.pravatar.cc/100?img=41",
      isOnline: false,
      lastSeen: "2d ago",
    },
    unreadCount: 1,
    messages: [
      {
        id: "m10",
        senderId: "u5",
        text: "Can you review my Figma file?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      },
    ],
  },
  {
    id: "c5",
    user: {
      id: "u6",
      username: "reacthub",
      fullName: "React Hub",
      avatarUrl: "https://i.pravatar.cc/100?img=60",
      isOnline: true,
    },
    unreadCount: 0,
    messages: [
      {
        id: "m11",
        senderId: "me",
        text: "Are you going to the meetup?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
        seen: true,
      },
      {
        id: "m12",
        senderId: "u6",
        text: "For sure! See you there 🙌",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 71),
      },
    ],
  },
];

/* ─── Helpers ────────────────────────────────────────────────────── */
function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
}

function formatMsgTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function shouldShowTimestamp(messages: Message[], index: number): boolean {
  if (index === 0) return true;
  const prev = messages[index - 1];
  const curr = messages[index];
  return curr.timestamp.getTime() - prev.timestamp.getTime() > 1000 * 60 * 10;
}

/* ─── Emoji picker (simple) ─────────────────────────────────────── */
const QUICK_EMOJIS = ["❤️", "😂", "😮", "😢", "😡", "👍"];

/* ─── Conversation list item ────────────────────────────────────── */
function ConvoItem({
  convo,
  active,
  myId,
  onClick,
}: {
  convo: Conversation;
  active: boolean;
  myId: string;
  onClick: () => void;
}) {
  const last = convo.messages.at(-1);
  const isLastMine = last?.senderId === myId;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors
        ${active ? "bg-zinc-100" : "hover:bg-zinc-50"}`}
    >
      {/* Avatar + online dot */}
      <div className="relative shrink-0">
        <Avatar className="size-[56px]">
          <AvatarImage src={convo.user.avatarUrl} alt={convo.user.username} />
          <AvatarFallback>
            {convo.user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {convo.user.isOnline && (
          <span className="absolute bottom-0.5 right-0.5 size-3 rounded-full bg-green-500 ring-2 ring-white" />
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p
            className={`truncate text-[14px] ${convo.unreadCount > 0 ? "font-bold text-zinc-900" : "font-normal text-zinc-900"}`}
          >
            {convo.user.username}
          </p>
          <span className="ml-2 shrink-0 text-[12px] text-zinc-400">
            {last ? formatTime(last.timestamp) : ""}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p
            className={`truncate text-[13px] ${convo.unreadCount > 0 ? "font-semibold text-zinc-900" : "text-zinc-500"}`}
          >
            {isLastMine && <span className="mr-0.5">You:</span>}
            {last?.text ?? "No messages yet"}
          </p>
          {convo.unreadCount > 0 && (
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-bold text-white">
              {convo.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ─── Chat bubble ────────────────────────────────────────────────── */
function ChatBubble({
  msg,
  isMine,
  showAvatar,
  avatar,
  onReact,
}: {
  msg: Message;
  isMine: boolean;
  showAvatar: boolean;
  avatar: string;
  onReact: (msgId: string, emoji: string) => void;
}) {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div
      className={`group flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar (only for other person's last bubble in a cluster) */}
      <div className="size-7 shrink-0">
        {!isMine && showAvatar && (
          <Avatar className="size-7">
            <AvatarImage src={avatar} />
            <AvatarFallback className="text-[10px]">U</AvatarFallback>
          </Avatar>
        )}
      </div>

      <div
        className={`relative flex max-w-[65%] flex-col ${isMine ? "items-end" : "items-start"}`}
      >
        {/* Bubble */}
        <div
          className={`relative rounded-[22px] px-4 py-[9px] text-[14px] leading-snug
            ${
              isMine
                ? "rounded-br-[6px] bg-zinc-900 text-white"
                : "rounded-bl-[6px] bg-zinc-100 text-zinc-900"
            }`}
        >
          {msg.text}

          {/* Reaction badge */}
          {msg.reacted && (
            <span className="absolute -bottom-3 right-1 rounded-full bg-white px-1.5 py-0.5 text-[13px] shadow ring-1 ring-zinc-200">
              {msg.reacted}
            </span>
          )}
        </div>

        {/* Quick-react & time on hover */}
        <div
          className={`mt-1 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100
          ${isMine ? "flex-row-reverse" : "flex-row"}`}
        >
          <span className="text-[11px] text-zinc-400">
            {formatMsgTime(msg.timestamp)}
          </span>

          {/* Emoji quick-react */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowReactions((v) => !v)}
              className="rounded-full p-0.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            >
              <Smile size={14} />
            </button>
            {showReactions && (
              <div
                className={`absolute bottom-7 flex gap-1 rounded-full border border-zinc-200 bg-white px-2 py-1.5 shadow-xl z-10
                ${isMine ? "right-0" : "left-0"}`}
              >
                {QUICK_EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => {
                      onReact(msg.id, e);
                      setShowReactions(false);
                    }}
                    className="text-[18px] transition hover:scale-125"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Seen indicator */}
        {isMine && msg.seen && (
          <span className="mt-0.5 text-[11px] text-zinc-400">Seen</span>
        )}
      </div>
    </div>
  );
}

/* ─── Empty state ────────────────────────────────────────────────── */
function EmptyChat() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <div className="flex size-24 items-center justify-center rounded-full border-2 border-zinc-300">
        <Send size={36} strokeWidth={1.25} className="text-zinc-400" />
      </div>
      <p className="text-[22px] font-bold text-zinc-900">Your messages</p>
      <p className="max-w-[240px] text-[14px] text-zinc-500">
        Send private photos and messages to a friend or group.
      </p>
      <button className="mt-2 rounded-lg bg-blue-500 px-5 py-2 text-[14px] font-semibold text-white hover:bg-blue-600 transition active:scale-95">
        Send message
      </button>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
function MessagesPage() {
  const authUser = useAppSelector((s) => s.auth.user);
  const myId = authUser?.id ?? "me";

  const [convos, setConvos] = useState<Conversation[]>(SEED_CONVOS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeConvo = useMemo(
    () => convos.find((c) => c.id === activeId) ?? null,
    [convos, activeId],
  );

  const filteredConvos = useMemo(
    () =>
      convos.filter(
        (c) =>
          c.user.username.toLowerCase().includes(search.toLowerCase()) ||
          c.user.fullName.toLowerCase().includes(search.toLowerCase()),
      ),
    [convos, search],
  );

  /* Scroll to bottom on new message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvo?.messages.length]);

  /* Mark as read on open */
  function openConvo(id: string) {
    setActiveId(id);
    setMobileView("chat");
    setConvos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    );
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  /* Send message */
  function sendMessage() {
    const text = inputText.trim();
    if (!text || !activeId) return;

    const newMsg: Message = {
      id: `m_${Date.now()}`,
      senderId: myId,
      text,
      timestamp: new Date(),
      seen: false,
    };

    setConvos((prev) =>
      prev.map((c) =>
        c.id === activeId ? { ...c, messages: [...c.messages, newMsg] } : c,
      ),
    );
    setInputText("");
  }

  /* React to a message */
  function reactToMessage(convoId: string, msgId: string, emoji: string) {
    setConvos((prev) =>
      prev.map((c) =>
        c.id === convoId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === msgId
                  ? { ...m, reacted: m.reacted === emoji ? undefined : emoji }
                  : m,
              ),
            }
          : c,
      ),
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* ══ LEFT: Conversation list ══════════════════════════════════ */}
      <div
        className={`
        flex flex-col border-r border-zinc-200 bg-white
        w-full md:w-[350px] md:flex shrink-0
        ${mobileView === "chat" ? "hidden md:flex" : "flex"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-[17px] font-bold text-zinc-900">
              {authUser?.username ?? "Messages"}
            </h1>
            <button className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 transition">
              <ChevronDown size={18} />
            </button>
          </div>
          <button className="rounded-full p-1.5 text-zinc-900 hover:bg-zinc-100 transition">
            <Edit size={22} strokeWidth={1.75} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2">
            <Search size={15} className="shrink-0 text-zinc-400" />
            <input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[14px] text-zinc-900 outline-none placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-2 py-1">
          {filteredConvos.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-zinc-400">
              No conversations found
            </p>
          ) : (
            filteredConvos.map((c) => (
              <ConvoItem
                key={c.id}
                convo={c}
                active={c.id === activeId}
                myId={myId}
                onClick={() => openConvo(c.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ══ RIGHT: Chat window ══════════════════════════════════════ */}
      <div
        className={`
        flex flex-1 flex-col
        ${mobileView === "list" ? "hidden md:flex" : "flex"}
      `}
      >
        {activeConvo ? (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <div className="flex items-center gap-3">
                {/* Mobile back */}
                <button
                  type="button"
                  onClick={() => setMobileView("list")}
                  className="md:hidden rounded-full p-1.5 hover:bg-zinc-100 transition"
                >
                  <ChevronLeft size={22} />
                </button>

                <div className="relative">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={activeConvo.user.avatarUrl}
                      alt={activeConvo.user.username}
                    />
                    <AvatarFallback>
                      {activeConvo.user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {activeConvo.user.isOnline && (
                    <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                  )}
                </div>

                <div>
                  <p className="text-[15px] font-semibold leading-tight text-zinc-900">
                    {activeConvo.user.username}
                  </p>
                  <p className="text-[12px] leading-tight text-zinc-500">
                    {activeConvo.user.isOnline
                      ? "Active now"
                      : `Active ${activeConvo.user.lastSeen ?? "recently"}`}
                  </p>
                </div>
              </div>

              {/* Header actions */}
              <div className="flex items-center gap-1">
                <button className="rounded-full p-2 text-zinc-900 hover:bg-zinc-100 transition">
                  <Phone size={22} strokeWidth={1.75} />
                </button>
                <button className="rounded-full p-2 text-zinc-900 hover:bg-zinc-100 transition">
                  <Video size={22} strokeWidth={1.75} />
                </button>
                <button className="rounded-full p-2 text-zinc-900 hover:bg-zinc-100 transition">
                  <Info size={22} strokeWidth={1.75} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-1">
              {activeConvo.messages.map((msg, i) => {
                const isMine = msg.senderId === myId;
                const nextMsg = activeConvo.messages[i + 1];
                const showAvatar =
                  !isMine &&
                  (!nextMsg ||
                    nextMsg.senderId === myId ||
                    nextMsg.senderId !== msg.senderId);
                const showTimestamp = shouldShowTimestamp(
                  activeConvo.messages,
                  i,
                );

                return (
                  <div key={msg.id}>
                    {showTimestamp && (
                      <div className="flex justify-center py-3">
                        <span className="text-[11px] text-zinc-400">
                          {formatMsgTime(msg.timestamp)}
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex ${isMine ? "justify-end" : "justify-start"} mb-0.5`}
                    >
                      <ChatBubble
                        msg={msg}
                        isMine={isMine}
                        showAvatar={showAvatar}
                        avatar={activeConvo.user.avatarUrl}
                        onReact={(msgId, emoji) =>
                          reactToMessage(activeConvo.id, msgId, emoji)
                        }
                      />
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="border-t border-zinc-200 px-4 py-3">
              <div className="flex items-center gap-3 rounded-full border border-zinc-300 bg-white px-4 py-2 focus-within:border-zinc-400 transition-colors">
                {/* Emoji */}
                <button
                  type="button"
                  className="shrink-0 text-zinc-500 hover:text-zinc-900 transition"
                >
                  <Smile size={22} strokeWidth={1.75} />
                </button>

                {/* Text input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Message…"
                  className="flex-1 bg-transparent text-[14px] text-zinc-900 outline-none placeholder:text-zinc-400"
                />

                {inputText.trim() ? (
                  /* Send */
                  <button
                    type="button"
                    onClick={sendMessage}
                    className="shrink-0 text-[14px] font-semibold text-blue-500 hover:text-blue-700 transition active:scale-95"
                  >
                    Send
                  </button>
                ) : (
                  /* Media / mic */
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="shrink-0 text-zinc-500 hover:text-zinc-900 transition"
                    >
                      <Mic size={22} strokeWidth={1.75} />
                    </button>
                    <button
                      type="button"
                      className="shrink-0 text-zinc-500 hover:text-zinc-900 transition"
                    >
                      <Image size={22} strokeWidth={1.75} />
                    </button>
                    <button
                      type="button"
                      className="shrink-0 text-zinc-500 hover:text-zinc-900 transition"
                    >
                      <Heart size={22} strokeWidth={1.75} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
}

export default MessagesPage;
