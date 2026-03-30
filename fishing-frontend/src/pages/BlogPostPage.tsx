import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchBlogPostById } from '../api/blogApi'
import type { BlogPostDTO } from '../api/types'
import { formatDate } from '../utils/format'

function extractFirstImageSrc(html: string): string | null {
  const match = html.match(/<img[^>]*\ssrc=["']([^"']+)["'][^>]*>/i)
  return match?.[1] ?? null
}

function removeFirstImageTag(html: string): string {
  return html.replace(/<img[^>]*>/i, '')
}

function decorateImages(html: string): string {
  const base = html.replace(/<img\s/gi, '<img loading="lazy" referrerpolicy="no-referrer" ')
  return base.replace(/https:\/\/source\.unsplash\.com\/([A-Za-z0-9_-]+)\/[^"'\s]+/g, (_m, id) => {
    return `https://unsplash.com/photos/${id}/download?force=true`
  })
}

function decodeHtmlEntities(html: string): string {
  if (!html.includes('&')) return html
  const el = document.createElement('textarea')
  el.innerHTML = html
  return el.value
}

export default function BlogPostPage() {
  const { id } = useParams()
  const postId = Number(id)
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const [post, setPost] = useState<BlogPostDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isFinite(postId)) {
      setLoading(false)
      setError(t('blog.post_invalid_id'))
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchBlogPostById(postId)
        if (cancelled) return
        if (!data) {
          setPost(null)
          setError(null)
          return
        }
        setPost(data)
        setError(null)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : t('common.error_blog'))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [postId, t])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <p className="text-slate-400" role="status">
          {t('blog.post_loading')}
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <p className="rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-red-200">{error}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 text-brand-400 hover:text-brand-300"
        >
          {t('product.back')}
        </button>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <h1 className="font-display text-2xl font-bold text-white">{t('blog.post_not_found')}</h1>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 text-brand-400 hover:text-brand-300"
        >
          {t('product.back')}
        </button>
      </div>
    )
  }

  const decoded = decodeHtmlEntities(post.content)
  const heroImage = extractFirstImageSrc(decoded)
  const bodyHtml = decorateImages(removeFirstImageTag(decoded))

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav className="text-sm text-slate-500">
        <Link to="/" className="hover:text-brand-300">
          {t('nav.home')}
        </Link>
        <span className="mx-2">/</span>
        <Link to="/blog" className="hover:text-brand-300">
          {t('blog.title')}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{post.title}</span>
      </nav>

      <article className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-surface-800/40">
        {heroImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <img
              src={heroImage}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-900/90 via-surface-900/20 to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <time className="text-xs font-medium uppercase tracking-wider text-brand-400">
            {formatDate(post.publishedAtUtc, i18n.language)}
          </time>
          <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">{post.title}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {t('blog.by')} {post.authorName}
          </p>

          <div
            className="prose prose-invert mt-8 max-w-none prose-headings:font-display prose-headings:text-white prose-a:text-brand-300 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </div>
      </article>
    </div>
  )
}
