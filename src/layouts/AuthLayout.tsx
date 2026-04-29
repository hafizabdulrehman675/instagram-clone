import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="my-auto">
      <div className="px-4 py-3 w-full  grid grid-cols-1 md:grid-cols-5">
        <div className="hidden lg:flex flex-1 items-center justify-center bg-white border border-zinc-200 rounded-l-2xl px-12 py-4 md:col-span-2">
          <div className="flex flex-col items-center gap-8 text-center">
            {/* <PhoneMockup /> */}
            <div className="space-y-2 max-w-xs">
              <span
                className="text-6xl font-semibold tracking-tight text-zinc-900"
                style={{ fontFamily: "'Grand Hotel', cursive" }}
              >
                Instagram
              </span>
              <h1
                className="text-2xl font-bold text-zinc-900 leading-snug"
                style={{ color: "#909697d8" }}
              >
                See everyday moments from your{" "}
                <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                  close friends.
                </span>
              </h1>
              <p className="text-sm text-zinc-500">
                Sign up to see photos and videos from your friends.
              </p>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
