"use client"

import { useState, useEffect } from 'react'
import { Plus, Search, AlertTriangle, Package, History, TrendingDown, DollarSign, Loader2 } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function InventoryPage() {
    const supabase = createClient()
    const [search, setSearch] = useState('')
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [metrics, setMetrics] = useState({ low: 0, total: 0, value: 0 })

    useEffect(() => {
        async function fetchInventory() {
            setLoading(true)
            let query = supabase.from('inventory').select('*')

            if (search) {
                query = query.ilike('item_name', `%${search}%`)
            }

            const { data } = await query.order('item_name')
            if (data) {
                setItems(data)
                const low = data.filter(i => i.quantity <= i.low_stock_threshold).length
                const total = data.reduce((acc, i) => acc + i.quantity, 0)
                const value = data.reduce((acc, i) => acc + (i.quantity * i.price_per_unit), 0)
                setMetrics({ low, total, value })
            }
            setLoading(false)
        }
        fetchInventory()
    }, [search, supabase])

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Inventory</h1>
                    <p className="text-gray-500 mt-1">Monitor fabric stock and supplies for your workshop.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/inventory/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-emerald text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10"
                    >
                        <Plus className="w-5 h-5" />
                        Add Item
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <AlertTriangle className="w-20 h-20 text-amber-600" />
                    </div>
                    <div className="flex items-center gap-3 text-amber-600 mb-2 relative z-10">
                        <AlertTriangle className="w-5 h-5" />
                        <h3 className="font-black text-xs uppercase tracking-widest">Low Stock</h3>
                    </div>
                    <p className="text-4xl font-black text-gray-900 relative z-10">{metrics.low}</p>
                    <p className="text-sm text-gray-500 font-medium relative z-10">Items need restock</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <Package className="w-20 h-20 text-brand-emerald" />
                    </div>
                    <div className="flex items-center gap-3 text-emerald-600 mb-2 relative z-10">
                        <Package className="w-5 h-5" />
                        <h3 className="font-black text-xs uppercase tracking-widest">Total Units</h3>
                    </div>
                    <p className="text-4xl font-black text-gray-900 relative z-10">{metrics.total}</p>
                    <p className="text-sm text-gray-500 font-medium relative z-10">Currently in workshop</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <DollarSign className="w-20 h-20 text-brand-gold" />
                    </div>
                    <div className="flex items-center gap-3 text-brand-gold mb-2 relative z-10">
                        <DollarSign className="w-5 h-5" />
                        <h3 className="font-black text-xs uppercase tracking-widest">Stock Value</h3>
                    </div>
                    <p className="text-3xl font-black text-gray-900 relative z-10">{formatCurrency(metrics.value)}</p>
                    <p className="text-sm text-gray-500 font-medium relative z-10">Estimated worth (₦)</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search inventory items..."
                            className="w-full pl-14 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none text-gray-700 font-medium transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-brand-emerald" />
                        </div>
                    ) : (
                        <>
                            <table className="w-full text-left font-sans">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">Item Detail</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">Stock Level</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">Supplier</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-5"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {items.map((item) => {
                                        const isLow = item.quantity <= item.low_stock_threshold
                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div>
                                                        <p className="font-black text-gray-900">{item.item_name}</p>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Cost: {formatCurrency(item.price_per_unit)} / {item.unit}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn("text-xl font-black", isLow ? "text-amber-600" : "text-gray-900")}>
                                                            {item.quantity}
                                                        </span>
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.unit}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-sm text-gray-500 font-bold uppercase tracking-tight">
                                                    {item.supplier || 'Unspecified'}
                                                </td>
                                                <td className="px-8 py-6">
                                                    {isLow ? (
                                                        <span className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-lg uppercase border border-amber-100">
                                                            Low Stock
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg uppercase border border-emerald-100">
                                                            Secure
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button className="text-xs font-black text-brand-emerald hover:underline uppercase tracking-widest">
                                                        Update
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {items.length === 0 && (
                                <div className="p-20 text-center">
                                    <Package className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest">Inventory is empty</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
