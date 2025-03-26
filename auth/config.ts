import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { Author } from "@/sanity/types";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession, NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authConfig: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],

  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user: { name, image, id, email }, profile }) {
      const exitsingUser = await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
        id: id,
      });

      if (!exitsingUser) {
        await writeClient.create({
          _type: "author",
          id,
          name,
          username: email,
          image: image,
          bio: profile?.sub || "",
        });
      }

      return true;
    },
    async jwt({ user, token }) {
      if (token && token.sub) {
        const userData = (await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: token.sub,
        })) as Author;

        if (!user) {
          token.id = userData?._id;
        }
      }

      return token;
    },
    async session({ session, token }) {
      console.log("[config.ts - session token]", token);

      Object.assign(session, { id: token?.id });

      return session;
    },
  },
};

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authConfig);
}
