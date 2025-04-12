import { LoadingSpinner } from '@/components/loading-spinner'
import { ROUTES } from '@/lib/constants'
import { Language } from '@/localization'
import { SignedIn, UserProfile } from '@clerk/nextjs'

type Params = Promise<{ lang: Language }>

export default async function Settings(props: { params: Params }) {
  const { lang } = await props.params

  return (
    <div className="flex min-h-full items-center justify-center">
      <SignedIn>
        <UserProfile
          path={ROUTES.DASHBOARD.SETTINGS(lang)}
          fallback={
            <LoadingSpinner
              size="lg"
              containerClassName="mt-6 sm:mt-12 md:mt-16 lg:mt-24 xl:mt-32"
            />
          }
        />
      </SignedIn>
    </div>
  )
}
