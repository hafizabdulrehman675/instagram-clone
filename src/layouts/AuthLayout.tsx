import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-8">
        <div className="grid w-full gap-6 md:grid-cols-2">
          <section className="hidden items-center justify-center rounded-2xl border bg-white p-8 md:flex">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold">Instagram</h1>
              <p className="text-sm text-zinc-600">
                Share moments. Build your static frontend first.
              </p>
            </div>
          </section>

          <section className="flex items-center justify-center">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
