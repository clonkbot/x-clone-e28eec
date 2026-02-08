import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Feed } from "./Feed";
import { Composer } from "./Composer";
import { useEffect, useState } from "react";

export function MainLayout() {
  const { signOut } = useAuthActions();
  const profile = useQuery(api.profiles.get);
  const ensureProfile = useMutation(api.profiles.ensureProfile);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (profile === null) {
      ensureProfile();
    }
  }, [profile, ensureProfile]);

  const navItems = [
    { icon: "M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5A2.5 2.5 0 005.5 22h13a2.5 2.5 0 002.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z", label: "Home", active: true },
    { icon: "M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z", label: "Explore" },
    { icon: "M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.866 16H5.134z", label: "Notifications" },
    { icon: "M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z", label: "Messages" },
    { icon: "M4 4.5A2.5 2.5 0 016.5 2h11A2.5 2.5 0 0120 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.224-.5.5v14.56l6-4.29 6 4.29V4.5c0-.276-.224-.5-.5-.5h-11z", label: "Bookmarks" },
    { icon: "M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar - Hidden on mobile */}
        <aside className="hidden lg:flex w-72 flex-col fixed h-screen border-r border-zinc-800 p-4">
          <div className="flex-1">
            <a href="#" className="inline-block p-3 rounded-full hover:bg-zinc-900 transition-colors">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <nav className="mt-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className={`flex items-center gap-5 p-4 rounded-full hover:bg-zinc-900 transition-all duration-200 group ${
                    item.active ? "font-bold" : ""
                  }`}
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d={item.icon} />
                  </svg>
                  <span className="text-xl">{item.label}</span>
                </a>
              ))}
            </nav>

            <button className="w-full mt-6 py-4 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-sky-500/20">
              Post
            </button>
          </div>

          {/* User profile section */}
          <div className="relative">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-full hover:bg-zinc-900 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold">
                {profile?.displayName?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 text-left hidden xl:block">
                <p className="font-bold text-sm truncate">{profile?.displayName || "Loading..."}</p>
                <p className="text-zinc-500 text-sm truncate">@{profile?.handle || "..."}</p>
              </div>
              <svg className="w-5 h-5 text-zinc-500 hidden xl:block" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
              </svg>
            </button>

            {mobileMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
                <button
                  onClick={() => signOut()}
                  className="w-full p-4 text-left hover:bg-zinc-800 transition-colors text-red-400 font-semibold"
                >
                  Log out @{profile?.handle}
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 lg:mr-96 min-h-screen border-r border-zinc-800">
          {/* Mobile header */}
          <header className="lg:hidden sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold">
              {profile?.displayName?.[0]?.toUpperCase() || "?"}
            </div>
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <button
              onClick={() => signOut()}
              className="w-10 h-10 rounded-full hover:bg-zinc-900 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </header>

          {/* Desktop header */}
          <header className="hidden lg:block sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800">
            <div className="px-4 py-4">
              <h1 className="text-xl font-bold">Home</h1>
            </div>
            <div className="flex border-b border-zinc-800">
              <button className="flex-1 py-4 text-center font-bold relative hover:bg-zinc-900/50 transition-colors">
                For you
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-sky-500 rounded-full"></div>
              </button>
              <button className="flex-1 py-4 text-center text-zinc-500 hover:bg-zinc-900/50 transition-colors">
                Following
              </button>
            </div>
          </header>

          {/* Composer */}
          <div className="border-b border-zinc-800">
            <Composer profile={profile} />
          </div>

          {/* Feed */}
          <Feed currentUserId={profile?.userId} />

          {/* Footer */}
          <footer className="py-6 text-center border-t border-zinc-800">
            <p className="text-xs text-zinc-600">
              Requested by <span className="text-zinc-500">@0xPaulius</span> · Built by <span className="text-zinc-500">@clonkbot</span>
            </p>
          </footer>
        </main>

        {/* Right Sidebar - Hidden on mobile and tablet */}
        <aside className="hidden lg:block w-96 fixed right-0 h-screen p-4 overflow-y-auto">
          {/* Search */}
          <div className="relative mb-4">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-full text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500 focus:bg-black transition-all duration-200"
            />
          </div>

          {/* Subscribe card */}
          <div className="bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800">
            <h2 className="text-xl font-bold mb-2">Subscribe to Premium</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Subscribe to unlock new features and if eligible, receive a share of ads revenue.
            </p>
            <button className="px-6 py-2 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-600 transition-all duration-200">
              Subscribe
            </button>
          </div>

          {/* What's happening */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <h2 className="text-xl font-bold p-4">What's happening</h2>

            {[
              { category: "Technology · Trending", topic: "#ConvexDB", posts: "12.4K" },
              { category: "Programming · Trending", topic: "TypeScript 5.4", posts: "8.2K" },
              { category: "Trending in Tech", topic: "Claude AI", posts: "45.1K" },
              { category: "Sports · Trending", topic: "#WorldCup", posts: "234K" },
            ].map((trend, i) => (
              <div key={i} className="px-4 py-3 hover:bg-zinc-800/50 transition-colors cursor-pointer">
                <p className="text-xs text-zinc-500">{trend.category}</p>
                <p className="font-bold">{trend.topic}</p>
                <p className="text-xs text-zinc-500">{trend.posts} posts</p>
              </div>
            ))}

            <button className="w-full p-4 text-left text-sky-500 hover:bg-zinc-800/50 transition-colors">
              Show more
            </button>
          </div>

          {/* Who to follow */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden mt-4">
            <h2 className="text-xl font-bold p-4">Who to follow</h2>

            {[
              { name: "Convex", handle: "convaborx", verified: true },
              { name: "Anthropic", handle: "AnthropicAI", verified: true },
              { name: "TypeScript", handle: "typescript", verified: true },
            ].map((user, i) => (
              <div key={i} className="px-4 py-3 hover:bg-zinc-800/50 transition-colors flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-bold">
                  {user.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate flex items-center gap-1">
                    {user.name}
                    {user.verified && (
                      <svg className="w-4 h-4 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                      </svg>
                    )}
                  </p>
                  <p className="text-zinc-500 text-sm truncate">@{user.handle}</p>
                </div>
                <button className="px-4 py-2 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors text-sm">
                  Follow
                </button>
              </div>
            ))}

            <button className="w-full p-4 text-left text-sky-500 hover:bg-zinc-800/50 transition-colors">
              Show more
            </button>
          </div>

          {/* Footer links */}
          <div className="p-4 text-xs text-zinc-600 flex flex-wrap gap-x-3 gap-y-1">
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Cookie Policy</a>
            <a href="#" className="hover:underline">Accessibility</a>
            <a href="#" className="hover:underline">Ads info</a>
            <span>© 2024 X Corp.</span>
          </div>
        </aside>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-zinc-800 flex justify-around py-3 z-50">
        {navItems.slice(0, 4).map((item) => (
          <a key={item.label} href="#" className="p-3 rounded-full hover:bg-zinc-900 transition-colors">
            <svg className={`w-6 h-6 ${item.active ? "text-white" : "text-zinc-500"}`} viewBox="0 0 24 24" fill="currentColor">
              <path d={item.icon} />
            </svg>
          </a>
        ))}
      </nav>
    </div>
  );
}
