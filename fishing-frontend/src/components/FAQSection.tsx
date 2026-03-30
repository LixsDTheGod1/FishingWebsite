import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "Какви са сроковете за доставка?",
    answer: "Стандартната доставка за София е 1-2 работни дни, а за останалата част на страната - 2-4 работни дни. При поръчка над 200 лв. доставката е безплатна."
  },
  {
    question: "Как мога да върна продукт?",
    answer: "Можете да върнете продукт в рамките на 14 дни от получаването му. Продуктът трябва да е в оригинална опаковка и без следи от употреба. Свържете се с нас на support@sdfishing.bg за повече информация."
  },
  {
    question: "Гарантиран ли е качеството на продуктите?",
    answer: "Да, всички наши продукти са с гарантирано качество и оригинален произход. Предлагаме 24 месеца гаранция на всички електронни устройства и 12 месеца на въдици и макари."
  },
  {
    question: "Имате ли физически магазин?",
    answer: "Да, нашият физически магазин се намира на адрес ул. Витоша 15, София. Работим от понеделник до петък от 09:00 до 18:00 и в събота от 10:00 до 14:00."
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Често задавани въпроси
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Всичко, което трябва да знаете за нашите услуги
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="glass rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:glass-dark transition-colors duration-300"
              >
                <h3 className="text-lg font-semibold text-white">
                  {item.question}
                </h3>
                <svg
                  className={`h-5 w-5 text-turquoise transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-4">
                  <p className="text-white/70 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
