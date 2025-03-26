"use server";

import { auth } from "@/auth/config";
import { parseServerActionRespose } from "@/src/shared/lib/utils";
import sligify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { StartupFormDataI } from "../ui/StartupForm.types";
import { Startup } from "@/sanity/types";

export const createPitch = async (
  state: StartupFormDataI,
  form: FormData,
  pitch: string
): Promise<Startup & { error: string; status: string }> => {
  const session = await auth();

  if (!session)
    return parseServerActionRespose({
      error: "Not signed in",
      status: "ERROR",
    });

  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch")
  );
  const slug = sligify(title as string, { lower: true, strict: true });

  try {
    const startup = {
      title,
      description,
      category,
      image: link,
      pitch,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
    };

    const result = (await writeClient.create({
      _type: "startup",
      ...startup,
    })) as Startup;

    return parseServerActionRespose({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);

    return parseServerActionRespose({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};
