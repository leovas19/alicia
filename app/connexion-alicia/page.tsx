import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function AliciaLoginPage() {
  await ensureSeedData();
  const sessionUser = await getSessionUser();
  if (sessionUser) {
    const user = await prisma.aliciaUser.findUnique({
      where: {
        username: sessionUser
      }
    });

    redirect(user?.barsInitialized ? "/confiance" : "/alicia/barres");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center pb-4 pt-6">
      <LoginForm />
    </div>
  );
}
