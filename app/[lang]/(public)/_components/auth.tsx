import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export async function Auth({ lang }: { lang: Language }) {
  const { public: dict } = await getDictionary(lang)

  return (
    <>
      <SignedOut>
        <SignInButton
          mode="modal"
          forceRedirectUrl={ROUTES.DASHBOARD.INDEX(lang)}
          signUpForceRedirectUrl={ROUTES.DASHBOARD.INDEX(lang)}
        >
          <Button size="sm" className="w-full md:w-auto">
            {dict.layout.header.login}
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  )
}
