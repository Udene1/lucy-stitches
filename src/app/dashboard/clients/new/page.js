"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, User, Phone, Mail, Scissors } from 'lucide-react'
import Link from 'next/link'
import { formatPhoneNumber } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const measurementFields = [
    'Chest', 'Waist', 'Hips', 'Shoulder', 'Sleeve Length',
    'Neck', 'Length', 'Thigh', 'Ankle', 'Knee'
]

export default function NewClientPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        measurements: {}
    })

    const handleMeasurementChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            measurements: {
                ...prev.measurements,
                [field]: value
            }
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('clients')
                .insert([{
                    ...formData,
                    phone: formatPhoneNumber(formData.phone)
                }])

            if (error) throw error

            toast.success('Client added successfully!')
            router.push('/dashboard/clients')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Link
                    href="/dashboard/clients"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Clients
                </Link>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-emerald text-white font-black rounded-2xl hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/10 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Client
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-slate-50">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Register New Client</h1>
                    <p className="text-gray-500 mt-1">Collect personal info and measurements for a new profile.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-12">
                    {/* Basic Info Section */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g., Adaobi Okafor"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        required
                                        type="tel"
                                        placeholder="+234 812 345 6789"
                                        className="w-full pl-11 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-gray-700">Email Address (Optional)</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="client@example.com"
                                        className="w-full pl-11 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Measurements Section */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Scissors className="w-4 h-4" />
                            Body Measurements (Inches)
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {measurementFields.map((field) => (
                                <div key={field} className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500">{field}</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="0.0"
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-center font-bold"
                                        value={formData.measurements[field] || ''}
                                        onChange={(e) => handleMeasurementChange(field, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                </form>
            </div>
        </div>
    )
}
