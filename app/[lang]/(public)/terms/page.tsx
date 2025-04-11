import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'

type Params = Promise<{ lang: Language }>

export default async function Terms(props: { params: Params }) {
  const { lang } = await props.params
  const {
    public: { termsOfUse: dict }
  } = await getDictionary(lang)

  return (
    <section className="px-4 py-12">
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold md:text-4xl">{dict.title}</h1>
        <p className="text-muted-foreground mb-12 text-sm">
          {dict.lastUpdated}
        </p>

        {/* Section 1 */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">{dict.section1.title}</h2>
          <p className="text-muted-foreground">{dict.section1.content}</p>
        </div>

        {/* Section 2 */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">{dict.section2.title}</h2>
          <p className="text-muted-foreground">{dict.section2.content}</p>
        </div>

        {/* Section 3 */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">{dict.section3.title}</h2>
          <p className="text-muted-foreground">{dict.section3.content}</p>
        </div>

        {/* Section 4 */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">{dict.section4.title}</h2>
          <p className="text-muted-foreground">{dict.section4.content}</p>
        </div>

        {/* Section 5 */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">{dict.section5.title}</h2>
          <p className="text-muted-foreground">{dict.section5.content}</p>
        </div>

        {/* Section 6 */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">{dict.section6.title}</h2>
          <p className="text-muted-foreground">{dict.section6.content}</p>
        </div>

        {/* Section 7 */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">{dict.section7.title}</h2>
          <p className="text-muted-foreground">{dict.section7.content}</p>
        </div>
      </div>
    </section>
  )
}
