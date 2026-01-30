"use client"

import { useState, useEffect } from 'react'
import { Download, X, Scissors } from 'lucide-react'

export default function PWAInstallPrompt() {
    const [installPrompt, setInstallPrompt] = useState(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Register SW
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then((reg) => {
                console.log('SW registered:', reg.scope)
            })
        }

        const handler = (e) => {
            e.preventDefault()
            setInstallPrompt(e)
            setIsVisible(true)
        }

        window.addEventListener('beforeinstallprompt', handler)

        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    const handleInstall = async () => {
        if (!installPrompt) return

        installPrompt.prompt()
        const { outcome } = await installPrompt.userChoice

        if (outcome === 'accepted') {
            setInstallPrompt(null)
            setIsVisible(false)
        }
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:w-96 z-[9999] animate-in slide-in-from-bottom-10 duration-700">
            <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-950/20 border border-emerald-50 p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-emerald rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/10">
                            <Scissors className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900 uppercase tracking-tight">Lucy Stitches</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Install for faster access</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1 hover:bg-gray-50 rounded-lg text-gray-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <button
                    onClick={handleInstall}
                    className="w-full py-4 bg-brand-emerald text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-800 transition-all flex items-center justify-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Add to Home Screen
                </button>
            </div>
        </div>
    )
}
