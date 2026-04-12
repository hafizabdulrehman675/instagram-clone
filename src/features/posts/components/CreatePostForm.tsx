import { useState } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addPost } from "@/features/posts/redux/postsSlice";
import type { FeedPost } from "@/features/posts/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreatePostFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

function CreatePostForm({ onSuccess, onCancel }: CreatePostFormProps) {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s) => s.auth.user);

  const [imageUrl, setImageUrl] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  function handleCreatePost() {
    setError(null);

    if (!authUser) {
      setError("You must be logged in.");
      return;
    }

    if (!imageUrl.trim() || !caption.trim()) {
      setError("Image URL and caption are required.");
      return;
    }

    const newPost: FeedPost = {
      id: `p_${Date.now()}`,
      authorId: authUser.id,
      username: authUser.username,
      avatarUrl: authUser.avatarUrl,
      location: location.trim(),
      imageUrl: imageUrl.trim(),
      likesCount: 0,
      caption: caption.trim(),
      commentsCount: 0,
      comments: [],
      postedAtLabel: "JUST NOW",
      isLiked: false,
      isSaved: false,
    };

    dispatch(addPost(newPost));
    setImageUrl("");
    setCaption("");
    setLocation("");
    onSuccess?.();
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="create-image-url">Image URL</Label>
        <Input
          id="create-image-url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="create-caption">Caption</Label>
        <Input
          id="create-caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="create-location">Location (optional)</Label>
        <Input
          id="create-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Karachi, PK"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex gap-2">
        <Button type="button" onClick={handleCreatePost}>
          Share
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default CreatePostForm;
