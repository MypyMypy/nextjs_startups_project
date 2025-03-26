import { formatDate } from "@/src/shared/lib";
import Image from "next/image";
import Link from "next/link";
import markdownit from "markdown-it";
import { Suspense } from "react";
import { Skeleton } from "@/src/shared/ui/Skeleton";
import { Views } from "@/src/features";
import { PostI, sanityApi } from "@/sanity/lib/queries";
import { StartupList } from "@/src/widgets";

interface StartupProps {
  post: {
    id: string;
    createdAt: string;
    title: string;
    description: string;
    image: string;
    author: {
      _id: string;
      image: string;
      name: string;
      username: string;
    };
    category: string;
    pitch: string;
  };
  editorPosts?: PostI[];
}

export const Startup: React.FC<StartupProps> = async ({
  post,
  editorPosts,
}) => {
  const md = markdownit();
  const mdContent = md.render(post.pitch);

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post.createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>
      <section className="section_container">
        <div className="space-y-5 mt-10 xax-w-4xl mx-auto">
          {/* <div className="flex flex-wrap justify-start items-end gap-6"> */}
          <div className="grid grid-cols-1 sm:grid-cols-[320px_1fr] gap-6">
            <div className="flex-[1_1_auto] max-w-full h-auto sm:flex-[0_1_320px]">
              <img
                className="max-w-full h-auto rounded-xl w-full"
                src={post.image}
                alt="Post image"
              />
            </div>
            <div className="flex-[1_1_auto]  flex-between gap-5">
              <Link
                href={`/user/${post.author?._id}`}
                className="flex gap-2 items-center mb-3"
              >
                <Image
                  src={post.author.image}
                  alt="avatar"
                  width={64}
                  height={64}
                  className={"rounded-full drop-shadow-lg"}
                />
                <div>
                  <p className="text-20-medium">{post.author.name}</p>
                  <p className="text-16-medium !text-black-300">
                    @{post.author.username}
                  </p>
                </div>
              </Link>
              <p className="category-tag">{post.category}</p>
            </div>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {mdContent ? (
            <article
              className="prose max-w-4xl font-ysabeau"
              dangerouslySetInnerHTML={{ __html: mdContent }}
            ></article>
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>
        <hr className="divider" />
        {/* TODO */}
      </section>
      <hr className="divider" />

      {editorPosts && editorPosts?.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <p className="text-30-semibold">Editor Picks</p>
          <StartupList posts={editorPosts} />
        </div>
      )}

      <Suspense fallback={<Skeleton className="view_skeleton" />}>
        {/* <Views id={post.id} /> */}
      </Suspense>
    </>
  );
};
