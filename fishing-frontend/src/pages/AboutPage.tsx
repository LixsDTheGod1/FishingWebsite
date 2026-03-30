import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="rounded-2xl border border-white/10 bg-surface-800/40 p-8 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-white/60">За нас</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          За SD Fishing
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/70">
          SD Fishing е мястото за риболовни принадлежности, подбрани с внимание към детайла. Започнахме като
          малък екип от запалени риболовци и постепенно се превърнахме в магазин, който събира на едно място
          качествени въдици, макари, примамки и аксесоари за всеки стил риболов.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-surface-900/40 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white">Нашата история</h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              Всяка поръчка за нас е повече от доставка – тя е обещание, че ще получите надеждна екипировка,
              с която да изживеете следващото си риболовно приключение. Работим с доказани марки и добавяме
              нови продукти, само ако сами бихме ги взели край водата.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              Независимо дали търсите комплект за първия си излет или тънки подобрения по вече познат сетъп,
              при нас ще намерите подбрани предложения, актуални промоции и истински съвет от хора, които
              разбират от риболов.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-surface-900/40 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white">Защо да изберете нас?</h2>
            <div className="mt-6 grid gap-4">
              <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-turquoise/15 text-turquoise">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h13l3 5-2 6H6L3 7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2H8a2 2 0 00-2 2v2" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-white">Бърза доставка</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">
                    Изпращаме поръчките възможно най-бързо, за да сте готови за следващия излет.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-turquoise/15 text-turquoise">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3 7 7 .5-5.5 4.5L18 22l-6-3.5L6 22l1.5-8L2 9.5 9 9l3-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-white">Топ качество</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">
                    Подбираме продукти, на които може да разчитате – от ежедневни аксесоари до премиум такъми.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-turquoise/15 text-turquoise">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 00-12 0v7a3 3 0 003 3h6a3 3 0 003-3V8z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 11h-2v3h2" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-white">Експертна помощ</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">
                    Ако се колебаете, ще ви помогнем да изберете правилната екипировка спрямо водоема и стила.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-5 text-sm font-bold text-white shadow-lg shadow-brand-900/30 transition hover:bg-brand-500"
          >
            Към магазина
          </Link>
          <Link
            to="/blog"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-sky-400/40 bg-transparent px-5 text-sm font-bold text-sky-100 transition hover:border-sky-300/60 hover:bg-sky-500/10"
          >
            Прочети блога
          </Link>
        </div>
      </div>
    </div>
  )
}
