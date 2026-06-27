import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'

export default function NewsBlogs() {
  const [posts, setPosts] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const data = await api('/api/blogs')
        setPosts(data.posts || [])
      } catch (e) {
        setErr(e.message || 'Could not load posts')
      }
    })()
  }, [])

  return (
    <div className="bg-[#fffefb] px-5 py-10 pb-16">
      <div className="mx-auto max-w-[960px]">
        <h1 className="mb-2 text-2xl font-semibold text-emerald-950">News &amp; blogs</h1>
        <p className="mb-7 text-slate-500">Field updates, opinion, and learning from our teams.</p>
        {err ? <p className="mb-4 text-red-700">{err}</p> : null}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          {posts.map((p) => (
            <Link
              key={p.id}
              to={`/news/${p.slug}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-amber-200 bg-white no-underline text-inherit shadow-[0_6px_20px_rgba(180,83,9,0.06)]"
            >
              {p.coverImageUrl ? (
                <div
                  className="h-[120px] bg-amber-100 bg-cover bg-center"
                  style={{ backgroundImage: `url(${p.coverImageUrl})` }}
                  role="presentation"
                />
              ) : null}
              <div className="p-4 pb-5">
                <h2 className="mb-2 text-[1.05rem] font-semibold text-amber-900">{p.title}</h2>
                <p className="mb-2.5 text-sm leading-normal text-stone-500">
                  {p.excerpt || 'Read the full story.'}
                </p>
                <span className="text-sm font-semibold text-amber-700">Read →</span>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && !err ? (
          <p className="mt-6 text-stone-500">No posts yet.</p>
        ) : null}
      </div>
    </div>
  )
}
