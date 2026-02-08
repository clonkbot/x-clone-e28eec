import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  posts: defineTable({
    content: v.string(),
    authorId: v.id("users"),
    authorName: v.string(),
    authorHandle: v.string(),
    likes: v.number(),
    reposts: v.number(),
    replies: v.number(),
    views: v.number(),
    createdAt: v.number(),
  }).index("by_created", ["createdAt"])
    .index("by_author", ["authorId"]),

  likes: defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
  }).index("by_post", ["postId"])
    .index("by_user_post", ["userId", "postId"]),

  reposts: defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
    createdAt: v.number(),
  }).index("by_post", ["postId"])
    .index("by_user_post", ["userId", "postId"]),

  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
    createdAt: v.number(),
  }).index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_both", ["followerId", "followingId"]),

  profiles: defineTable({
    userId: v.id("users"),
    displayName: v.string(),
    handle: v.string(),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    headerUrl: v.optional(v.string()),
    followersCount: v.number(),
    followingCount: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_handle", ["handle"]),
});
