import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { HelpCircle } from 'lucide-react'

type Params = Promise<{ lang: Language }>

export default async function Support(props: { params: Params }) {
  const { lang } = await props.params
  const {
    public: { support: dict }
  } = await getDictionary(lang)

  return (
    <section className="px-4 py-12">
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold md:text-4xl">{dict.title}</h1>

        {/* FAQs */}
        <div className="rounded-lg border p-6 shadow-sm">
          <HelpCircle className="text-primary mb-4 h-8 w-8" />
          <h2 className="mb-3 text-xl font-semibold">{dict.faqs.title}</h2>
          <p className="text-muted-foreground mb-4">{dict.faqs.description}</p>
          <div className="space-y-2">
            {dict.faqs.questions.map((faq, index) => (
              <div key={index} className="bg-muted rounded-md p-3">
                <h3 className="font-medium">{faq.question}</h3>
                <p className="text-muted-foreground text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
