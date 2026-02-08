import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface PostData {
  _id: Id<"posts">;
  content: string;
  authorId: Id<"users">;
  authorName: string;
  authorHandle: string;
  likes: number;
  reposts: number;
  replies: number;
  views: number;
  createdAt: number;
  isLiked: boolean;
  isReposted: boolean;
}

interface PostProps {
  post: PostData;
  isOwner: boolean;
  index: number;
}

export function Post({ post, isOwner, index }: PostProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const likePost = useMutation(api.posts.like);
  const repostPost = useMutation(api.posts.repost);
  const deletePost = useMutation(api.posts.remove);

  const handleLike = async () => {
    try {
      await likePost({ postId: post._id });
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleRepost = async () => {
    try {
      await repostPost({ postId: post._id });
    } catch (error) {
      console.error("Failed to repost:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    setIsDeleting(true);
    try {
      await deletePost({ postId: post._id });
    } catch (error) {
      console.error("Failed to delete post:", error);
      setIsDeleting(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <article
      className={`p-4 hover:bg-zinc-900/30 transition-colors cursor-pointer relative ${
        isDeleting ? "opacity-50 pointer-events-none" : ""
      }`}
      style={{
        animation: `fadeSlideIn 0.4s ease-out ${index * 0.05}s both`
      }}
    >
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {post.authorName[0]?.toUpperCase() || "?"}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              <span className="font-bold hover:underline truncate">
                {post.authorName}
              </span>
              <span className="text-zinc-500 truncate">@{post.authorHandle}</span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-500 hover:underline">
                {formatTime(post.createdAt)}
              </span>
            </div>

            {/* Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 rounded-full hover:bg-sky-500/10 text-zinc-500 hover:text-sky-500 transition-colors -mt-1 -mr-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                </svg>
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 bg-black border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-20 min-w-[200px]">
                    {isOwner && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-zinc-900 transition-colors text-red-500 flex items-center gap-3"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.11 2 8 3.12 8 4.5V6H3v2h1.06l.81 11.21C4.98 20.78 6.28 22 7.86 22h8.27c1.58 0 2.88-1.22 3-2.79L19.93 8H21V6h-5zm-6-1.5c0-.28.22-.5.5-.5h3c.27 0 .5.22.5.5V6h-4V4.5zm7.13 14.57c-.04.52-.47.93-1 .93H7.86c-.53 0-.96-.41-1-.93L6.07 8h11.85l-.79 11.07zM9 17v-6h2v6H9zm4 0v-6h2v6h-2z" />
                        </svg>
                        Delete
                      </button>
                    )}
                    <button
                      onClick={() => setShowMenu(false)}
                      className="w-full px-4 py-3 text-left hover:bg-zinc-900 transition-colors flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.486 2 2 6.486 2 12c0 5.515 4.486 10 10 10s10-4.485 10-10c0-5.514-4.486-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm5-9h-4V7h-2v4H7v2h4v4h2v-4h4v-2z" />
                      </svg>
                      Follow @{post.authorHandle}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Post content */}
          <p className="mt-1 text-[15px] leading-normal whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 max-w-md">
            {/* Reply */}
            <button className="group flex items-center gap-1 text-zinc-500 hover:text-sky-500 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-sky-500/10 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />
                </svg>
              </div>
              <span className="text-sm">{post.replies > 0 && formatNumber(post.replies)}</span>
            </button>

            {/* Repost */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRepost();
              }}
              className={`group flex items-center gap-1 transition-colors ${
                post.isReposted ? "text-green-500" : "text-zinc-500 hover:text-green-500"
              }`}
            >
              <div className={`p-2 rounded-full transition-colors ${
                post.isReposted ? "bg-green-500/10" : "group-hover:bg-green-500/10"
              }`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />
                </svg>
              </div>
              <span className="text-sm">{post.reposts > 0 && formatNumber(post.reposts)}</span>
            </button>

            {/* Like */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className={`group flex items-center gap-1 transition-colors ${
                post.isLiked ? "text-pink-500" : "text-zinc-500 hover:text-pink-500"
              }`}
            >
              <div className={`p-2 rounded-full transition-colors ${
                post.isLiked ? "bg-pink-500/10" : "group-hover:bg-pink-500/10"
              }`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={post.isLiked ? "0" : "2"}>
                  <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
                </svg>
              </div>
              <span className="text-sm">{post.likes > 0 && formatNumber(post.likes)}</span>
            </button>

            {/* Views */}
            <button className="group flex items-center gap-1 text-zinc-500 hover:text-sky-500 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-sky-500/10 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />
                </svg>
              </div>
              <span className="text-sm">{formatNumber(post.views)}</span>
            </button>

            {/* Share */}
            <div className="flex items-center">
              <button className="p-2 rounded-full hover:bg-sky-500/10 text-zinc-500 hover:text-sky-500 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
