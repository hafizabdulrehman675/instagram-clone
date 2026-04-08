import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/app/hooks";
import type { FeedPost } from "@/features/posts/types";

function ExplorePage() {
  const [query, setQuery] = useState<string>("");

  const posts = useAppSelector((state) =>
    state.posts.feedPostIds
      .map((id) => state.posts.postsById[id])
      .filter((post): post is FeedPost => Boolean(post)),
  );

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;

    return posts.filter(
      (post) =>
        post.username.toLowerCase().includes(q) ||
        post.caption.toLowerCase().includes(q) ||
        post.location.toLowerCase().includes(q),
    );
  }, [posts, query]);

  return (
    <div className="mx-auto w-full max-w-[630px] space-y-4 px-1 py-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts, users, places"
          className="pl-9"
        />
      </div>

      {filteredPosts.length === 0 ? (
        <div className="rounded-md border border-zinc-200 bg-white p-6 text-center">
          <p className="text-sm font-semibold text-zinc-900">
            No results found
          </p>
          <p className="mt-1 text-sm text-zinc-500">Try a different keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="aspect-square overflow-hidden bg-zinc-100"
            >
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExplorePage;
