import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Clock, ShieldCheck, CalendarCheck } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="bg-[#F7F6F2]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1A4D35]">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#133828] opacity-60" />
        <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-[#133828] opacity-50" />
        <div className="absolute top-10 right-1/3 h-40 w-40 rounded-full bg-[#2D6B4A] opacity-30" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28 lg:flex lg:items-center lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <p className="text-sm font-bold uppercase tracking-widest text-green-300 mb-4">
              Sports Massage &amp; Physiotherapy
            </p>
            <h1 className="text-5xl sm:text-6xl font-black text-white uppercase leading-none tracking-tight mb-2">
              TOR
            </h1>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase leading-none tracking-tight mb-6">
              PHYSIOTHERAPY
            </h2>
            <p className="text-green-200 text-lg max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              Expert sports massage and physiotherapy from a qualified, HCPC-registered practitioner. Book your appointment online — fast, easy, secure.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link href="/book">
                <Button size="lg" className="bg-white text-[#1A4D35] hover:bg-green-50 font-black uppercase tracking-wide shadow-lg px-8">
                  Book Now
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="ghost" className="text-white border border-white/30 hover:bg-white/10 uppercase tracking-wide">
                  Register
                </Button>
              </Link>
            </div>
          </div>

          {/* Founder card */}
          <div className="hidden lg:flex flex-col items-center gap-4 mt-12 lg:mt-0">
            <div className="relative h-52 w-52 rounded-full border-4 border-white/20 bg-[#133828] flex items-center justify-center overflow-hidden">
              <span className="text-5xl font-black text-white/20 uppercase">C</span>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-green-300">FOUNDER</p>
              <p className="text-xl font-black text-white uppercase">Callum</p>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-10 bg-[#F7F6F2] [clip-path:ellipse(60%_100%_at_50%_100%)]" />
      </section>

      {/* Qualifications */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Experience blob */}
            <div className="relative rounded-[2rem] bg-[#1A4D35] p-8 text-white text-center">
              <p className="text-xs font-black uppercase tracking-widest text-green-300 mb-3">EXPERIENCE</p>
              <p className="font-bold text-lg">Consett RFC</p>
              <p className="font-bold text-lg">Northumbria University Rugby</p>
              <p className="font-bold text-lg">Union + League</p>
              <p className="font-bold text-lg">Great North Run</p>
            </div>

            {/* Qualifications blob */}
            <div className="relative rounded-[2rem] bg-[#1A4D35] p-8 text-white text-center">
              <p className="text-xs font-black uppercase tracking-widest text-green-300 mb-3">QUALIFICATIONS</p>
              <p className="font-bold">BSc (Hons) Physiotherapy</p>
              <p className="font-bold">L4 Sports Massage</p>
              <p className="font-bold">Pre-Hospital Trauma Life Support</p>
              <p className="font-bold">FIFA Diploma in Football Medicine</p>
              <p className="text-sm text-green-300 mt-1">(In Progress)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-[#1A4D35] uppercase tracking-tight mb-12">
            Why TOR?
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Fully Qualified',
                desc: 'HCPC-registered physiotherapist with BSc (Hons) Physiotherapy and L4 Sports Massage certification.',
              },
              {
                icon: CalendarCheck,
                title: 'Online Booking',
                desc: 'Book your slot 24/7. Choose your date and time — appointments available Monday to Friday.',
              },
              {
                icon: Clock,
                title: '60-Min Sessions',
                desc: 'Full hour of focused, targeted treatment to reduce pain and get you back performing.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center p-6 rounded-2xl border-2 border-[#EBF5EF] bg-[#F7F6F2]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A4D35]">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-black text-[#1A4D35] uppercase tracking-tight mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service card */}
      <section className="py-16 bg-[#F7F6F2]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-[#1A4D35] uppercase tracking-tight mb-12">Our Service</h2>
          <div className="max-w-md mx-auto rounded-2xl bg-[#1A4D35] text-white overflow-hidden shadow-xl">
            <div className="p-8 text-center">
              <p className="text-xs font-black uppercase tracking-widest text-green-300 mb-2">Sports Massage</p>
              <p className="text-5xl font-black mb-1">£75</p>
              <p className="text-green-300 text-sm mb-6 flex items-center justify-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> 60 minutes
              </p>
              <p className="text-green-100 text-sm mb-8 leading-relaxed">
                Therapeutic massage targeting muscles used in sport and physical activity. Reduces tension, improves mobility, and aids recovery.
              </p>
              <Link href="/book" className="block">
                <Button className="w-full bg-white text-[#1A4D35] hover:bg-green-50 font-black uppercase tracking-wide" size="lg">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="py-16 bg-[#1A4D35] text-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-[#133828] opacity-60" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#133828] opacity-50" />
        <div className="relative mx-auto max-w-xl px-4">
          <p className="text-xs font-black uppercase tracking-widest text-green-300 mb-2">CONTACT</p>
          <p className="text-xl font-bold text-white mb-1">@torphysiotherapy</p>
          <p className="text-green-200 mb-8">torphysiotherapy@gmail.com</p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-[#1A4D35] hover:bg-green-50 font-black uppercase tracking-wide px-8">
              Create Account &amp; Book
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
