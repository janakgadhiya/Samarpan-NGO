import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import ImageUpload from '../components/ImageUpload.jsx'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState('')

  useEffect(() => {
    if (!user) return
    setName(user.name || '')
    setPhone(user.phone || '')
    setProfileImageUrl(user.profileImageUrl || '')
  }, [user])

  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setErr('')
    setMsg('')
    setBusy(true)
    try {
      await updateProfile({ name, phone, profileImageUrl })
      setMsg('Profile updated.')
    } catch (ex) {
      setErr(ex.message || 'Could not save')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-slate-50 px-5 py-10 pb-16">
      <div className="mx-auto max-w-[480px] rounded-2xl border border-slate-200 bg-white p-8 pb-9">
        <h1 className="mb-1 text-2xl font-semibold text-emerald-950">Your profile</h1>
        <p className="mb-5 text-sm text-slate-500">
          Update how you appear in the portal and on receipts.
        </p>

        <form onSubmit={onSubmit}>
          {err ? (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-800">{err}</p>
          ) : null}
          {msg ? (
            <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900">
              {msg}
            </p>
          ) : null}

          <label className="mb-4 block text-sm font-semibold text-slate-700">
            Email
            <input
              value={user?.email || ''}
              disabled
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-2 text-base text-slate-500"
            />
          </label>

          <label className="mb-4 block text-sm font-semibold text-slate-700">
            Display name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-base"
            />
          </label>

          <label className="mb-4 block text-sm font-semibold text-slate-700">
            Phone
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-base"
            />
          </label>

          <div className="mb-4 block text-sm font-semibold text-slate-700">
            Profile Image
            <div className="mt-1.5">
              <ImageUpload
                currentImageUrl={profileImageUrl}
                onUploadComplete={(url) => setProfileImageUrl(url)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="mt-2 cursor-pointer rounded-[10px] border-none bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-65"
          >
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
