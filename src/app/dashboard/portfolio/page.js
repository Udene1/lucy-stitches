"use client"

import { useState, useEffect } from 'react'
import {
    Scissors,
    Plus,
    Trash2,
    Image as ImageIcon,
    Loader2,
    CheckCircle2,
    X,
    Star
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

export default function AdminPortfolioPage() {
    const supabase = createClient()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Agbada',
        featured: false,
        image_url: ''
    })

    useEffect(() => {
        fetchPortfolio()
    }, [])

    async function fetchPortfolio() {
        setLoading(true)
        const { data } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false })
        if (data) setItems(data)
        setLoading(false)
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `portfolio/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('designs') // Reusing designs bucket or we'd create 'portfolio'
            .upload(filePath, file)

        if (uploadError) {
            toast.error('Upload failed')
            setUploading(false)
            return
        }

        const { data: { publicUrl } } = supabase.storage
            .from('designs')
            .getPublicUrl(filePath)

        setFormData({ ...formData, image_url: publicUrl })
        setUploading(false)
        toast.success('Image ready!')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.image_url) return toast.error('Upload an image first')

        const { error } = await supabase.from('portfolio').insert([formData])
        if (error) {
            toast.error(error.message)
        } else {
            toast.success('Added to Showcase!')
            setIsAdding(false)
            setFormData({ title: '', description: '', category: 'Agbada', featured: false, image_url: '' })
            fetchPortfolio()
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure? This will remove it from the public gallery.')) return
        const { error } = await supabase.from('portfolio').delete().eq('id', id)
        if (error) toast.error(error.message)
        else {
            toast.success('Removed')
            fetchPortfolio()
        }
    }

    const toggleFeatured = async (item) => {
        const { error } = await supabase
            .from('portfolio')
            .update({ featured: !item.featured })
            .eq('id', item.id)

        if (error) toast.error(error.message)
        else fetchPortfolio()
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Portfolio Manager</h1>
                    <p className="text-gray-500 font-medium">Control what is shown on your public Lucy Stitches gallery.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-brand-emerald text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-950/10"
                >
                    {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {isAdding ? 'Close Editor' : 'Add New Style'}
                </button>
            </header>

            {isAdding && (
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-in zoom-in-95 duration-300">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Style Title</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g., Luxury Blue Agbada"
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald font-bold"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="Details about the fabric, cut, or inspiration..."
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald font-bold"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Category</label>
                                    <select
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald font-bold"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Agbada</option>
                                        <option>Kaftan</option>
                                        <option>Gown</option>
                                        <option>Suit</option>
                                        <option>Traditional</option>
                                    </select>
                                </div>
                                <div className="flex items-end pb-1">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                                            formData.featured ? "bg-brand-gold text-white" : "bg-slate-100 text-gray-400"
                                        )}
                                    >
                                        <Star className={cn("w-3 h-3", formData.featured && "fill-current")} />
                                        Featured
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col h-full">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Style Photo</label>
                            <div className="flex-1 relative group">
                                {formData.image_url ? (
                                    <div className="relative h-full min-h-[200px] rounded-[2rem] overflow-hidden border border-gray-100">
                                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, image_url: '' })}
                                            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-xl text-red-500 hover:bg-white shadow-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="h-full min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[2rem] cursor-pointer hover:bg-slate-50 hover:border-brand-emerald/30 transition-all group">
                                        {uploading ? (
                                            <Loader2 className="w-8 h-8 animate-spin text-brand-emerald" />
                                        ) : (
                                            <>
                                                <ImageIcon className="w-10 h-10 text-gray-200 mb-4 group-hover:scale-110 transition-transform" />
                                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Upload Masterpiece</span>
                                            </>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                    </label>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="mt-6 w-full py-5 bg-brand-emerald text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-emerald-950/20"
                            >
                                Publish to Gallery
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Showcase List */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Active Gallery Items</h3>
                </div>

                {loading ? (
                    <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-emerald" /></div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {items.map((item) => (
                            <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-black text-gray-900 uppercase tracking-tight">{item.title}</h4>
                                            {item.featured && (
                                                <span className="px-2 py-0.5 bg-brand-gold/10 text-brand-gold text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                                                    <Star className="w-2 h-2 fill-current" /> Featured
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs font-medium text-gray-400">{item.category} • {item.description?.substring(0, 60)}...</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleFeatured(item)}
                                        className={cn(
                                            "p-3 rounded-xl transition-all",
                                            item.featured ? "bg-brand-gold text-white" : "hover:bg-gray-100 text-gray-300"
                                        )}
                                    >
                                        <Star className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {items.length === 0 && (
                            <div className="p-20 text-center text-gray-300 font-bold uppercase text-sm tracking-widest">
                                Gallery is empty. Start showcasing your work!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
