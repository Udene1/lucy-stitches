"use client"

import { useState, useEffect } from 'react'
import {
    ArrowLeft,
    Scissors,
    Filter,
    Search,
    ExternalLink,
    Loader2,
    Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const categories = ['All', 'Agbada', 'Kaftan', 'Gown', 'Suit', 'Traditional']

export default function PortfolioPage() {
    const supabase = createClient()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('All')
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function fetchPortfolio() {
            setLoading(true)
            let query = supabase.from('portfolio').select('*')

            if (activeCategory !== 'All') {
                query = query.eq('category', activeCategory)
            }

            if (search) {
                query = query.ilike('title', `%${search}%`)
            }

            const { data } = await query.order('created_at', { ascending: false })
            if (data) setItems(data)
            setLoading(false)
        }

        fetchPortfolio()
    }, [activeCategory, search, supabase])

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="p-2 border border-gray-100 rounded-xl group-hover:bg-gray-50 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest text-gray-400">Back Home</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-emerald rounded-xl">
                            <Scissors className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">Showcase</span>
                    </div>

                    <div className="w-24 hidden md:block" />
                </div>
            </nav>

            {/* Hero Head */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase mb-6">
                        The <span className="text-brand-emerald">Mastery</span> Gallery
                    </h1>
                    <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
                        A curated collection of our finest work. From traditional Nigerian attire
                        to contemporary luxury fashion.
                    </p>

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search styles..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald transition-all font-bold text-gray-700"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                        activeCategory === cat
                                            ? "bg-brand-emerald text-white shadow-lg shadow-emerald-900/10"
                                            : "bg-slate-100 text-gray-400 hover:bg-slate-200"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <Loader2 className="w-10 h-10 animate-spin text-brand-emerald" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {items.map((item) => (
                                <div key={item.id} className="group cursor-pointer">
                                    <div className="relative aspect-[4/5] bg-white rounded-[3rem] overflow-hidden shadow-sm border border-gray-100 mb-6 transition-all group-hover:shadow-2xl group-hover:shadow-emerald-900/10 group-hover:-translate-y-2">
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                <ImageIcon className="w-12 h-12 text-gray-200" />
                                            </div>
                                        )}

                                        <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur text-[10px] font-black uppercase tracking-widest text-brand-emerald rounded-full">
                                            {item.category}
                                        </div>
                                    </div>

                                    <div className="px-4 flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-1 group-hover:text-brand-emerald transition-colors">{item.title}</h3>
                                            <p className="text-sm text-gray-500 font-medium line-clamp-2">{item.description}</p>
                                        </div>
                                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 hover:text-brand-emerald transition-all transform group-hover:rotate-12">
                                            <ExternalLink className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {items.length === 0 && (
                            <div className="py-40 text-center">
                                <ImageIcon className="w-20 h-20 text-gray-100 mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-gray-200 uppercase">Gallery coming soon</h3>
                                <p className="text-gray-400 font-medium">Check back later for new arrivals.</p>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Quick Footer */}
            <footer className="py-20 text-center">
                <div className="inline-flex items-center gap-3 text-brand-emerald font-black uppercase tracking-widest text-xs">
                    <Scissors className="w-4 h-4" />
                    Lucy Stitches • PHC Masterpieces
                </div>
            </footer>
        </div>
    )
}
