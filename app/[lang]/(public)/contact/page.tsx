import { env } from '@/env'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { Mail, MessageSquare } from 'lucide-react'

type Params = Promise<{ lang: Language }>

export default async function Contact(props: { params: Params }) {
  const { lang } = await props.params
  const {
    public: { contact: dict }
  } = await getDictionary(lang)

  const supportEmail = env.NEXT_PUBLIC_SUPPORT_EMAIL

  return (
    <section className="px-4 py-12">
      <div className="container mx-auto">
        <h1 className="mb-8 text-3xl font-bold md:text-4xl">{dict.title}</h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Information */}
          <div className="rounded-lg border p-6 shadow-sm">
            <Mail className="text-primary mb-4 h-8 w-8" />
            <h2 className="mb-3 text-xl font-semibold">
              {dict.emailSection.title}
            </h2>
            <p className="text-muted-foreground mb-4">
              {dict.emailSection.description}
            </p>

            <div className="bg-muted mt-6 rounded-md p-4">
              <h3 className="mb-2 font-medium">
                {dict.emailSection.contactEmailTitle}
              </h3>
              <a
                href={`mailto:${supportEmail}`}
                className="text-primary hover:underline"
              >
                {supportEmail}
              </a>
            </div>
          </div>

          {/* Contact Tips */}
          <div className="rounded-lg border p-6 shadow-sm">
            <MessageSquare className="text-primary mb-4 h-8 w-8" />
            <h2 className="mb-3 text-xl font-semibold">
              {dict.tipsSection.title}
            </h2>
            <p className="text-muted-foreground mb-4">
              {dict.tipsSection.description}
            </p>

            <ul className="space-y-3">
              {dict.tipsSection.tips.map((tip, index) => (
                <li key={index} className="bg-muted rounded-md p-3">
                  <h3 className="font-medium">{tip.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {tip.description}
                  </p>
                </li>
              ))}
            </ul>

            <div className="bg-secondary/50 mt-6 rounded-md p-4">
              <p className="text-sm">
                <strong>{dict.tipsSection.formNote.title}:</strong>{' '}
                {dict.tipsSection.formNote.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
