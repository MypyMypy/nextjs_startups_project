import Image from "next/image";
import { Author } from "@/sanity/types";
import { sanityApi } from "@/sanity/lib/queries";
import { StartupList } from "@/src/widgets";
import { Suspense } from "react";
import { StartupListSkeleton } from "@/src/widgets/StartupList/ui/StartupListSkeleton";

interface UserProfileProps {
  isCurrentUser: boolean;
  user: Author;
  paramsId?: string;
}

export const UserProfile: React.FC<UserProfileProps> = async ({
  user,
  isCurrentUser,
  paramsId,
}) => {
  const startups = await sanityApi.useStartupsByAuthorIdQuery(
    { params: { id: paramsId! } },
    { skip: !paramsId }
  );

  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black-uppercase text-center line-clamp-1">
              {user?.name}
            </h3>
          </div>
          <Image
            src={user?.image || ""}
            alt={user?.name || ""}
            width={220}
            height={220}
            className={"profile_image"}
          />
          <p className="text-30-extrabold mt-7 text-center">
            <span>@{user?.username}</span>
          </p>
          <p className="mt-1 text-center text-14-normal">{user.bio}</p>
        </div>
        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <p className="text-30-bold">
            {isCurrentUser ? "Your" : "All"} Startups
          </p>
          <Suspense fallback={<StartupListSkeleton />}>
            <StartupList posts={startups || []} />
          </Suspense>
        </div>
      </section>
    </>
  );
};
