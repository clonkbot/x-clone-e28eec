import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return profile;
  },
});

export const createOrUpdate = mutation({
  args: {
    displayName: v.string(),
    handle: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        displayName: args.displayName,
        handle: args.handle,
        bio: args.bio,
      });
      return existingProfile._id;
    } else {
      return await ctx.db.insert("profiles", {
        userId,
        displayName: args.displayName,
        handle: args.handle,
        bio: args.bio,
        followersCount: 0,
        followingCount: 0,
        createdAt: Date.now(),
      });
    }
  },
});

export const ensureProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) return existingProfile;

    const randomNum = Math.floor(Math.random() * 10000);
    const handle = `user${randomNum}`;

    const profileId = await ctx.db.insert("profiles", {
      userId,
      displayName: `User ${randomNum}`,
      handle,
      followersCount: 0,
      followingCount: 0,
      createdAt: Date.now(),
    });

    return await ctx.db.get(profileId);
  },
});
