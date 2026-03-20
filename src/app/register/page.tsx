'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Registration failed')
      setLoading(false)
      return
    }

    await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    router.push('/book')
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1A4D35]">
              <span className="text-lg font-black text-white">T</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-[#1A4D35] uppercase tracking-tight">Create an account</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">TOR Physiotherapy</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full name" id="name" value={form.name} onChange={set('name')} placeholder="Jane Smith" required />
          <Input label="Email address" id="email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required autoComplete="email" />
          <Input label="Phone number" id="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="07700 900 123" />
          <Input label="Password" id="password" type="password" value={form.password} onChange={set('password')} placeholder="Minimum 8 characters" required autoComplete="new-password" />
          <Input label="Confirm password" id="confirm" type="password" value={form.confirm} onChange={set('confirm')} placeholder="••••••••" required autoComplete="new-password" />

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
