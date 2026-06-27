import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client.js'

export default function BlogDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api(`/api/blogs/slug/${encodeURIComponent(slug)}`)
        if (!cancelled) setPost(data.post)
      } catch (e) {
        if (!cancelled) setErr(e.message || 'Not found')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (err) {
    return (
      <div className="min-h-[50svh] bg-[#fffefb] px-5 py-10 pb-16">
        <p className="mx-auto mb-4 max-w-[520px] text-red-700">{err}</p>
        <div className="mx-auto max-w-[520px]">
          <Link to="/news" className="font-semibold text-amber-700">
            ← Back
          </Link>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-[50svh] bg-[#fffefb] px-5 py-10 pb-16">
        <p className="text-slate-600">Loading…</p>
      </div>
    )
  }

  return (
    <article className="min-h-[50svh] bg-[#fffefb] px-5 py-10 pb-16">
      <div className="mx-auto max-w-[680px] rounded-2xl border border-amber-200 bg-white p-8 pb-10">
        <Link to="/news" className="mb-4 inline-block text-sm font-medium text-amber-700 no-underline">
          ← All posts
        </Link>
        <h1 className="mb-2 text-[1.65rem] font-semibold leading-tight text-amber-950">
          {post.title}
        </h1>
        <p className="mb-5 text-sm text-stone-500">
          {post.authorName} ·{' '}
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString('en-IN', { dateStyle: 'long' })
            : ''}
        </p>
        {post.coverImageUrl ? (
          <div
            className="mb-5 h-[200px] rounded-xl bg-amber-100 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.coverImageUrl})` }}
            role="presentation"
          />
        ) : null}
        <div className="whitespace-pre-wrap text-base leading-relaxed text-stone-700">
          {post.content || post.excerpt}
        </div>
      </div>
    </article>
  )
}
