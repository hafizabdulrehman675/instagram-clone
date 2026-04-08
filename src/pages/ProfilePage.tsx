import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FeedPost } from "@/features/posts/types";
import { useAppSelector } from "@/app/hooks";
import { useAppDispatch } from "@/app/hooks";
import { setActiveModal } from "@/features/ui/redux/uiSlice";
function ProfilePage() {
  const authUser = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const userPosts = useAppSelector((s) => {
    if (!s.auth.user) return [] as FeedPost[];

    const username = s.auth.user.username;

    // posts store shape: postsById + feedPostIds (ids define order)
    return s.posts.feedPostIds
      .map((id) => s.posts.postsById[id])
      .filter((p): p is FeedPost => Boolean(p) && p.username === username);
  });

  const [tabValue, setTabValue] = useState<string>("posts");

  const stats = useMemo(() => {
    return {
      posts: userPosts.length,
      followers: 1200, // static for now (no social feature yet)
      following: 320, // static for now
    };
  }, [userPosts.length]);

  if (!authUser) {
    return (
      <div className="mx-auto w-full max-w-[630px] px-1 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-zinc-600">
              Please log in to view your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[630px] space-y-4 px-1 py-4">
      {/* Header */}
      <Card className="border-zinc-200 bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-20">
                <AvatarImage src={authUser.avatarUrl} alt={authUser.username} />
                <AvatarFallback className="text-sm">
                  {authUser.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div>
                  <p className="text-xl font-semibold leading-tight">
                    {authUser.username}
                  </p>
                  <p className="text-sm text-zinc-500 leading-tight">
                    {authUser.fullName}
                  </p>
                </div>

                {/* Stats row */}
                <div className="flex gap-6">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">{stats.posts}</p>
                    <p className="text-xs text-zinc-500">posts</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">{stats.followers}</p>
                    <p className="text-xs text-zinc-500">followers</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">{stats.following}</p>
                    <p className="text-xs text-zinc-500">following</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" type="button">
                Edit Profile
              </Button>
              <Button
                variant="default"
                type="button"
                onClick={() => dispatch(setActiveModal("createPost"))}
              >
                + Create
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Bio / placeholder */}
          <p className="text-sm leading-relaxed text-zinc-700">
            This is your static demo profile. Create a post to see it appear in
            your grid.
          </p>
        </CardContent>
      </Card>

      {/* Tabs + grid */}
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <TabsList className="w-full justify-start bg-white">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="tagged">Tagged</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-4">
          {userPosts.length === 0 ? (
            <div className="rounded-md border border-zinc-200 bg-white p-6 text-center">
              <p className="text-sm font-semibold text-zinc-900">
                No posts yet
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Tap <span className="font-semibold">Create</span> to add your
                first post.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {userPosts.map((post) => (
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
        </TabsContent>

        <TabsContent value="saved" className="mt-4">
          <div className="rounded-md border border-zinc-200 bg-white p-6 text-center">
            <p className="text-sm font-semibold text-zinc-900">
              Saved is coming next
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Save posts from the feed to see them here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="tagged" className="mt-4">
          <div className="rounded-md border border-zinc-200 bg-white p-6 text-center">
            <p className="text-sm font-semibold text-zinc-900">
              Tagged is coming next
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Tagging logic isn’t implemented yet.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProfilePage;
