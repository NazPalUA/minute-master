import { ROUTES } from '@/lib/constants'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import {
  BarChart3,
  Clock,
  FolderTree,
  LayoutDashboard,
  LineChart,
  Settings2
} from 'lucide-react'
import { FeatureCard } from './feature-card'

export async function SectionFeatures({ lang }: { lang: Language }) {
  const {
    public: {
      home: { features: dict }
    }
  } = await getDictionary(lang)

  const featureIcons = [
    LineChart,
    FolderTree,
    BarChart3,
    Clock,
    Settings2,
    LayoutDashboard
  ]

  const features = dict.items.map((item, index) => ({
    icon: featureIcons[index],
    title: item.title,
    description: item.description
  }))

  return (
    <section
      id={ROUTES.HOME.FEATURES.ID}
      className="relative overflow-hidden px-4 py-24"
    >
      <div className="bg-grid-white/5 absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
      <div className="relative container mx-auto">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {dict.title}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon, title, description }) => (
            <FeatureCard
              key={title}
              icon={icon}
              title={title}
              description={description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
