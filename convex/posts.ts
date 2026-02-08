import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_created")
      .order("desc")
      .take(50);

    const userId = await getAuthUserId(ctx);

    const postsWithLikeStatus = await Promise.all(
      posts.map(async (post) => {
        let isLiked = false;
        let isReposted = false;

        if (userId) {
          const like = await ctx.db
            .query("likes")
            .withIndex("by_user_post", (q) => q.eq("userId", userId).eq("postId", post._id))
            .first();
          isLiked = !!like;

          const repost = await ctx.db
            .query("reposts")
            .withIndex("by_user_post", (q) => q.eq("userId", userId).eq("postId", post._id))
            .first();
          isReposted = !!repost;
        }

        return { ...post, isLiked, isReposted };
      })
    );

    return postsWithLikeStatus;
  },
});

export const create = mutation({
  args: { content: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const authorName = profile?.displayName || "Anonymous";
    const authorHandle = profile?.handle || `user_${userId.slice(-8)}`;

    return await ctx.db.insert("posts", {
      content: args.content,
      authorId: userId,
      authorName,
      authorHandle,
      likes: 0,
      reposts: 0,
      replies: 0,
      views: Math.floor(Math.random() * 100) + 1,
      createdAt: Date.now(),
    });
  },
});

export const like = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_user_post", (q) => q.eq("userId", userId).eq("postId", args.postId))
      .first();

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.postId, { likes: Math.max(0, post.likes - 1) });
    } else {
      await ctx.db.insert("likes", { postId: args.postId, userId });
      await ctx.db.patch(args.postId, { likes: post.likes + 1 });
    }
  },
});

export const repost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingRepost = await ctx.db
      .query("reposts")
      .withIndex("by_user_post", (q) => q.eq("userId", userId).eq("postId", args.postId))
      .first();

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    if (existingRepost) {
      await ctx.db.delete(existingRepost._id);
      await ctx.db.patch(args.postId, { reposts: Math.max(0, post.reposts - 1) });
    } else {
      await ctx.db.insert("reposts", { postId: args.postId, userId, createdAt: Date.now() });
      await ctx.db.patch(args.postId, { reposts: post.reposts + 1 });
    }
  },
});

export const remove = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId) throw new Error("Not authorized");

    await ctx.db.delete(args.postId);
  },
});
