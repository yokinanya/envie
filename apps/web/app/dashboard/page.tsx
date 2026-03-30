import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "../auth/helpers";
import Dashboard from "./content";
import { env } from "../env";
import { createTsrClient } from "../tsr-server";

export default async function DashboardPage() {
  const user = await getAuthenticatedUser()
  if(!user) {
    return redirect('/onboarding');
  }

  const tsr = await createTsrClient() as any; // Build error in GitHub Actions
  const userData = await tsr.user.getUser()
  if(userData.status !== 200) {
    return redirect('/onboarding');
  }
  return <Dashboard user={userData.body} billingEnabled={env.BILLING_ENABLED} />;
}
