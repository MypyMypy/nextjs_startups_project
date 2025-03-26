import { auth } from "@/auth/config";
import { StartupForm } from "@/src/widgets";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (!session) redirect("/");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Submit Your StartUp</h1>
      </section>

      <StartupForm />
    </>
  );
}
