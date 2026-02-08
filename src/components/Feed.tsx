import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Post } from "./Post";
import { Id } from "../../convex/_generated/dataModel";

interface PostData {
  _id: Id<"posts">;
  _creationTime: number;
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

interface FeedProps {
  currentUserId: Id<"users"> | undefined;
}

export function Feed({ currentUserId }: FeedProps) {
  const posts = useQuery(api.posts.list);

  if (posts === undefined) {
    return (
      <div className="flex flex-col">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b border-zinc-800 animate-pulse">
            <div className="flex gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-zinc-800"></div>
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <div className="h-4 w-24 bg-zinc-800 rounded"></div>
                  <div className="h-4 w-16 bg-zinc-800 rounded"></div>
                </div>
                <div className="h-4 w-full bg-zinc-800 rounded"></div>
                <div className="h-4 w-3/4 bg-zinc-800 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block p-6 rounded-full bg-zinc-900 mb-4">
          <svg className="w-12 h-12 text-zinc-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome to X</h2>
        <p className="text-zinc-500 mb-4">
          This is the best place to see what's happening in your world. Start posting!
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-800">
      {posts.map((post: PostData, index: number) => (
        <Post
          key={post._id}
          post={post}
          isOwner={currentUserId === post.authorId}
          index={index}
        />
      ))}
    </div>
  );
}
