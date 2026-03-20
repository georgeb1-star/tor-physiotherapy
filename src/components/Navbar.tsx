'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === 'admin'

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-[#F7F6F2]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A4D35]">
            <span className="text-xs font-black text-white">T</span>
          </div>
          <div className="leading-none">
            <span className="font-black text-[#1A4D35] text-base tracking-tight uppercase">TOR</span>
            <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest -mt-0.5">Physiotherapy</span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {session ? (
            <>
              {isAdmin ? (
                <>
                  <Link href="/admin">
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>
                  <Link href="/admin/schedule">
                    <Button variant="ghost" size="sm">Schedule</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/book">
                    <Button variant="ghost" size="sm">Book</Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">My Bookings</Button>
                  </Link>
                </>
              )}
              <Button variant="secondary" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Book Now</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
