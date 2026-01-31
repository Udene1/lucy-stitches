"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, ShoppingBag, User, Calendar, DollarSign, FileText } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function NewOrderPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [clients, setClients] = useState([])
    const [formData, setFormData] = useState({
        client_id: '',
        description: '',
        deadline: '',
        price: '',
        notes: ''
    })

    useEffect(() => {
        async function fetchClients() {
            const { data } = await supabase.from('clients').select('id, name')
            if (data) setClients(data)
        }
        fetchClients()
    }, [])

    const handleSubmit = async (e) => {
        if (e) e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase
                .from('orders')
                .insert([{
                    ...formData,
                    user_id: user.id
                }])

            if (error) throw error

            toast.success('Order created successfully!')
            router.push('/dashboard/orders')
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
                    href="/dashboard/orders"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Orders
                </Link>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.client_id}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-emerald text-white font-black rounded-2xl hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/10 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Create Order
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-slate-50">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Create New Order</h1>
                    <p className="text-gray-500 mt-1">Assign an order to a client and set deadlines/pricing.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-12">
                    {/* Client Selection */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Client Selection
                        </h2>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Select Client</label>
                            <select
                                required
                                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none appearance-none cursor-pointer"
                                value={formData.client_id}
                                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                            >
                                <option value="">Choose a client...</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {clients.length === 0 && (
                                <p className="text-xs text-amber-600 font-medium">No clients found. Please add a client first.</p>
                            )}
                        </div>
                    </section>

                    {/* Order Details */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            Order Details
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Garment Description</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g., Men's 3-piece Suit or Ankara Gown"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Deadline</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            required
                                            type="date"
                                            className="w-full pl-11 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none"
                                            value={formData.deadline}
                                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Total Price (₦)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            required
                                            type="number"
                                            placeholder="50,000"
                                            className="w-full pl-11 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Internal Notes</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                                    <textarea
                                        placeholder="Specific styling requests, fabric details, etc..."
                                        className="w-full pl-11 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none h-32 resize-none"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </form>
            </div>
        </div>
    )
}
