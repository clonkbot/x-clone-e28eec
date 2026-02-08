import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Profile {
  displayName: string;
  handle: string;
}

interface ComposerProps {
  profile: Profile | null | undefined;
}

export function Composer({ profile }: ComposerProps) {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const createPost = useMutation(api.posts.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isPosting) return;

    setIsPosting(true);
    try {
      await createPost({ content: content.trim() });
      setContent("");
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const charLimit = 280;
  const remaining = charLimit - content.length;
  const isOverLimit = remaining < 0;
  const isNearLimit = remaining <= 20 && remaining >= 0;

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm lg:text-base">
          {profile?.displayName?.[0]?.toUpperCase() || "?"}
        </div>

        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What is happening?!"
            className="w-full bg-transparent text-lg lg:text-xl placeholder-zinc-500 resize-none focus:outline-none min-h-[80px] lg:min-h-[100px]"
            rows={3}
          />

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
            <div className="flex items-center gap-1">
              {[
                "M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z",
                "M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172.77.172l.54-1.313s-.57-.344-1.42-.344c-1.14 0-1.96.844-1.96 1.969 0 2.219 2.52 1.875 2.52 2.656 0 .219-.19.406-.56.406-.49 0-1.05-.281-1.05-.281L6.96 15.25s.62.406 1.66.406c1.03 0 2.01-.719 2.01-1.906 0-2.219-2.52-1.875-2.52-2.656 0-.313.28-.469.61-.469z",
                "M6 5c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zM2 7c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12V6h10v2zM6 15c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zm-4 2c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12v-2h10v2z",
                "M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.054 2.322z",
                "M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-11C5.12 21 4 19.881 4 18.5v-13C4 4.119 5.12 3 6.5 3H6zm0 2h-.5c-.27 0-.5.224-.5.5v1.5h14V5.5c0-.276-.23-.5-.5-.5H18v1h-2V5H8v1H6V5zM5 9v9.5c0 .276.23.5.5.5h11c.27 0 .5-.224.5-.5V9H5zm2 2h2v2H7v-2zm2 4H7v2h2v-2zm2-4h2v2h-2v-2zm2 4h-2v2h2v-2zm2-4h2v2h-2v-2z",
              ].map((icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="p-2 rounded-full hover:bg-sky-500/10 text-sky-500 transition-colors hidden sm:block"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d={icon} />
                  </svg>
                </button>
              ))}
              <button
                type="button"
                className="p-2 rounded-full hover:bg-sky-500/10 text-sky-500 transition-colors sm:hidden"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {content.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6">
                    <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke={isOverLimit ? "#ef4444" : "#374151"}
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke={isOverLimit ? "#ef4444" : isNearLimit ? "#eab308" : "#0ea5e9"}
                        strokeWidth="2"
                        strokeDasharray={`${Math.min(100, (content.length / charLimit) * 100) * 0.628} 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  {(isNearLimit || isOverLimit) && (
                    <span className={`text-sm ${isOverLimit ? "text-red-500" : "text-yellow-500"}`}>
                      {remaining}
                    </span>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={!content.trim() || isOverLimit || isPosting}
                className="px-4 lg:px-6 py-2 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isPosting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
