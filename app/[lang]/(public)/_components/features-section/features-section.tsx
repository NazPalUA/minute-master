import { ROUTES } from '@/lib/constants/routes'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import {
  BarChart2,
  Clock,
  FolderPlus,
  GitBranch,
  Settings,
  Smartphone
} from 'lucide-react'
import { FeatureCard } from './feature-card'

export async function FeaturesSection({ lang }: { lang: Language }) {
  const dict = (await getDictionary(lang)).public

  const features = [
    FolderPlus,
    Clock,
    BarChart2,
    GitBranch,
    Settings,
    Smartphone
  ].map((Icon, index) => ({
    icon: Icon,
    title: dict.home.features.items[index].title,
    description: dict.home.features.items[index].description
  }))

  return (
    <section id={ROUTES.HOME.FEATURES.ID} className="px-4 py-20">
      <div className="container mx-auto">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          {dict.home.features.title}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
