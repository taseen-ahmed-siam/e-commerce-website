import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type Props = {
  faqs: { q: string; a: string }[]
}

export function ProductFaqs({ faqs }: Props) {
  return (
    <section className="border-t border-border pt-12 lg:pt-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-accent mb-2">Q & A</div>
          <h2 className="font-serif text-3xl md:text-4xl text-balance">Frequently asked questions</h2>
        </div>
        <div className="md:col-span-2">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
