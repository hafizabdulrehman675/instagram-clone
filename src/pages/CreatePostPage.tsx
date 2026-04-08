import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import CreatePostForm from "@/features/posts/components/CreatePostForm";

function CreatePostPage() {
  const navigate = useNavigate();

  return (
    <Card className="mx-auto mt-4 w-full max-w-[520px]">
      <CardHeader>
        <CardTitle>Create post</CardTitle>
      </CardHeader>
      <CardContent>
        <CreatePostForm
          onSuccess={() => navigate("/")}
          onCancel={() => navigate("/")}
        />
      </CardContent>
    </Card>
  );
}

export default CreatePostPage;
