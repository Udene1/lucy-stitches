"use client"

import { useState, useEffect } from 'react'
import { Sparkles, Send, Download, Save, History, Image as ImageIcon, Loader2, Scissors, Calendar, ExternalLink } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function DesignSuggesterPage() {
    const supabase = createClient()
    const [prompt, setPrompt] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedDesign, setGeneratedDesign] = useState(null)
    const [history, setHistory] = useState([])
    const [loadingHistory, setLoadingHistory] = useState(true)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('designs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(4)

            if (error) throw error
            setHistory(data || [])
        } catch (error) {
            console.error('Failed to fetch history:', error)
        } finally {
            setLoadingHistory(false)
        }
    }

    const handleGenerate = async () => {
        if (!prompt.trim()) return
        setIsGenerating(true)
        setGeneratedDesign(null)

        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            })

            const text = await response.text()
            let data
            try {
                data = JSON.parse(text)
            } catch (e) {
                throw new Error('Server returned an invalid response. Please try again later.')
            }

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Failed to generate design')
            }

            setGeneratedDesign(data.design)
            toast.success('Design generated and saved to library!')
            fetchHistory() // Refresh the history trail
        } catch (error) {
            console.error('Generation failed:', error)
            toast.error(error.message || 'Failed to generate design')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleDownload = async (url) => {
        try {
            const response = await fetch(url)
            const blob = await response.blob()
            const blobUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = `tailorpro-design-${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            toast.error('Failed to download image')
        }
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-brand-gold/10 rounded-2xl mb-4">
                    <Sparkles className="w-8 h-8 text-brand-gold" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">AI Design Suggester</h1>
                <p className="text-gray-500 mt-2 text-lg">Generate unique clothing patterns and style ideas for your clients.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-brand-emerald/5 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full -mr-16 -mt-16" />

                <div className="space-y-4 relative z-10">
                    <label className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-brand-gold" />
                        Design Prompt
                    </label>
                    <div className="relative">
                        <textarea
                            placeholder="e.g., A modern Nigerian lace gown with emerald green embroidery and gold accents, off-shoulder style..."
                            className="w-full h-32 px-6 py-4 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-brand-gold outline-none text-gray-700 text-lg transition-all shadow-inner resize-none"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                            className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-white font-bold rounded-2xl hover:bg-amber-700 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-brand-gold/20"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Dreaming...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Generate
                                </>
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Tips: Include colors, fabric types, and specific traditional Nigerian styles for better results.</p>
                </div>
            </div>

            {generatedDesign ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden group relative">
                        <img
                            src={generatedDesign.image_url}
                            alt="AI Generated Design"
                            className="w-full h-auto rounded-[2rem] object-cover shadow-2xl"
                        />
                        <div className="absolute top-10 right-10 flex gap-2">
                            <span className="px-4 py-2 bg-brand-gold text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">New Masterpiece</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => handleDownload(generatedDesign.image_url)}
                            className="inline-flex items-center gap-2 px-10 py-5 bg-gray-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-black hover:scale-105 transition-all shadow-xl shadow-black/20"
                        >
                            <Download className="w-5 h-5" />
                            Download Design
                        </button>
                        <a
                            href={generatedDesign.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-gray-900 border border-gray-100 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <ExternalLink className="w-5 h-5" />
                            Open HD
                        </a>
                    </div>
                </div>
            ) : isGenerating ? (
                <div className="border-2 border-dashed border-brand-gold/20 rounded-[2.5rem] p-32 text-center bg-brand-gold/5 animate-pulse">
                    <Sparkles className="w-16 h-16 text-brand-gold mx-auto mb-6 animate-bounce" />
                    <p className="text-brand-gold/80 font-black uppercase tracking-widest">Designing your fashion future...</p>
                </div>
            ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-[2.5rem] p-24 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                        <ImageIcon className="w-10 h-10 text-gray-200" />
                    </div>
                    <div>
                        <p className="text-gray-400 font-black uppercase text-xs tracking-widest">Masterpieces will appear here</p>
                        <p className="text-gray-300 text-sm mt-1">Ready to create something beautiful?</p>
                    </div>
                </div>
            )}

            <div className="space-y-6 pt-10 border-t border-gray-50">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                        <History className="w-6 h-6 text-brand-emerald" />
                        Production History
                    </h3>
                </div>

                {loadingHistory ? (
                    <div className="flex justify-center p-10">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                    </div>
                ) : history.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {history.map((design) => (
                            <div
                                key={design.id}
                                className="group relative aspect-square bg-slate-50 rounded-[2rem] overflow-hidden border border-gray-100 hover:ring-4 ring-brand-gold transition-all cursor-pointer shadow-sm hover:shadow-xl"
                                onClick={() => setGeneratedDesign(design)}
                            >
                                <img src={design.image_url} alt={design.prompt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                    <p className="text-white text-[10px] font-black uppercase tracking-widest line-clamp-2">{design.prompt}</p>
                                    <p className="text-white/60 text-[8px] font-bold mt-1 inline-flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(design.created_at)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 bg-slate-50 rounded-[2.5rem] text-center">
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Your studio is empty</p>
                    </div>
                )}
            </div>
        </div>
    )
}
