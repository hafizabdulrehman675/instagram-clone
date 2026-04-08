type Conversation = {
  id: string;
  username: string;
  lastMessage: string;
  time: string;
  unread: number;
};

const MOCK_CONVERSATIONS: ReadonlyArray<Conversation> = [
  {
    id: "c1",
    username: "emma_ui",
    lastMessage: "Can you review the UI?",
    time: "2m",
    unread: 2,
  },
  {
    id: "c2",
    username: "john_doe",
    lastMessage: "Great post!",
    time: "1h",
    unread: 0,
  },
  {
    id: "c3",
    username: "zain_dev",
    lastMessage: "Let’s sync tomorrow",
    time: "3h",
    unread: 1,
  },
];

function MessagesPage() {
  return (
    <div className="mx-auto h-[calc(100vh-90px)] w-full max-w-[900px] px-1 py-4">
      <div className="grid h-full grid-cols-12 overflow-hidden rounded-md border border-zinc-200 bg-white">
        {/* Conversation list */}
        <aside className="col-span-12 border-r border-zinc-100 md:col-span-4">
          <div className="border-b border-zinc-100 px-4 py-3">
            <h1 className="text-sm font-semibold">Messages</h1>
          </div>

          <div className="divide-y divide-zinc-100">
            {MOCK_CONVERSATIONS.map((chat) => (
              <button
                key={chat.id}
                type="button"
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-zinc-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                  {chat.username.slice(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {chat.username}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {chat.lastMessage}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] text-zinc-400">{chat.time}</p>
                  {chat.unread > 0 ? (
                    <span className="mt-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
                      {chat.unread}
                    </span>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Empty chat panel */}
        <section className="col-span-12 hidden items-center justify-center md:col-span-8 md:flex">
          <div className="space-y-2 text-center">
            <p className="text-base font-semibold text-zinc-900">
              Your Messages
            </p>
            <p className="text-sm text-zinc-500">
              Select a conversation to start chatting.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MessagesPage;
