"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit2, Trash2, Scissors, Phone, Mail, Calendar, Package, Camera, Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ClientDetailPage({ params }) {
    const router = useRouter()
    const supabase = createClient()
    const [client, setClient] = useState(null)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const { data: clientData } = await supabase
                .from('clients')
                .select('*')
                .eq('id', params.id)
                .single()

            if (clientData) {
                setClient(clientData)
                const { data: orderData } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('client_id', params.id)
                    .order('created_at', { ascending: false })

                setOrders(orderData || [])
            }
            setLoading(false)
        }
        fetchData()
    }, [params.id])

    if (loading) return (
        <div className="h-[60vh] flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-brand-emerald" />
        </div>
    )

    if (!client) return <div>Client not found</div>

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/clients" className="p-2 hover:bg-white rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{client.name}</h1>
                        <p className="text-gray-500 font-medium">Customer Profile • ID: #{client.id.substring(0, 8)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-3 text-red-600 bg-red-50 rounded-2xl hover:bg-red-100 transition-all border border-red-100">
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-brand-emerald text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10">
                        <Edit2 className="w-5 h-5" />
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Info & Measurements */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Contact Card */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Contact Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                    <Phone className="w-4 h-4 text-brand-emerald" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</p>
                                    <p className="font-bold text-gray-900">{client.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                    <Mail className="w-4 h-4 text-brand-emerald" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</p>
                                    <p className="font-bold text-gray-900">{client.email || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Measurements Card */}
                    <div className="bg-brand-emerald rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-950/10 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black uppercase tracking-tight">Body Measurements</h3>
                            <Scissors className="w-5 h-5 opacity-40" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(client.measurements || {}).map(([key, val]) => (
                                <div key={key} className="p-3 bg-white/10 rounded-2xl border border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{key}</p>
                                    <p className="text-xl font-black">{val}"</p>
                                </div>
                            ))}
                        </div>
                        {Object.keys(client.measurements || {}).length === 0 && (
                            <p className="text-emerald-200/60 text-sm font-medium italic text-center py-4">No measurements recorded yet.</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Order History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Order History</h3>
                            <Link
                                href="/dashboard/orders/new"
                                className="text-sm font-black text-brand-emerald hover:underline"
                            >
                                + New Order
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <div key={order.id} className="p-6 hover:bg-gray-50 transition-all flex items-center justify-between group">
                                    <div className="space-y-1">
                                        <p className="font-black text-gray-900 group-hover:text-brand-emerald transition-colors">{order.description}</p>
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(order.created_at)}</span>
                                            <span className="flex items-center gap-1 uppercase tracking-widest text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600">{order.status}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-gray-900">{formatCurrency(order.price)}</p>
                                        <p className={cn(
                                            "text-[10px] font-black uppercase tracking-widest",
                                            order.payment_status === 'paid' ? "text-emerald-600" : "text-amber-600"
                                        )}>
                                            {order.payment_status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {orders.length === 0 && (
                                <div className="p-12 text-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                                        <Package className="w-8 h-8 text-gray-200" />
                                    </div>
                                    <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No orders found for this client</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions / Photo Feed Placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-brand-gold/10 p-6 rounded-[2rem] border border-brand-gold/20 flex flex-col items-center justify-center text-center space-y-4 group cursor-pointer hover:bg-brand-gold/20 transition-all">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-gold/20 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-6 h-6 text-brand-gold" />
                            </div>
                            <div>
                                <h4 className="font-black text-brand-gold">AI Suggestion</h4>
                                <p className="text-xs text-amber-800/60 font-medium">New design for this client</p>
                            </div>
                        </div>
                        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex flex-col items-center justify-center text-center space-y-4 group cursor-pointer hover:bg-emerald-100 transition-all">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/10 group-hover:scale-110 transition-transform">
                                <Camera className="w-6 h-6 text-brand-emerald" />
                            </div>
                            <div>
                                <h4 className="font-black text-brand-emerald">Photo Vault</h4>
                                <p className="text-xs text-emerald-800/60 font-medium">Add fitting photos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
