import { sanityApi } from "@/sanity/lib/queries";
import { ViewProps } from "./Views.props";
import { Ping } from "@/src/shared/ui/Ping";
import { after } from "next/server";

import { writeClient } from "@/sanity/lib/write-client";

export const Views: React.FC<ViewProps> = async ({ id }) => {
  const totalViews = await sanityApi.useStartupViewsByIdQuery(
    { params: { id: id! } },
    { skip: !id }
  );

  after(async () => {
    if (totalViews?.views !== undefined) {
      await writeClient
        .patch(id)
        .set({ views: totalViews.views + 1 })
        .commit();
    }
  });

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        <span className="font-black">Views: {totalViews?.views || 0}</span>
      </p>
    </div>
  );
};
