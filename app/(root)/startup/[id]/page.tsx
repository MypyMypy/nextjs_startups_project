import { sanityApi } from "@/sanity/lib/queries";
import { Startup } from "@/src/pages/startup";
import { redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params?: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const id = (await params)?.id;

  const [post, editorPosts] = await Promise.all([
    sanityApi.useStartupByIdQuery({ params: { id: id! } }, { skip: !id }),
    sanityApi.usePlaylistBySomethingQuery({
      params: { slug: "editor-picks" },
    }),
  ]);

  if (!id || id === "undefined") redirect("/");

  return (
    <Startup
      post={{
        ...post,
        createdAt: post._createdAt,
        id: post._id,
        author: {
          _id: post.author._id,
          image: post.author?.image ?? "",
          name: post.author?.name ?? "",
          username: post.author?.username ?? "",
        },
        category: post?.category ?? "",
        description: post?.description ?? "",
        image: post?.image ?? "",
        pitch: post?.pitch ?? "",
        title: post?.title ?? "",
      }}
      editorPosts={editorPosts?.select || []}
    />
  );
}
