import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'

export async function ActionButtons({ lang }: { lang: Language }) {
  const {
    public: {
      home: { hero: dict }
    }
  } = await getDictionary(lang)

  return (
    <div className="flex flex-col justify-center gap-4 sm:flex-row">
      <Button
        size="lg"
        className="group from-primary hover:shadow-primary/25 relative overflow-hidden bg-gradient-to-r to-blue-600   transition-all duration-300 hover:shadow-md"
        asChild
      >
        <Link href={ROUTES.DASHBOARD.INDEX(lang)}>
          <span className="relative z-10 flex items-center">
            {dict.tryForFree}
            <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <span className="to-primary absolute inset-0 -z-10 bg-gradient-to-r from-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
        </Link>
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="group border-input hover:border-primary hover:text-primary flex items-center border   transition-all duration-300"
      >
        <span className="bg-primary/10 text-primary mr-2 flex size-5 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
          <Play className="fill-primary size-3" />
        </span>
        {dict.watchDemo}
      </Button>
    </div>
  )
}
