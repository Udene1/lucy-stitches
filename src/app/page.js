"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Scissors,
    Search,
    ArrowRight,
    Star,
    ChevronRight,
    Instagram,
    Phone,
    CheckCircle2,
    Sparkles,
    Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

const services = [
    {
        title: 'Classics & Office',
        desc: 'Sophisticated blazers, corporate gowns, and timeless office ensembles for the modern woman.',
        icon: Scissors,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        id: 'bespoke'
    },
    {
        title: 'Bridal & Occasions',
        desc: 'Exquisite gowns and traditional wear for your most memorable celebrations.',
        icon: Sparkles,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        id: 'bridal'
    },
    {
        title: 'AI Design Suggestions',
        desc: 'Visualize your dream outfit with our integrated fashion AI generator.',
        icon: Zap,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        id: 'ai-design'
    }
]

export default function LandingPage() {
    const router = useRouter()
    const [orderId, setOrderId] = useState('')
    const [isSearching, setIsSearching] = useState(false)

    const handleTrackOrder = (e) => {
        e.preventDefault()
        if (!orderId.trim()) return
        setIsSearching(true)
        router.push(`/order/${orderId.trim()}`)
    }

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-brand-emerald selection:text-white scroll-smooth">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/')}>
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-emerald-900/10 group-hover:scale-110 transition-transform bg-white">
                            <img src="/logo.png" alt="Lucy Stitches" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">Lucy Stitches</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#services" className="text-sm font-bold text-gray-500 hover:text-brand-emerald transition-colors">Services</Link>
                        <Link href="/portfolio" className="text-sm font-bold text-gray-500 hover:text-brand-emerald transition-colors">Portfolio</Link>
                        <Link
                            href="/login"
                            className="px-6 py-2.5 bg-gray-50 text-gray-900 font-bold rounded-xl text-sm hover:bg-gray-100 transition-all border border-gray-200"
                        >
                            Admin Login
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 md:pt-60 md:pb-40 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-emerald/5 -skew-x-12 -mr-20 z-0 hidden lg:block" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-brand-emerald text-xs font-black uppercase tracking-widest rounded-full mb-6">
                            <Star className="w-3 h-3 fill-current" />
                            Premier Tailoring in Onitsha
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.9] tracking-tighter mb-8 uppercase">
                            Crafting <span className="text-brand-emerald italic">Elegance</span> <br />
                            In Every Stitch.
                        </h1>
                        <p className="text-xl text-gray-500 font-medium mb-12 max-w-xl leading-relaxed">
                            Experience the fusion of traditional craftsmanship and modern precision.
                            From bespoke Agbadas to contemporary suits, we bring your fashion visions to life.
                        </p>

                        {/* Order Tracking Bar */}
                        <div className="bg-white p-2 rounded-[2rem] shadow-2xl shadow-gray-200 border border-gray-100 flex flex-col md:flex-row items-center gap-2 max-w-xl">
                            <div className="flex-1 flex items-center px-6 gap-3 w-full">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Paste your Order ID to track..."
                                    className="w-full py-4 outline-none text-gray-900 font-bold bg-transparent"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleTrackOrder}
                                disabled={isSearching}
                                className="w-full md:w-auto px-10 py-4 bg-brand-emerald text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSearching ? 'Searching...' : 'Track Order'}
                                {!isSearching && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-32 bg-gray-50/50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="mb-20">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-emerald mb-4">Our Services</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">Excellence by Design</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((s, i) => (
                            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all group">
                                <div className={cn("p-5 rounded-2xl inline-flex mb-8 transition-transform group-hover:scale-110", s.bg)}>
                                    <s.icon className={cn("w-8 h-8", s.color)} />
                                </div>
                                <h4 className="text-2xl font-black text-gray-900 mb-4">{s.title}</h4>
                                <p className="text-gray-500 font-medium leading-relaxed mb-6">
                                    {s.desc}
                                </p>
                                <Link
                                    href={`#${s.id}`}
                                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-emerald cursor-pointer group-hover:gap-4 transition-all"
                                >
                                    Learn More <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Detailed Brand Sections */}
            <section id="bespoke" className="py-32 bg-white border-y border-gray-50">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-10">
                            <Scissors className="w-8 h-8 text-brand-emerald" />
                        </div>
                        <h3 className="text-5xl font-black text-gray-900 uppercase tracking-tighter mb-8 italic">Classics & <br /> Corporate Grace</h3>
                        <div className="space-y-6 text-gray-600 font-medium">
                            <p>Step into the boardroom with confidence. Our Classics & Office line is curated for the woman who demands elegance without compromising on professionalism.</p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-brand-emerald" />
                                    <span>Precision-tailored Blazers & Trousers.</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-brand-emerald" />
                                    <span>Elegant Corporate Gowns & Pencil Skirts.</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-brand-emerald" />
                                    <span>Bespoke Silk Blouses & Wrap Tops.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="aspect-square bg-emerald-50 rounded-[3rem] overflow-hidden relative">
                        <img src="/logo.png" alt="Corporate Grace" className="w-full h-full object-cover opacity-20 p-20 grayscale" />
                        <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-brand-emerald/10 uppercase tracking-widest -rotate-45">Power Dressing</div>
                    </div>
                </div>
            </section>

            <section id="bridal" className="py-32 bg-gray-50/30">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
                    <div className="order-2 md:order-1 aspect-[4/5] bg-amber-50 rounded-[3rem] overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center text-8xl font-black text-brand-gold/5 uppercase tracking-widest rotate-90">ROYALTY</div>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-10">
                            <Sparkles className="w-8 h-8 text-brand-gold" />
                        </div>
                        <h3 className="text-5xl font-black text-gray-900 uppercase tracking-tighter mb-8 italic">Bridal & <br /> Regal Wear</h3>
                        <div className="space-y-6 text-gray-600 font-medium">
                            <p>For life's most golden moments, we provide attire that radiates royalty. Every piece in our bridal collection is handcrafted with painstaking attention to detail, ensuring you are the centerpiece of your celebration.</p>
                            <p>We work closely with brides and celebrants to translate their dreams into exquisite silk, lace, and velvet realities. From traditional wedding guest ensembles to the most complex bridal gowns.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="ai-design" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10">
                        <Zap className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-5xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter mb-8 italic">Future of Fashion <br /> Powered by AI</h3>
                    <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-16">
                        Describe your dream outfit in plain words, and our integrated AI will generate a visualization.
                        No more guessing—see your designs before we even cut the fabric.
                    </p>
                    <div className="inline-flex flex-col items-center gap-4">
                        <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-xl max-w-md italic font-serif text-2xl text-gray-400">
                            "An elegant A-line gown in ivory silk with hand-stitched floral lace and a cathedral veil..."
                        </div>
                        <Link href="/portfolio" className="text-brand-emerald font-black uppercase tracking-widest text-sm hover:underline">
                            Explore Fashion Visions →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Portfolio CTA */}
            <section className="py-32 bg-brand-emerald text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/10 rounded-full -ml-32 -mb-32 blur-3xl" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
                        Ready to create something <span className="text-brand-gold italic">extraordinary?</span>
                    </h2>
                    <p className="text-xl text-emerald-100/70 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join hundreds of stylish clients who trust Lucy Stitches for their premium tailoring needs.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <Link
                            href="/portfolio"
                            className="px-12 py-5 bg-white text-brand-emerald font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-105 transition-all shadow-xl shadow-emerald-950/20"
                        >
                            View Showcase
                        </Link>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            className="flex items-center gap-3 px-8 py-5 border border-white/20 rounded-2xl hover:bg-white/10 transition-all font-black text-sm uppercase tracking-widest"
                        >
                            <Instagram className="w-5 h-5" />
                            Follow Instagram
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-1.5 bg-brand-emerald rounded-lg">
                                <Scissors className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-black tracking-tighter text-gray-900 uppercase">Lucy Stitches</span>
                        </div>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">© 2026 TailorPro Onitsha</p>
                    </div>

                    <div className="flex gap-10">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 text-center md:text-left">Headquarters</p>
                            <p className="text-sm font-bold text-gray-900">Onitsha, Anambra State,</p>
                            <p className="text-sm font-bold text-gray-900">Nigeria.</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 text-center md:text-left">Inquiries</p>
                            <p className="text-sm font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                                <Phone className="w-3 h-3 text-brand-emerald" />
                                +234 800 STITCHES
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
