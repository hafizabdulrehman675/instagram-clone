import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveSession } from "@/lib/session";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loginSuccess } from "@/features/auth/redux/authSlice";
import type { AuthUser } from "@/features/auth/types";
import type { UserRecord } from "@/features/users/types";

// ── Yup validation schema ──────────────────────────────────────────────────
const LoginSchema = Yup.object({
  identity: Yup.string().trim().required("Enter your username or email."),
  password: Yup.string().required("Password is required."),
});

// ── Main component ─────────────────────────────────────────────────────────
function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const usersById = useAppSelector((s) => s.users.usersById);

  const formik = useFormik({
    initialValues: { identity: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: (values, { setFieldError, setSubmitting }) => {
      const existingUsers: UserRecord[] = Object.values(usersById);

      const foundUser = existingUsers.find(
        (u) =>
          u.username === values.identity.trim() ||
          u.email === values.identity.trim(),
      );

      if (!foundUser) {
        setFieldError("identity", "User not found. Please sign up.");
        setSubmitting(false);
        return;
      }

      if (foundUser.password !== values.password) {
        setFieldError("password", "Invalid password. Try again.");
        setSubmitting(false);
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
    },
  });

  const fieldError = (name: keyof typeof formik.values) =>
    formik.touched[name] && formik.errors[name]
      ? formik.errors[name]
      : undefined;

  return (
    <div className="flex items-start justify-center bg-white border border-zinc-200 lg:border-l-0 rounded-2xl lg:rounded-l-none lg:rounded-r-2xl px-8 py-4 md:col-span-3">
      <div className="w-full space-y-6">
        {/* Wordmark */}
        <div className="flex justify-center">
          <span
            className="text-4xl font-semibold tracking-tight text-zinc-900"
            style={{ fontFamily: "'Grand Hotel', cursive" }}
          >
            Instagram
          </span>
        </div>

        {/* Google font */}
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Grand+Hotel&display=swap');`}</style>

        {/* ── Form fields ─────────────────────────────────────────── */}
        <div className="space-y-3">
          {/* Identity */}
          <div>
            <Input
              id="login-identity"
              placeholder="Mobile number, username or email"
              className={`bg-zinc-50 border-zinc-300 text-sm h-10 ${
                fieldError("identity")
                  ? "border-red-400 focus-visible:ring-red-300"
                  : ""
              }`}
              autoComplete="username"
              value={formik.values.identity}
              onChange={formik.handleChange("identity")}
              onBlur={formik.handleBlur("identity")}
            />
            {fieldError("identity") && (
              <p className="mt-1 text-xs pt-1 text-red-500">
                {fieldError("identity")}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Input
              id="login-password"
              type="password"
              placeholder="Password"
              className={`bg-zinc-50 border-zinc-300 text-sm h-10 ${
                fieldError("password")
                  ? "border-red-400 focus-visible:ring-red-300"
                  : ""
              }`}
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
            />
            {fieldError("password") && (
              <p className="mt-1 pt-1 text-xs text-red-500">
                {fieldError("password")}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="button"
            className="w-full h-9 text-sm font-semibold bg-blue-400 hover:bg-blue-500 text-white rounded-lg disabled:opacity-60 cursor-pointer"
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting || !formik.dirty}
          >
            {formik.isSubmitting ? "Logging in…" : "Log in"}
          </Button>

          {/* Forgot password */}
          <p className="text-center text-xs text-zinc-500">
            <span className="cursor-pointer hover:underline">
              Forgot password?
            </span>
          </p>
        </div>

        {/* ── Divider ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="text-xs font-semibold text-zinc-400">OR</span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        {/* Log in with Facebook */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#385185] hover:text-blue-800 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
          </svg>
          Log in with Facebook
        </button>

        {/* Sign up link */}
        <p className="text-center text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-500 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
