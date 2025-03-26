import { auth } from "@/auth/config";
import { sanityApi } from "@/sanity/lib/queries";
import { UserProfile } from "@/src/pages/user-profile";
import { notFound } from "next/navigation";
import React from "react";

interface PageProps {
  params?: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const sesssion = await auth();
  const id = (await params)?.id;

  const user = await sanityApi.useAuthorByIdQuery(
    { params: { id: id! } },
    { skip: !id }
  );

  if (!user) return notFound();

  return (
    <UserProfile
      isCurrentUser={sesssion?.id === id}
      paramsId={id}
      user={user}
    />
  );
}
