import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid email or password" : "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    try {
      await signIn("anonymous");
    } catch {
      setError("Could not sign in as guest");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-sky-500/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-600/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row">
        {/* Left side - Logo and tagline */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <div className="text-center lg:text-left">
            <svg className="w-16 h-16 lg:w-24 lg:h-24 mx-auto lg:mx-0 mb-8" viewBox="0 0 24 24" fill="white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <h1 className="font-serif text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 tracking-tight">
              Happening now
            </h1>
            <p className="text-xl lg:text-2xl text-zinc-400 font-light">
              Join the conversation today.
            </p>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
          <div className="w-full max-w-md">
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl lg:text-3xl font-bold mb-8">
                {flow === "signIn" ? "Sign in to X" : "Create your account"}
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="group">
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full px-4 py-4 bg-transparent border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-200"
                  />
                </div>
                <div className="group">
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    minLength={6}
                    className="w-full px-4 py-4 bg-transparent border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-200"
                  />
                </div>
                <input name="flow" type="hidden" value={flow} />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading...
                    </span>
                  ) : flow === "signIn" ? "Sign In" : "Create Account"}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-zinc-900/50 text-zinc-500">or</span>
                </div>
              </div>

              <button
                onClick={handleAnonymous}
                disabled={isLoading}
                className="w-full py-4 bg-transparent border border-zinc-700 text-white font-bold rounded-full hover:bg-zinc-800 transition-all duration-200 disabled:opacity-50 mb-4"
              >
                Continue as Guest
              </button>

              <p className="text-center text-zinc-500 mt-6">
                {flow === "signIn" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                  className="text-sky-500 hover:underline font-semibold"
                >
                  {flow === "signIn" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            <p className="text-xs text-zinc-600 text-center mt-6 px-4">
              By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center">
        <p className="text-xs text-zinc-600">
          Requested by <span className="text-zinc-500">@0xPaulius</span> · Built by <span className="text-zinc-500">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}
