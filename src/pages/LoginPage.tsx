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

import type { UserRecord } from "@/features/users/types";

function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const usersById = useAppSelector((s) => s.users.usersById);

  const [identity, setIdentity] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string | null>(null);

  function handleLogin() {
    setError(null);

    const trimmedIdentity = identity.trim();
    if (!trimmedIdentity || !password) {
      setError("Enter username/email and password.");
      return;
    }

    const existingUsers: UserRecord[] = Object.values(usersById);

    const foundUser = existingUsers.find(
      (u) => u.username === trimmedIdentity || u.email === trimmedIdentity
    );

    if (!foundUser) {
      setError("User not found. Please sign up.");
      return;
    }

    if (foundUser.password !== password) {
      setError("Invalid password.");
      return;
    }

    const authUser: AuthUser = {
      id: foundUser.id,
      username: foundUser.username,
      fullName: foundUser.fullName,
      email: foundUser.email,
      avatarUrl: foundUser.avatarUrl,
    };

    dispatch(loginSuccess(authUser));
    saveSession(foundUser.id);
    navigate("/");
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">Log in</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-identity">Email or username</Label>
          <Input
            id="login-identity"
            placeholder="Enter email or username"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button className="w-full" type="button" onClick={handleLogin}>
          Log in
        </Button>
      </CardContent>

      <CardFooter className="justify-center text-sm text-zinc-600">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="ml-1 font-medium text-blue-600 hover:underline"
        >
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
}

export default LoginPage;
