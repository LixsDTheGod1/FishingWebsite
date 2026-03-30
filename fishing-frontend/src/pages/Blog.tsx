import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchPublishedBlogPosts } from '../api/blogApi'
import type { BlogPostDTO } from '../api/types'
import { formatDate } from '../utils/format'

function excerptFromContent(content: string, max = 220): string {
  const decoded = (() => {
    if (!content.includes('&')) return content
    const el = document.createElement('textarea')
    el.innerHTML = content
    return el.value
  })()

  const plain = decoded.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (plain.length <= max) return plain
  return `${plain.slice(0, max).trim()}…`
}

export default function Blog() {
  const { t, i18n } = useTranslation()
  const [posts, setPosts] = useState<BlogPostDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchPublishedBlogPosts()
        if (!cancelled) {
          setPosts(data)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : 'Could not load blog posts. Is the API running?',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-display text-3xl font-bold text-white">{t('blog.title')}</h1>
      <p className="mt-2 text-slate-400">{t('blog.subtitle')}</p>

      {loading && (
        <p className="mt-10 text-slate-400" role="status">
          {t('blog.loading')}
        </p>
      )}
      {error && (
        <p className="mt-10 rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-red-200">
          {error}
        </p>
      )}
      {!loading && !error && posts.length === 0 && (
        <p className="mt-10 text-slate-400">
          {t('blog.no_posts')}{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">POST /api/Blog</code> (JWT
          {t('blog.jwt_required')}
        </p>
      )}

      {!loading && !error && posts.length > 0 && (
        <ul className="mt-10 space-y-6">
          {posts.map((post) => (
            <li key={post.id}>
              <article className="rounded-2xl border border-white/10 bg-surface-800/40 p-6 transition hover:border-brand-500/30">
                <time className="text-xs font-medium uppercase tracking-wider text-brand-400">
                  {formatDate(post.publishedAtUtc, i18n.language)}
                </time>
                <h2 className="mt-2 font-display text-xl font-semibold text-white">
                  <Link to={`/blog/${post.id}`} className="hover:text-brand-200">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {t('blog.by')} {post.authorName}
                </p>
                <p className="mt-2 leading-relaxed text-slate-400">
                  {excerptFromContent(post.content)}
                </p>
                <Link to={`/blog/${post.id}`} className="mt-4 inline-block text-sm font-medium text-brand-300">
                  {t('blog.read_more')}
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
