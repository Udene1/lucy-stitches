"use client"

import { useState, useEffect } from 'react'
import {
    Users,
    ShoppingBag,
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    Clock,
    Loader2
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function DashboardOverview() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        activeOrders: 0,
        revenue: 0,
        newClients: 0,
        lowStock: 0
    })
    const [recentOrders, setRecentOrders] = useState([])

    useEffect(() => {
        async function fetchDashboardData() {
            setLoading(true)

            try {
                // Fetch Orders stats
                const { data: orders } = await supabase.from('orders').select('status, price, payment_status')
                const active = orders?.filter(o => o.status !== 'delivered').length || 0
                const rev = orders?.filter(o => o.payment_status === 'paid').reduce((acc, o) => acc + o.price, 0) || 0

                // Fetch Clients
                const { count: clientsCount } = await supabase.from('clients').select('*', { count: 'exact', head: true })

                // Fetch Inventory alerts
                const { data: inventory } = await supabase.from('inventory').select('quantity, low_stock_threshold')
                const low = inventory?.filter(i => i.quantity <= i.low_stock_threshold).length || 0

                // Recent Activity
                const { data: recent } = await supabase
                    .from('orders')
                    .select('*, clients(name)')
                    .order('created_at', { ascending: false })
                    .limit(4)

                setStats({
                    activeOrders: active,
                    revenue: rev,
                    newClients: clientsCount || 0,
                    lowStock: low
                })
                setRecentOrders(recent || [])
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [supabase])

    const statCards = [
        { label: 'Active Orders', value: stats.activeOrders, icon: ShoppingBag, color: 'text-brand-emerald', bg: 'bg-emerald-50' },
        { label: 'Total Revenue', value: formatCurrency(stats.revenue), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Clients', value: stats.newClients, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Stock Alerts', value: stats.lowStock, icon: AlertCircle, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
    ]

    if (loading) return (
        <div className="h-[60vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-emerald" />
        </div>
    )

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Workshop Overview</h1>
                <p className="text-gray-500 font-medium">Welcome back, here&apos;s what&apos;s happening today in TailorPro.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((cur, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", cur.bg)}>
                                <cur.icon className={cn("w-6 h-6", cur.color)} />
                            </div>
                            <div className="p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                                <ArrowUpRight className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{cur.label}</p>
                        <h3 className="text-3xl font-black text-gray-900 truncate">{cur.value}</h3>
                    </div>
                ))}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Recent Production</h3>
                        <Link href="/dashboard/orders" className="text-xs font-black text-brand-emerald uppercase tracking-widest hover:underline">View All</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-300 group-hover:bg-brand-emerald group-hover:text-white transition-all">
                                        {order.clients?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{order.description}</h4>
                                        <p className="text-xs font-medium text-gray-400">Order #{order.id.substring(0, 8)} • {order.clients?.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-gray-900 text-sm">{formatCurrency(order.price)}</p>
                                    <span className={cn(
                                        "text-[10px] uppercase font-black tracking-widest",
                                        order.status === 'ready' ? "text-emerald-500" : "text-amber-500"
                                    )}>{order.status}</span>
                                </div>
                            </div>
                        ))}
                        {recentOrders.length === 0 && (
                            <div className="p-10 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
                                No recent activity
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Activity Sidebar */}
                <div className="bg-brand-emerald rounded-[2.5rem] p-8 text-white space-y-8 shadow-xl shadow-emerald-950/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />

                    <div className="relative z-10">
                        <h3 className="text-xl font-black uppercase tracking-tight mb-6">Workshop Radar</h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="mt-1 w-2 h-2 rounded-full bg-brand-gold shrink-0 ring-4 ring-brand-gold/20" />
                                <div>
                                    <p className="text-sm font-black tracking-tight">AI Patterns Ready</p>
                                    <p className="text-xs text-emerald-100/60 font-medium">New designs inspired by Nigerian traditional lace.</p>
                                </div>
                            </div>
                            {stats.lowStock > 0 && (
                                <div className="flex gap-4">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-white shrink-0 opacity-50" />
                                    <div>
                                        <p className="text-sm font-black tracking-tight">Restock Reminder</p>
                                        <p className="text-xs text-emerald-100/60 font-medium">{stats.lowStock} items are dropping below threshold.</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-4">
                                <div className="mt-1 w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                                <div>
                                    <p className="text-sm font-black tracking-tight">System Check</p>
                                    <p className="text-xs text-emerald-100/60 font-medium">All Paystack & SMS gateways are operational.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 space-y-3">
                            <Link
                                href="/dashboard/orders/new"
                                className="w-full flex items-center justify-center gap-2 py-4 bg-brand-gold text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-lg shadow-emerald-950/20"
                            >
                                + New Order
                            </Link>
                            <Link
                                href="/dashboard/clients/new"
                                className="w-full flex items-center justify-center gap-2 py-4 bg-white/10 text-white border border-white/10 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/20 transition-all"
                            >
                                + Register Client
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
