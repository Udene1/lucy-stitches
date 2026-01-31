"use client"

import { useState, useEffect } from 'react'
import { Sparkles, Send, Download, Save, History, Image as ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function DesignSuggesterPage() {
    const [prompt, setPrompt] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedImage, setGeneratedImage] = useState(null)

    const handleGenerate = async () => {
        if (!prompt.trim()) return
        setIsGenerating(true)
        setGeneratedImage(null)

        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            })

            const data = await response.json()
            if (data.error) throw new Error(data.error)

            setGeneratedImage(data.design.image_url)
        } catch (error) {
            console.error('Generation failed:', error)
            toast.error(error.message || 'Failed to generate design')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-brand-gold/10 rounded-2xl mb-4">
                    <Sparkles className="w-8 h-8 text-brand-gold" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">AI Design Suggester</h1>
                <p className="text-gray-500 mt-2 text-lg">Generate unique clothing patterns and style ideas for your clients.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-brand-emerald/5 border border-gray-100">
                <div className="space-y-4">
                    <label className="text-sm font-black text-gray-700 uppercase tracking-wider">Design Prompt</label>
                    <div className="relative">
                        <textarea
                            placeholder="e.g., A modern Nigerian lace gown with emerald green embroidery and gold accents, off-shoulder style..."
                            className="w-full h-32 px-6 py-4 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-brand-gold outline-none text-gray-700 text-lg transition-all resize-none"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                            className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-white font-bold rounded-2xl hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-gold/20"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating...
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

            {generatedImage ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="bg-white p-4 rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden group">
                        <img
                            src={generatedImage}
                            alt="AI Generated Design"
                            className="w-full h-auto rounded-[1.5rem] object-cover"
                        />
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all">
                            <Save className="w-5 h-5" />
                            Save to Library
                        </button>
                        <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 border border-gray-200 font-bold rounded-2xl hover:bg-gray-50 transition-all">
                            <Download className="w-5 h-5" />
                            Download Image
                        </button>
                    </div>
                </div>
            ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                        <ImageIcon className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-gray-400 font-bold">Generated designs will appear here</p>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <History className="w-5 h-5 text-gray-400" />
                        Recent Inspirations
                    </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square bg-slate-100 rounded-2xl overflow-hidden cursor-pointer hover:ring-4 ring-brand-gold transition-all">
                            <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-xs">design prev {i}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
