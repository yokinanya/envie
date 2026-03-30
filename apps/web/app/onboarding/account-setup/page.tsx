import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '../../auth/helpers';
import AccountSetupContent from './content';
import { env } from '../../env';
import { createTsrClient } from '../../tsr-server';

export default async function ProjectAndOrganizationPage({
  searchParams,
}: {
  searchParams: Promise<{ isFree?: string }>
}) {
  const { isFree } = await searchParams;
  const billingEnabled = env.BILLING_ENABLED;
  const isFreePlan = !billingEnabled || isFree === 'true';
  const user = await getAuthenticatedUser();
  if (!user) {
    return redirect('/onboarding');
  }
  
  const tsr = await createTsrClient() as any; // Build error in GitHub Actions
  
  const [userResponse, organizationsResponse] = await Promise.all([
    tsr.user.getUser(),
    tsr.organizations.getOrganizations({})
  ]);

  // Get user's personal organization for free plan users
  const personalOrgName = organizationsResponse.status === 200 && organizationsResponse.body[0]?.name 
    ? organizationsResponse.body[0].name 
    : null;

  const personalOrgNameToShow = isFreePlan ? personalOrgName : null;

  return <AccountSetupContent
    personalOrgName={personalOrgNameToShow}
    email={userResponse.status === 200 ? userResponse.body.email : null}
    isFree={isFreePlan}
    billingEnabled={billingEnabled}
  />;
}
