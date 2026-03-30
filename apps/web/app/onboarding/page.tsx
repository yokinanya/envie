import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@repo/ui/button';
import { env } from '../env';

export default function NewUserPage() {
  const billingEnabled = env.BILLING_ENABLED;
  const githubOnboardingUrl = `${env.NEXT_PUBLIC_API_URL}/auth/github?onboarding=free`;

  if (!billingEnabled) {
    return (
      <div>
        <main className="flex flex-col items-center justify-start h-full overflow-hidden">
          <div
            className="relative flex min-h-[217px] w-full items-center justify-center py-12"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(156, 163, 175, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(156, 163, 175, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px'
            }}
          >
            <div className="relative px-4 text-center">
              <h1 className="mb-2 text-2xl font-bold md:text-3xl">
                Continue to your self-hosted instance
              </h1>
              <p className="text-sm text-neutral-400">
                Billing is disabled for this deployment. All collaboration features are available.
              </p>
            </div>
          </div>

          <div className="mt-12 w-full max-w-2xl px-6">
            <div className="rounded-lg border border-white/15 bg-white/[.03] p-6">
              <div className="space-y-4">
                {[
                  'Unlimited organizations',
                  'Unlimited team members',
                  'Unlimited projects and environments',
                  'Role-based collaboration'
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-neutral-200">
                    <Check className="h-4 w-4 text-accent-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Link href={githubOnboardingUrl}>
                  <Button variant="regular" className="min-w-[220px]">
                    Continue with GitHub
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <footer className="p-2 text-center text-[10px] font-medium text-neutral-600">
          © {new Date().getFullYear()} envie
        </footer>
      </div>
    );
  }

  const features = [
    {
      name: 'Price',
      free: "Free forever",
      team: "Starting at $5 per month"
    },
    {
      name: 'Unlimited environments',
      free: true,
      team: true
    },
    {
      name: 'Unlimited projects',
      free: true,
      team: true
    },
    {
      name: 'Version control',
      free: true,
      team: true
    },
    {
      name: 'Organizations',
      free: '1 for personal use',
      team: 'Create up to 3 custom team organizations'
    },
    {
      name: 'Invite team members',
      free: false,
      team: true
    },
    {
      name: 'First access to new features',
      free: false,
      team: true
    }
  ];

  return (
    <div >
      <main className="flex flex-col items-center justify-start h-full overflow-hidden">
        <div className="relative w-full py-12 mb-8 min-h-[217px] flex items-center justify-center"
             style={{
               backgroundImage: `
                 linear-gradient(to right, rgba(156, 163, 175, 0.08) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(156, 163, 175, 0.08) 1px, transparent 1px)
               `,
               backgroundSize: '24px 24px'
             }}
        >
          <div className="relative text-center px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              How do you want to use envie?
            </h1>
            <p className="text-neutral-400 text-sm">
              Select the plan that best fits your needs
            </p>
          </div>
        </div>
        
        <div className="w-full max-w-6xl md:px-4 px-12 mt-12">
          <div className="w-full max-w-4xl mx-auto">
            
            {/* Three column layout: Features | Free | Team */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr]">
              {/* Feature column - just text on background */}
              <div className="hidden md:block">
                <div className="pt-[56px]">
                  {features.map((feature, index) => (
                    <div key={index}>
                      <div className="text-sm text-neutral-300 h-[47px] flex items-center justify-end pr-4 mt-[0px]">
                        {feature.name}
                      </div>
                      {index !== features.length - 1 && (
                        <div className="h-[1px] bg-gradient-to-r from-transparent to-accent-800" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Plans section */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Free Plan */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden relative pb-20">
                <div className="p-4 bg-neutral-800">
                  <div className="text-sm font-medium text-neutral-300 text-center">Free</div>
                </div>
                <div className="divide-y divide-neutral-800">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center md:justify-center justify-between p-4 h-[48px]">
                      <div className="text-xs text-neutral-400 md:hidden">{feature.name}</div>
                      <div className="">
                        {typeof feature.free === 'boolean' ? (
                          feature.free ? (
                            <Check className="w-4 h-4 text-accent-400" />
                          ) : (
                            <X className="w-4 h-4 text-neutral-600" />
                          )
                        ) : (
                          <span className="text-xs text-neutral-400 text-center">{feature.free}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center">
                  <Link href={githubOnboardingUrl}>
                    <Button variant="regular" className="min-w-[180px]">
                      Continue with Free Plan
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Team Plan */}
              <div className="bg-white/[.03] border border-white/20 rounded-lg overflow-hidden relative pb-20">
                <div className="p-4 bg-white/[.08]">
                  <div className="text-sm font-medium text-foreground text-center">Team</div>
                </div>
                <div className="divide-y divide-white/10">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center md:justify-center justify-between p-4 h-[48px]">
                      <div className="text-xs text-neutral-400 md:hidden">{feature.name}</div>
                      <div className="">
                        {typeof feature.team === 'boolean' ? (
                          feature.team ? (
                            <Check className="w-4 h-4 text-accent-400" />
                          ) : (
                            <X className="w-4 h-4 text-neutral-600" />
                          )
                        ) : (
                          <span className="text-xs text-center">{feature.team}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center">
                  <Link href={`${env.NEXT_PUBLIC_API_URL}/auth/github?onboarding=team`}>
                    <Button variant="regular" className="min-w-[180px] bg-white/[.08] hover:bg-white/[.12] border-white/20">
                      Continue with Team Plan
                    </Button>
                  </Link>
                </div>
              </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <footer className="p-2 text-[10px] text-neutral-600 text-center font-medium">
        © {new Date().getFullYear()} envie
      </footer>
    </div>
  );
}
