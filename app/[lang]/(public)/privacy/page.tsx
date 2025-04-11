import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'

type Params = Promise<{ lang: Language }>

export default async function Privacy(props: { params: Params }) {
  const { lang } = await props.params
  const {
    public: { confidentialityPolicy: dict }
  } = await getDictionary(lang)

  return (
    <section className="px-4 py-12">
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold md:text-4xl">{dict.title}</h1>
        <p className="text-muted-foreground mb-12">{dict.introduction}</p>

        {/* Definition */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">
            {dict.definition.title}
          </h2>
          <p className="text-muted-foreground">{dict.definition.content}</p>
        </div>

        {/* Obligations */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">
            {dict.obligations.title}
          </h2>
          <p className="text-muted-foreground">{dict.obligations.content}</p>
        </div>

        {/* Access and Disclosure */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">
            {dict.accessDisclosure.title}
          </h2>
          <p className="text-muted-foreground">
            {dict.accessDisclosure.content}
          </p>
        </div>

        {/* Data Handling */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">
            {dict.dataHandling.title}
          </h2>
          <p className="text-muted-foreground">{dict.dataHandling.content}</p>
        </div>

        {/* Duration */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">{dict.duration.title}</h2>
          <p className="text-muted-foreground">{dict.duration.content}</p>
        </div>

        {/* User Responsibilities */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">
            {dict.userResponsibilities.title}
          </h2>
          <p className="text-muted-foreground">
            {dict.userResponsibilities.content}
          </p>
        </div>

        {/* Amendments */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">
            {dict.amendments.title}
          </h2>
          <p className="text-muted-foreground">{dict.amendments.content}</p>
        </div>

        {/* Contact */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">{dict.contact.title}</h2>
          <p className="text-muted-foreground">{dict.contact.content}</p>
        </div>
      </div>
    </section>
  )
}
