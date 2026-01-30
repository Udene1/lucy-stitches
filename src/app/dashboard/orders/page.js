"use client"

import { useState, useEffect } from 'react'
import {
    Plus,
    Search,
    Calendar,
    ChevronRight,
    Clock,
    CheckCircle2,
    Truck,
    Briefcase,
    Loader2
} from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const statusConfig = {
    'pending': { label: 'Pending', icon: Clock, bg: 'bg-slate-100', text: 'text-slate-700' },
    'in-progress': { label: 'In Progress', icon: Briefcase, bg: 'bg-blue-100', text: 'text-blue-700' },
    'ready': { label: 'Ready', icon: CheckCircle2, bg: 'bg-emerald-100', text: 'text-emerald-700' },
    'delivered': { label: 'Delivered', icon: Truck, bg: 'bg-indigo-100', text: 'text-indigo-700' },
}

export default function OrdersPage() {
    const supabase = createClient()
    const [activeTab, setActiveTab] = useState('all')
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchOrders() {
            setLoading(true)
            let query = supabase.from('orders').select('*, clients(name)')

            if (activeTab !== 'all') {
                query = query.eq('status', activeTab)
            }

            const { data, error } = await query.order('created_at', { ascending: false })
            if (data) setOrders(data)
            setLoading(false)
        }
        fetchOrders()
    }, [activeTab])

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
                    <p className="text-gray-500 mt-1">Track production status and payment updates.</p>
                </div>
                <Link
                    href="/dashboard/orders/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-emerald text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10"
                >
                    <Plus className="w-5 h-5" />
                    Create Order
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-2xl w-fit overflow-x-auto">
                {['all', ...Object.keys(statusConfig)].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-4 py-2 text-sm font-bold rounded-xl capitalize transition-all whitespace-nowrap",
                            activeTab === tab
                                ? "bg-white text-brand-emerald shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        {tab.replace('-', ' ')}
                    </button>
                ))}
            </div>

            {/* Order List */}
            <div className="grid grid-cols-1 gap-4 min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-emerald" />
                    </div>
                ) : (
                    <>
                        {orders.map((order) => {
                            const status = statusConfig[order.status] || statusConfig['pending']
                            return (
                                <Link
                                    href={`/dashboard/orders/${order.id}`}
                                    key={order.id}
                                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn("p-3 rounded-2xl", status.bg)}>
                                            <status.icon className={cn("w-6 h-6", status.text)} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-gray-900 group-hover:text-brand-emerald transition-colors">
                                                    #{order.id.substring(0, 8)}: {order.description}
                                                </h3>
                                            </div>
                                            <p className="text-gray-500 font-medium">{order.clients?.name}</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    Deadline: {formatDate(order.deadline)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                            <p className="font-black text-xl text-gray-900">{formatCurrency(order.price)}</p>
                                            <span className={cn(
                                                "text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-lg mt-1 inline-block border",
                                                order.payment_status === 'paid' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                    "bg-amber-50 text-amber-700 border-amber-100"
                                            )}>
                                                {order.payment_status}
                                            </span>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-brand-emerald group-hover:bg-emerald-50 transition-all">
                                            <ChevronRight className="w-6 h-6" />
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                        {orders.length === 0 && (
                            <div className="p-20 text-center bg-white rounded-3xl border border-gray-100">
                                <Search className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No orders found in this category</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
