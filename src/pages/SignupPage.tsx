import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSession } from "@/lib/session";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loginSuccess } from "@/features/auth/redux/authSlice";
import type { AuthUser } from "@/features/auth/types";

import { registerUser } from "@/features/users/redux/usersSlice";
import type { UserRecord } from "@/features/users/types";

function SignupPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const usersById = useAppSelector((s) => s.users.usersById);

  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string | null>(null);

  function handleSignup() {
    setError(null);

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedFullName = fullName.trim();

    if (!trimmedUsername || !trimmedEmail || !trimmedFullName || !password) {
      setError("Please fill all fields.");
      return;
    }

    const existingUsers: UserRecord[] = Object.values(usersById);

    const usernameExists = existingUsers.some(
      (u) => u.username === trimmedUsername
    );
    const emailExists = existingUsers.some((u) => u.email === trimmedEmail);

    if (usernameExists) {
      setError("Username already exists. Try another.");
      return;
    }

    if (emailExists) {
      setError("Email already exists. Try another.");
      return;
    }

    const newUserId = `u_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    const newUserRecord: UserRecord = {
      id: newUserId,
      username: trimmedUsername,
      fullName: trimmedFullName,
      email: trimmedEmail,
      avatarUrl: `https://i.pravatar.cc/100?u=${encodeURIComponent(
        trimmedUsername
      )}`,
      password,
    };

    dispatch(registerUser(newUserRecord));

    // const authUser: AuthUser = {
    //   id: newUserRecord.id,
    //   username: newUserRecord.username,
    //   fullName: newUserRecord.fullName,
    //   email: newUserRecord.email,
    //   avatarUrl: newUserRecord.avatarUrl,
    // };

    // dispatch(loginSuccess(authUser));
    // saveSession(authUser.id);
    navigate("/login");
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">Sign up</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-fullname">Full name</Label>
          <Input
            id="signup-fullname"
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-username">Username</Label>
          <Input
            id="signup-username"
            placeholder="Choose username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button className="w-full" type="button" onClick={handleSignup}>
          Sign up
        </Button>
      </CardContent>

      <CardFooter className="justify-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="ml-1 font-medium text-blue-600 hover:underline"
        >
          Log in
        </Link>
      </CardFooter>
    </Card>
  );
}

export default SignupPage;
