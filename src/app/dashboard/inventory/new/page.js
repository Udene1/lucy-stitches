"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Package, Truck, Ruler, DollarSign, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function NewInventoryItemPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        item_name: '',
        quantity: '',
        unit: 'yards',
        supplier: '',
        low_stock_threshold: '5',
        price_per_unit: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('inventory')
                .insert([{
                    ...formData,
                    quantity: parseInt(formData.quantity),
                    low_stock_threshold: parseInt(formData.low_stock_threshold),
                    price_per_unit: parseFloat(formData.price_per_unit)
                }])

            if (error) throw error

            toast.success('Inventory item added!')
            router.push('/dashboard/inventory')
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
                    href="/dashboard/inventory"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Inventory
                </Link>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-emerald text-white font-black rounded-2xl hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/10 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Item
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-slate-50">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Add Inventory Item</h1>
                    <p className="text-gray-500 mt-1">Track fabrics, threads, and other tailoring supplies.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-12">
                    {/* Item Details */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Item Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-gray-700">Item Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g., Royal Blue African Lace"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none"
                                    value={formData.item_name}
                                    onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Initial Quantity</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="0"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Unit of Measurement</label>
                                <div className="relative">
                                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select
                                        className="w-full pl-11 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none appearance-none cursor-pointer"
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    >
                                        <option value="yards">Yards</option>
                                        <option value="pieces">Pieces</option>
                                        <option value="rolls">Rolls</option>
                                        <option value="meters">Meters</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sourcing & Alerts */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            Sourcing & Alerts
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Supplier Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Onitsha Main Market"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none"
                                    value={formData.supplier}
                                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Unit Cost (₦)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="number"
                                        placeholder="2,500"
                                        className="w-full pl-11 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none"
                                        value={formData.price_per_unit}
                                        onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    Low Stock Threshold
                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                </label>
                                <input
                                    type="number"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-gold outline-none"
                                    value={formData.low_stock_threshold}
                                    onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                                />
                                <p className="text-xs text-gray-400 font-medium">We'll alert you on the dashboard when stock falls below this number.</p>
                            </div>
                        </div>
                    </section>
                </form>
            </div>
        </div>
    )
}
