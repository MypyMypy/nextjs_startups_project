"use client";

import { Avatar } from "@/src/shared/ui/Avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { BadgePlus, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Navbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="px-6 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex gap-6 justify-between items-center">
        <Link href={"/"}>
          <Image src="/logo.svg" alt="logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5">
          {session && session?.user ? (
            <>
              <Link
                className="flex gap-1 items-center transition-colors hover:text-primary"
                href={"/startup/create"}
              >
                <BadgePlus className="size-6" />
                <span className="max-sm:hidden">Create</span>
              </Link>
              <button
                className="flex gap-1 items-center transition-colors hover:text-primary"
                onClick={() => signOut()}
              >
                <LogOut className="size-6" />
                <span className="max-sm:hidden">Logout</span>
              </button>
              <Link
                className="flex gap-1 items-center transition-colors hover:text-primary"
                href={`/user/${session.id}`}
              >
                <span className="max-sm:text-xs">{session?.user?.name}</span>
                <Avatar className="size-10">
                  <AvatarImage
                    src={session.user?.image ?? undefined}
                    alt={session.user?.name ?? undefined}
                  />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <button onClick={() => signIn("github")}>
              <span>Login</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};
