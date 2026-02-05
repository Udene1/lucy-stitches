"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Scissors,
    Phone,
    User,
    Image as ImageIcon,
    Zap,
    ArrowRight,
    CheckCircle2,
    Loader2,
    Upload,
    Sparkles,
    Camera,
    MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function BookingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [formData, setFormData] = useState({
        customer_name: '',
        whatsapp_number: '',
        material_photo: null,
        sample_design: null,
        ai_prompt: '',
        ai_generated_url: ''
    })
    const [previews, setPreviews] = useState({
        material: null,
        sample: null
    })

    const handleFileChange = (e, field) => {
        const file = e.target.files[0]
        if (file) {
            setFormData({ ...formData, [field]: file })
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviews({ ...previews, [field === 'material_photo' ? 'material' : 'sample']: reader.result })
            }
            reader.readAsDataURL(file)
        }
    }

    const generateAIDesign = async () => {
        if (!formData.ai_prompt) {
            toast.error("Please describe your design first!")
            return
        }
        setGenerating(true)
        try {
            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: formData.ai_prompt })
            })
            const data = await res.json()
            if (data.success) {
                setFormData({ ...formData, ai_generated_url: data.design.image_url })
                toast.success("Design generated!")
            } else {
                toast.error(data.error || "Failed to generate design")
            }
        } catch (err) {
            toast.error("Something went wrong with AI generation")
        } finally {
            setGenerating(false)
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const data = new FormData()
            data.append('customer_name', formData.customer_name)
            data.append('whatsapp_number', formData.whatsapp_number)
            if (formData.material_photo) data.append('material_photo', formData.material_photo)
            if (formData.sample_design) data.append('sample_design', formData.sample_design)
            data.append('ai_prompt', formData.ai_prompt)
            data.append('ai_generated_url', formData.ai_generated_url)

            const res = await fetch('/api/bookings', {
                method: 'POST',
                body: data
            })
            const result = await res.json()
            if (result.success) {
                toast.success("Booking submitted successfully!")
                setStep(4) // Success step
            } else {
                toast.error(result.error || "Failed to submit booking")
            }
        } catch (err) {
            toast.error("Submission failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-emerald selection:text-white pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 py-6 px-6 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
                        <div className="w-10 h-10 bg-brand-emerald rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/10">
                            <Scissors className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">Lucy Stitches</span>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={cn(
                                    "w-8 h-1.5 rounded-full transition-all duration-500",
                                    step >= s ? "bg-brand-emerald" : "bg-gray-100"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 pt-12">
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-2">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Let's Get Started</h1>
                            <p className="text-gray-500 font-medium">Tell us who you are so we can reach out on WhatsApp.</p>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-gray-100 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Your Name</label>
                                <div className="relative">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input
                                        type="text"
                                        placeholder="Jane Doe"
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none font-bold text-gray-900"
                                        value={formData.customer_name}
                                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">WhatsApp Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input
                                        type="tel"
                                        placeholder="+234..."
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none font-bold text-gray-900"
                                        value={formData.whatsapp_number}
                                        onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => step < 3 && setStep(2)}
                                disabled={!formData.customer_name || !formData.whatsapp_number}
                                className="w-full py-5 bg-brand-emerald text-white font-black rounded-2xl shadow-xl shadow-emerald-900/10 hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                Next Step
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center space-y-2">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">The Material</h1>
                            <p className="text-gray-500 font-medium">Have you bought the fabric? Show us what we're working with!</p>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-gray-100 space-y-8">
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={(e) => handleFileChange(e, 'material_photo')}
                                />
                                <div className={cn(
                                    "aspect-square rounded-[2rem] border-4 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden",
                                    previews.material ? "border-brand-emerald" : "border-gray-100 group-hover:border-brand-emerald/30 group-hover:bg-emerald-50/30"
                                )}>
                                    {previews.material ? (
                                        <img src={previews.material} alt="Material Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                                                <Camera className="w-8 h-8 text-brand-emerald" />
                                            </div>
                                            <p className="font-black text-gray-900 uppercase tracking-widest text-sm">Upload Photo</p>
                                            <p className="text-xs text-gray-400 mt-1">Tap to select or take a photo</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-5 bg-gray-50 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-[2] py-5 bg-brand-emerald text-white font-black rounded-2xl shadow-xl shadow-emerald-900/10 hover:bg-emerald-800 transition-all flex items-center justify-center gap-2"
                                >
                                    Next: Design
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center space-y-2">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">The Design</h1>
                            <p className="text-gray-500 font-medium">Upload a sample or use our AI to generate a vision.</p>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-gray-100 space-y-8">
                            {/* AI Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-blue-600">
                                    <Sparkles className="w-5 h-5" />
                                    <span className="text-xs font-black uppercase tracking-widest">AI Design Studio</span>
                                </div>
                                <div className="space-y-4">
                                    <textarea
                                        placeholder="Describe your dream outfit... (e.g., An emerald lace gown with off-shoulder sleeves)"
                                        className="w-full p-6 bg-blue-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-900 h-32 resize-none italic"
                                        value={formData.ai_prompt}
                                        onChange={(e) => setFormData({ ...formData, ai_prompt: e.target.value })}
                                    />
                                    <button
                                        onClick={generateAIDesign}
                                        disabled={generating || !formData.ai_prompt}
                                        className="w-full py-4 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-900/10 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
                                        {formData.ai_generated_url ? 'Regenerate Vision' : 'Generate Vision with AI'}
                                    </button>
                                </div>
                                {formData.ai_generated_url && (
                                    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border-4 border-blue-100 relative group">
                                        <img src={formData.ai_generated_url} alt="AI Generated" className="w-full h-full object-cover" />
                                        <div className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-lg shadow-lg">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative flex items-center py-4">
                                <div className="flex-grow border-t border-gray-100"></div>
                                <span className="flex-shrink mx-4 text-xs font-black text-gray-300 uppercase tracking-widest">OR</span>
                                <div className="flex-grow border-t border-gray-100"></div>
                            </div>

                            {/* Manual Upload Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <ImageIcon className="w-5 h-5" />
                                    <span className="text-xs font-black uppercase tracking-widest">Upload Your Own Sample</span>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={(e) => handleFileChange(e, 'sample_design')}
                                    />
                                    <div className={cn(
                                        "py-10 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all",
                                        previews.sample ? "border-brand-emerald bg-emerald-50/10" : "border-gray-100 group-hover:border-gray-300"
                                    )}>
                                        {previews.sample ? (
                                            <div className="flex items-center gap-4 px-6">
                                                <img src={previews.sample} alt="Sample" className="w-12 h-12 rounded-lg object-cover" />
                                                <div className="text-left">
                                                    <p className="text-sm font-black text-gray-900">Sample Uploaded</p>
                                                    <p className="text-xs text-gray-500">Tap to change</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="w-6 h-6 text-gray-300 mb-2" />
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Choose Image</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex-1 py-5 bg-gray-50 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-[2] py-5 bg-brand-emerald text-white font-black rounded-2xl shadow-xl shadow-emerald-900/10 hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageSquare className="w-5 h-5" />}
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="text-center py-20 space-y-8 animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-10 border-8 border-white shadow-xl">
                            <CheckCircle2 className="w-12 h-12 text-brand-emerald" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">It's Official!</h1>
                            <p className="text-xl text-gray-500 font-medium max-w-xs mx-auto">
                                We've received your booking. Keep an eye on your WhatsApp, we'll reach out shortly!
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="px-10 py-5 bg-brand-emerald text-white font-black rounded-2xl shadow-xl shadow-emerald-900/10 hover:bg-emerald-800 transition-all uppercase tracking-widest text-sm"
                        >
                            Return Home
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}
